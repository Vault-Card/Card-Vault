import { Center } from '@/components/ui/center';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { AddIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorConversionCodes, ContourApproximationModes, DataTypes, Mat, MorphShapes, MorphTypes, ObjectType, OpenCV, Rect, RetrievalModes, RotateFlags } from 'react-native-fast-opencv';
import { Camera, DrawableFrame, useCameraDevice, useCameraPermission, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

const paint = Skia.Paint();
paint.setStyle(PaintStyle.Fill);
paint.setColor(Skia.Color('green'));
paint.setAlphaf(0.3);

function preprocessImage(image: Mat): Mat {
  'worklet';

  const processed = OpenCV.invoke('clone', image);

  const kernel = OpenCV.createObject(ObjectType.Size, 4, 4);
  const blurKernel = OpenCV.createObject(ObjectType.Size, 7, 7);
  const structuringElement = OpenCV.invoke('getStructuringElement', MorphShapes.MORPH_ELLIPSE, kernel);

  OpenCV.invoke('cvtColor', processed, processed, ColorConversionCodes.COLOR_BGR2GRAY);
  OpenCV.invoke('morphologyEx', processed, processed, MorphTypes.MORPH_OPEN, structuringElement);
  OpenCV.invoke('GaussianBlur', processed, processed, blurKernel, 0);
  OpenCV.invoke('Canny', processed, processed, 75, 100);

  return processed;
}

function findRectangles(image: Mat) {
  'worklet';

  const contours = OpenCV.createObject(ObjectType.PointVectorOfVectors);
  OpenCV.invoke('findContours', image, contours, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_SIMPLE);

  const contoursMats = OpenCV.toJSValue(contours);
  const rectangles: Rect[] = [];

  for (let i = 0; i < contoursMats.array.length; i++) {
    const contour = OpenCV.copyObjectFromVector(contours, i);
    const peri = OpenCV.invoke('arcLength', contour, true);

    const approx = OpenCV.createObject(ObjectType.PointVector);
    OpenCV.invoke('approxPolyDP', contour, approx, 0.1 * peri.value, true);

    const { value: area } = OpenCV.invoke('contourArea', approx, false);

    if (area > 10000) {
      const rect = OpenCV.invoke('boundingRect', contour);
      rectangles.push(rect);
    }
  }

  return rectangles;
}

export default function Scan() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const { resize } = useResizePlugin();

  const toast = useToast();
  const [toastId, setToastId] = useState<string>('');
  const rois = useSharedValue<string[] | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const frameProcessor = useSkiaFrameProcessor((frame: DrawableFrame) => {
    'worklet';

    const ratio = 500 / frame.width;
    const height = frame.height * ratio;
    const width = frame.width * ratio;

    const resized = resize(frame, { dataType: 'uint8', pixelFormat: 'bgr', scale: { width: width, height: height } });
    const source = OpenCV.bufferToMat('uint8', height, width, 3, resized);
    const preprocessed = preprocessImage(source);
    const rectangles: Rect[] = findRectangles(preprocessed);

    frame.render();

    if (rectangles.length > 0) {
      rois.value = [];

      for (const rect of rectangles) {
        const rectangle = OpenCV.toJSValue(rect);

        frame.drawRect({
          x: rectangle.x / ratio,
          y: rectangle.y / ratio,
          width: rectangle.width / ratio,
          height: rectangle.height / ratio
        }, paint);

        const roi = OpenCV.createObject(ObjectType.Mat, rectangle.height, rectangle.width, DataTypes.CV_8U);
        OpenCV.invoke('crop', source, roi, rect);
        OpenCV.invoke('rotate', roi, roi, RotateFlags.ROTATE_90_CLOCKWISE);

        const roiData = OpenCV.toJSValue(roi, 'png');
        rois.value.push(roiData.base64);
      }
    }

    OpenCV.clearBuffers();
  }, []);

  const showToast = (title: string, message: string, type: 'error' | 'warning' | 'success' | 'info' | 'muted') => {
    const newId = Math.random().toString();
    setToastId(newId);

    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueId = `toast-${id}`
        return (
          <Toast nativeID={uniqueId} action={type} variant='solid'>
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        )
      }
    });
  }

  const handleScan = async () => {
    if (rois.value != null && rois.value.length > 0) {
      try {
        setScanning(true);
        const response = await fetch('http://ec2-3-14-27-78.us-east-2.compute.amazonaws.com:5000/uploads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'image_data': rois.value[0] })
        })

        if (response.status == 201) {
          const data = await response.json();
          console.log(data);
        }
      } catch (error: any) {
        if (!toast.isActive(toastId)) {
          showToast('Error', 'Could not scan card.', 'error')
        }
      }
      finally {
        setScanning(false);
      }
    }
  };

  if (!hasPermission || device == null) {
    return <Text>Card Vault could not access a camera.</Text>
  }

  return (
    <View style={styles.container}>
      <Camera
        device={device}
        frameProcessor={frameProcessor}
        isActive={true}
        style={StyleSheet.absoluteFill}
      />
      {
        scanning &&
        <Center className='bg-primary-200/80 h-[100%] w-[100%]'>
          <HStack space='sm'>
            <Spinner size='large' />
            <Text className='text-gray-50' size='4xl'>Identifying...</Text>
          </HStack>
        </Center>
      }
      <Fab
        size='lg'
        placement='bottom center'
        onPress={handleScan}
        isDisabled={scanning}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Scan</FabLabel>
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center'
  }
});
