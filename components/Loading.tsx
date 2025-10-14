import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

interface LoadingProps {
  style?: StyleProp<ViewStyle>;
  size?: number | 'small' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({ style, size = 'small' }) => {
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
      <ActivityIndicator color={'#000'} animating={true} size={size} />
    </View>
  );
};
