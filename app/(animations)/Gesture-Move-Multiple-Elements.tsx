import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const IMAGE_WIDTH = 240;
const IMAGE_HEIGHT = IMAGE_WIDTH / 1.5;

const GestureMoveMultipleElements = () => {
  const [assets = []] = useAssets([
    require('~/assets/images/chameleon.jpg'),
    require('~/assets/images/pain-boom.jpg'),
    require('~/assets/images/pink-buble.jpg'),
  ]);

  // Animation
  const isPressed = useSharedValue(false);
  const originOffset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: originOffset.value.x },
      { translateY: originOffset.value.y },
      { scale: withSpring(isPressed.value ? 1.2 : 1) },
    ],
    borderRadius: withTiming(isPressed.value ? 20 : 12),
  }));

  // NOTICE: create separate shared values for each X and Y, otherwise, the animation will be broken for the third image
  // only separate shared values for X and Y will work correctly
  // We use `useDerivedValue` to create a new shared value based on the current value of another shared value, and `withSpring` provides some delay for the animation
  const secondOffsetX = useDerivedValue(() => withSpring(originOffset.value.x));
  const secondOffsetY = useDerivedValue(() => withSpring(originOffset.value.y));
  const secondAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: secondOffsetX.value },
      { translateY: secondOffsetY.value },
      { scale: withSpring(isPressed.value ? 1.2 : 1) },
    ],
    borderRadius: withTiming(isPressed.value ? 20 : 12),
  }));

  const thirdOffsetX = useDerivedValue(() => withSpring(secondOffsetX.value));
  const thirdOffsetY = useDerivedValue(() => withSpring(secondOffsetY.value));
  const thirdAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: thirdOffsetX.value },
      { translateY: thirdOffsetY.value },
      { scale: withSpring(isPressed.value ? 1.2 : 1) },
    ],
    borderRadius: withTiming(isPressed.value ? 20 : 12),
  }));

  const animatedStyles = [animatedStyle, secondAnimatedStyle, thirdAnimatedStyle];

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      originOffset.value = { x: start.value.x + translationX, y: start.value.y + translationY };
    })
    .onEnd(() => {
      start.value = { x: originOffset.value.x, y: originOffset.value.y };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Gesture Move Multiple Elements',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
          styles.container,
        ]}>
        {assets.map(({ uri }, idx) =>
          idx === 0 ? (
            <GestureDetector gesture={gesture} key={uri}>
              <AnimatedImage
                source={{ uri }}
                style={[
                  styles.image,
                  animatedStyles[idx],
                  { top: -idx * IMAGE_HEIGHT, zIndex: assets.length - idx },
                ]}
              />
            </GestureDetector>
          ) : (
            <AnimatedImage
              key={uri}
              source={{ uri }}
              style={[
                styles.image,
                animatedStyles[idx],
                { top: -idx * IMAGE_HEIGHT, zIndex: assets.length - idx },
              ]}
            />
          )
        )}
      </View>
    </>
  );
};

export default GestureMoveMultipleElements;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
