import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Ellipse } from 'react-native-svg';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const SVGCirclePanAnimation = () => {
  const { width, height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const { top: safeAreaTop } = useSafeAreaInsets();

  const containerWidth = width;
  const containerHeight = height - headerHeight - safeAreaTop;

  const center = { x: containerWidth / 2, y: containerHeight / 2 };
  const radius = 100;

  const radiusOffset = useSharedValue({ x: radius, y: radius });

  const isActive = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onChange(() => {
      isActive.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      radiusOffset.value = {
        x:
          Math.sign(translationX) > 0
            ? Math.min(radius + translationX, center.x)
            : Math.max(radius + translationX, 10),
        y:
          Math.sign(translationY) > 0
            ? Math.max(radius - translationY, 10)
            : Math.min(radius + translationY * -1, center.y),
      };
    })
    .onFinalize(() => {
      radiusOffset.value = { x: withSpring(100), y: withSpring(100) };
      isActive.value = true;
    });

  const ellipseProps = useAnimatedProps(() => ({
    rx: radiusOffset.value.x,
    ry: radiusOffset.value.y,
  }));

  return (
    <>
      <Stack.Screen
        options={{
          title: 'SVG Circle Pan Animation',
        }}
      />
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={{ flex: 1 }}>
            <Svg style={StyleSheet.absoluteFill}>
              <AnimatedEllipse
                cx={center.x}
                cy={center.y}
                fill="blue"
                animatedProps={ellipseProps}
              />
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  );
};

export default SVGCirclePanAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
