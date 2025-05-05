import { PaintStyle, rect, Skia } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ColorConversionCodes, ContourApproximationModes, Mat, MorphShapes, MorphTypes, ObjectType, OpenCV, Rect, RetrievalModes, RotateFlags } from 'react-native-fast-opencv';
import { Camera, DrawableFrame, useCameraDevice, useCameraPermission, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useRunOnJS } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

const paint = Skia.Paint();
paint.setStyle(PaintStyle.Fill);
paint.setColor(Skia.Color('red'));
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

  const [cardData, setCardData] = useState<string[] | null>(null);
  const setRoiData = useRunOnJS((data: string[]) => {
    setCardData(data);
  }, []);

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
      const rois: string[] = [];

      for (const rect of rectangles) {
        const rectangle = OpenCV.toJSValue(rect);

        const roi = OpenCV.createObject(ObjectType.Mat, rectangle.height, rectangle.width, 3);
        OpenCV.invoke('crop', source, roi, rect);
        OpenCV.invoke('rotate', roi, roi, RotateFlags.ROTATE_90_CLOCKWISE);

        const roiData = OpenCV.toJSValue(roi, "png");
        rois.push(roiData.base64);

        frame.drawRect({
          x: rectangle.x / ratio,
          y: rectangle.y / ratio,
          width: rectangle.width / ratio,
          height: rectangle.height / ratio
        }, paint);
      }

      setRoiData(rois);
    }

    OpenCV.clearBuffers();
  }, []);

  const handleScan = () => {
    console.log(`Detected ${cardData?.length} card(s).`);
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
        enableFpsGraph={true}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <Button title={"Scan"} onPress={handleScan} />
      </View>
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




