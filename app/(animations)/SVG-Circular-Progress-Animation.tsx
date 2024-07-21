import chroma from 'chroma-js';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const STROCK_WIDTH = 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircleItemProps {
  color: string;
  size: number;
  progress: number;
}
const CircleItem = ({ color, size, progress }: CircleItemProps) => {
  const radius = (size - STROCK_WIDTH) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // calculate the full circumference (lenght of the circle)
  const fullCircumference = 2 * radius * Math.PI;
  // stroke dash offset it the length of the circle where we DON'T SHOW the stroke
  // so, it is full circumference minus the progress left (progress = 0.7, rest = 1 - 0.7 = 0.3)
  const strokeDashoffsetProp = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(fullCircumference * (1 - progress), {
      damping: 100,
      stiffness: 10,
    }),
  }));

  const bgColor = chroma(color).darken(4.5).hex();

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      {/* Background circle */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={bgColor}
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
        strokeLinecap="round"
        strokeDasharray={`${fullCircumference} ${fullCircumference}`}
        strokeWidth={STROCK_WIDTH}
        animatedProps={strokeDashoffsetProp}
      />
    </Svg>
  );
};

const { width } = Dimensions.get('window');

const size1 = width - 40;
const size2 = size1 - STROCK_WIDTH * 2;
const size3 = size2 - STROCK_WIDTH * 2;

const SVGCircularProgressAnimation = () => {
  const [progress1, setProgress1] = useState(0.01);
  const [progress2, setProgress2] = useState(0.01);
  const [progress3, setProgress3] = useState(0.01);

  const circlesData = [
    { progress: progress1, setter: setProgress1, size: size1, color: '#DF0B18' },
    { progress: progress2, setter: setProgress2, size: size2, color: '#49E101' },
    { progress: progress3, setter: setProgress3, size: size3, color: '#00C3DD' },
  ];

  useEffect(() => {
    circlesData.forEach(({ setter }, idx) =>
      setTimeout(() => setter(Math.random()), 300 * (idx + 1))
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'SVG Circular Progress Animation',
        }}
      />

      <SafeAreaView style={[sharedStyles.flex1, { backgroundColor: 'black' }]}>
        <View style={sharedStyles.flex1}>
          {circlesData.map((props, idx) => (
            <View key={idx} style={styles.container}>
              <CircleItem {...props} />
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {circlesData.map(({ setter }, idx) => (
            <Button key={idx} title={`Trigger ${idx + 1}`} onPress={() => setter(Math.random())} />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default SVGCircularProgressAnimation;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
});
