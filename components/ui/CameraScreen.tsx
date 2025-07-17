import React from 'react';
import { Text, View } from 'react-native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function CameraScreen() {

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera'
    ]
  })

  const { hasPermission } = useCameraPermission()

  // if (!hasPermission) {
  //   Alert.alert('Camera Permission', 'Camera permission is required to use this feature.');
  //   return null;
  // }
  // if (device == null) {
  //   Alert.alert('Camera Device', 'No camera device is available.');
  //   return null;
  // }

  return (
    // <Camera
    //   style={StyleSheet.absoluteFill}
    //   device={device}
    //   isActive={true}
    // />
    <View>
      <Text>Camera Screen</Text>
      {/* Add camera UI components here */}
    </View>
  )
}
