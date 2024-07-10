import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const GestureMoveElement = () => {
  const [assets = []] = useAssets([require('~/assets/images/chameleon.jpg')]);

  // Animation
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      borderRadius: withTiming(isPressed.value ? 60 : 16),
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      offset.value = { x: start.value.x + translationX, y: start.value.y + translationY };
    })
    .onEnd(() => {
      start.value = { x: offset.value.x, y: offset.value.y };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Gesture Move Element',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
        ]}>
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

export default GestureMoveElement;

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
  },
});
