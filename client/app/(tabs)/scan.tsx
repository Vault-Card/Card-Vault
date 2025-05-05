import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function Scan() {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (!hasPermission || device == null) {
    return <Text>Card Vault could not access a camera.</Text>
  }

  return (
    <Camera
      device={device}
      isActive={true}
      style={StyleSheet.absoluteFill}
    />
  );
}