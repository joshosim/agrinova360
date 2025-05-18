import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';

const { height } = Dimensions.get('window');

const CustomBottomSheet = ({ visible, onClose, children, sheetHeight = '50%' }: any) => {
  // Convert percentage string to number
  const calculatedHeight = typeof sheetHeight === 'string' && sheetHeight.includes('%')
    ? height * (parseInt(sheetHeight) / 100)
    : sheetHeight;

  // Animation value for the bottom sheet position
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Handle for the drag indicator
  const dragIndicator = useRef(null);

  // Pan responder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Only allow downward dragging
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        // If dragged more than 100px down, close the sheet
        if (gestureState.dy > 100) {
          closeSheet();
        } else {
          // Otherwise snap back to open position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animation to open the bottom sheet
  const openSheet = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  // Animation to close the bottom sheet
  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  // Run open animation when visible changes
  useEffect(() => {
    if (visible) {
      openSheet();
    }
  }, [visible]);

  // If not visible, don't render
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={closeSheet}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              height: calculatedHeight,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Drag handle */}
          <View
            style={styles.dragHandleContainer}
            ref={dragIndicator}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragHandle} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CECECE',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default CustomBottomSheet;