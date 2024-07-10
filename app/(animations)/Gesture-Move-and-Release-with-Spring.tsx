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

const GestureMoveandReleaseWithSpring = () => {
  const [assets = []] = useAssets([require('~/assets/images/chameleon.jpg')]);

  // Animation
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

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
      offset.value = { x: translationX, y: translationY };
    })
    .onEnd(() => {
      offset.value = { x: withSpring(0), y: withSpring(0) };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Gesture Move and Release with Spring',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
          styles.container,
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

export default GestureMoveandReleaseWithSpring;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
});
