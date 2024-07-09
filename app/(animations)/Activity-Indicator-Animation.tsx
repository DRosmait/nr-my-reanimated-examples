import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sharedStyles } from '~/styles/sharedStyles';

const useForthAnimation = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(4, { duration: 1800, easing: Easing.linear }), -1);
  }, []);

  const style1 = useAnimatedStyle(() => {
    const value = interpolate(clamp(progress.value, 0, 2), [0, 1, 2], [0.5, 1.5, 0.5]);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });
  const style2 = useAnimatedStyle(() => {
    const value = interpolate(clamp(progress.value, 1, 3), [1, 2, 3], [0.5, 1.5, 0.5]);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });
  const style3 = useAnimatedStyle(() => {
    const value = interpolate(clamp(progress.value, 2, 4), [2, 3, 4], [0.5, 1.5, 0.5]);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });

  return [style1, style2, style3];
};

const useBackAndForthAnimation = () => {
  const progress = useSharedValue(1);
  useEffect(() => {
    progress.value = withRepeat(withTiming(3, { duration: 1200, easing: Easing.linear }), -1, true);
  }, []);

  const style1 = useAnimatedStyle(() => {
    const value = interpolate(progress.value, [1, 2], [1.5, 0.5], Extrapolation.CLAMP);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });
  const style2 = useAnimatedStyle(() => {
    const value = interpolate(progress.value, [1, 2, 3], [0.5, 1.5, 0.5], Extrapolation.CLAMP);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });
  const style3 = useAnimatedStyle(() => {
    const value = interpolate(progress.value, [2, 3], [0.5, 1.5], Extrapolation.CLAMP);
    return {
      transform: [{ scale: value }],
      opacity: value,
    };
  });

  return [style1, style2, style3];
};

interface AnimationType {
  id: 'forth' | 'back-and-forth';
  name: string;
}
const animationTypes: AnimationType[] = [
  { id: 'forth', name: 'Forth Animation' },
  { id: 'back-and-forth', name: 'Back and Forth Animation' },
];

export default function ActivityIndicatorAnimation() {
  const [currentAnimationTypeId, setCurrentAnimationTypeId] = useState<AnimationType['id']>(
    animationTypes[0].id
  );

  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const forthAnimationStyles = useForthAnimation();
  const backAndForthAnimationStyles = useBackAndForthAnimation();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Activity Indicator Animation',
        }}
      />

      <View style={[sharedStyles.flex1, styles.container]}>
        <View style={styles.activityIndicator}>
          {(currentAnimationTypeId === 'forth'
            ? forthAnimationStyles
            : backAndForthAnimationStyles
          ).map((style, index) => (
            <Animated.View key={index} style={[styles.activityIndicatorBuble, style]} />
          ))}
        </View>
      </View>

      <View
        style={[
          sharedStyles.containerPaddingVertical,
          sharedStyles.containerPaddingHorizontal,
          { paddingBottom: safeAreaBottom },
        ]}>
        {animationTypes.map(({ id, name }) => (
          <TouchableOpacity
            key={id}
            onPress={() => setCurrentAnimationTypeId(id)}
            style={[
              {
                backgroundColor: id === currentAnimationTypeId ? 'blue' : 'gray',
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              },
            ]}>
            <Text style={{ color: 'white' }}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 200,
    borderBottomRightRadius: 0,
    backgroundColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14%',
  },
  activityIndicatorBuble: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: 'blue',
  },
});
