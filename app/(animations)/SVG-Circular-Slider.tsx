import chroma from 'chroma-js';
import { Stack } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { canvas2Polar, polar2Canvas } from 'react-native-redash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';

import { sharedStyles } from '~/styles/sharedStyles';

const STROCK_WIDTH = 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  color: string;
  size: number;
  progress: number;
}
const CircularProgress = ({ color, size, progress }: CircularProgressProps) => {
  const radius = (size - STROCK_WIDTH) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const fullCircumference = 2 * radius * Math.PI;
  const strokeDashoffsetProp = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(fullCircumference * (1 - progress), {
      damping: 100,
      stiffness: 10,
    }),
  }));

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="lightgrey"
        fill="none"
        strokeLinecap="round"
        strokeWidth={STROCK_WIDTH}
      />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        fill="none"
        strokeLinecap="square"
        strokeDasharray={`${fullCircumference} ${fullCircumference}`}
        strokeWidth={STROCK_WIDTH}
        animatedProps={strokeDashoffsetProp}
      />
    </Svg>
  );
};

interface CursorProps {
  theta: SharedValue<number>;
  size: number;
  radius: number;
  color: string;
}
const Cursor = ({ theta, size, radius, color }: CursorProps) => {
  const center = { x: radius, y: radius };

  const start = useSharedValue({ x: 0, y: 0 });
  const translation = useSharedValue({ x: 0, y: 0 });
  const bgColor = useSharedValue(color);

  useLayoutEffect(() => {
    bgColor.value = withTiming(color);
  }, [color]);

  const gesture = Gesture.Pan()
    .onUpdate(({ translationX, translationY }) => {
      translation.value = {
        x: translationX,
        y: translationY,
      };

      theta.value = canvas2Polar(
        { x: start.value.x + translation.value.x, y: start.value.y + translation.value.y },
        center
      ).theta;
    })
    .onEnd(({ translationX, translationY }) => {
      start.value = {
        x: start.value.x + translationX,
        y: start.value.y + translationY,
      };
      translation.value = { x: 0, y: 0 };
    });

  const animatedStyles = useAnimatedStyle(() => {
    const { x: translateX, y: translateY } = polar2Canvas({ theta: theta.value, radius }, center);

    return {
      transform: [{ translateX }, { translateY }],
      backgroundColor: bgColor.value,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
          animatedStyles,
        ]}
      />
    </GestureDetector>
  );
};

const { width } = Dimensions.get('window');
const size = width - STROCK_WIDTH;

const radius = PixelRatio.roundToNearestPixel(size / 2);

const SVGCircularSlider = () => {
  const theta = useSharedValue(0);

  const cursorRadius = radius - STROCK_WIDTH / 2;
  const start = useSharedValue(
    canvas2Polar({ x: 0, y: 0 }, { x: cursorRadius, y: cursorRadius }).theta
  );
  const end = useSharedValue(
    canvas2Polar({ x: 0, y: 0 }, { x: cursorRadius, y: cursorRadius }).theta
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'SVG Circular Slider',
        }}
      />

      <SafeAreaView style={sharedStyles.flex1}>
        <View style={styles.container}>
          <View style={styles.content}>
            <CircularProgress size={size} color="blue" progress={0.7} />

            <Cursor
              theta={start}
              size={STROCK_WIDTH}
              radius={radius - STROCK_WIDTH / 2}
              color="red"
            />
            <Cursor
              theta={end}
              size={STROCK_WIDTH}
              radius={radius - STROCK_WIDTH / 2}
              color="green"
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SVGCircularSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: radius * 2,
    height: radius * 2,
  },
});
