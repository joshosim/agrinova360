import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

interface LoadingProps {
  style?: StyleProp<ViewStyle>;
}

export const Loading: React.FC<LoadingProps> = ({ style }) => {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        style,
      ]}
    >
      <ActivityIndicator color={'#000'} animating={true} size="small" />
    </View>
  );
};
