import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const IMAGE_SIZE = 120;
const BOUNDARY_OFFSET = 20;

const GestureMoveandReleaseElementSpringEnd = () => {
  const [assets = []] = useAssets([require('~/assets/images/chameleon.jpg')]);

  // Animation
  const isPressed = useSharedValue(false);
  // NOTICE: withDecay seems to work correctly with starring point only if offsetX and offsetY are used separately
  // So, do not use `offset = useSharedValue({ x: 0, y: 0 })` here
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      borderRadius: withTiming(isPressed.value ? IMAGE_SIZE / 2 : 16),
    };
  });

  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  // NOTICE: get container size
  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
    containerHeight.value = event.nativeEvent.layout.height;
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onChange(({ changeX, changeY }) => {
      offsetX.value += changeX;
      offsetY.value += changeY;
    })
    .onEnd((event) => {
      // NOTICE: clamp the image to the container
      const x_clampRange: [number, number] = [
        -(containerWidth.value / 2) + IMAGE_SIZE / 2 + BOUNDARY_OFFSET,
        containerWidth.value / 2 - IMAGE_SIZE / 2 - BOUNDARY_OFFSET,
      ];
      offsetX.value = withDecay({
        velocity: event.velocityX,
        deceleration: 0.998,
        clamp: x_clampRange,
        velocityFactor: 0.7,
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
        reduceMotion: ReduceMotion.System,
      });

      const y_clampRange: [number, number] = [
        -(containerHeight.value / 2) + IMAGE_SIZE / 2 + BOUNDARY_OFFSET,
        containerHeight.value / 2 - IMAGE_SIZE / 2 - BOUNDARY_OFFSET,
      ];
      offsetY.value = withDecay({
        velocity: event.velocityY,
        deceleration: 0.998,
        clamp: y_clampRange,
        velocityFactor: 0.7,
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
        reduceMotion: ReduceMotion.System,
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Gesture Move and Release with Decay',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
          styles.container,
        ]}
        onLayout={onLayout}>
        {!!assets?.[0] && (
          <GestureDetector gesture={gesture}>
            <AnimatedImage
              source={{ uri: assets?.[0].uri }}
              style={[styles.image, animatedStyle]}
            />
          </GestureDetector>
        )}
      </View>
    </>
  );
};

export default GestureMoveandReleaseElementSpringEnd;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
