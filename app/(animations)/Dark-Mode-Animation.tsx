import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const useAnimatedBackgroundStyle = (initialValue: string) => {
  const bgColor = useSharedValue(initialValue);
  const style = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bgColor.value, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));
  const setColor = (color: string) => {
    bgColor.value = color;
  };

  return { style, setColor };
};

export default function DarkModeAnimation() {
  const [darkMode, setDarkMode] = useState(false);

  const [assets = []] = useAssets([require('~/assets/images/chameleon.jpg')]);

  const mainBackground = useAnimatedBackgroundStyle('white');
  const secondaryBackground = useAnimatedBackgroundStyle('blue');

  const toggleDarkMode = () =>
    setDarkMode((prev) => {
      mainBackground.setColor(darkMode ? 'white' : 'black');
      secondaryBackground.setColor(darkMode ? 'blue' : 'darkblue');
      return !prev;
    });

  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Dark Mode Animation',
          headerBackground: () => (
            <Animated.View style={[StyleSheet.absoluteFill, secondaryBackground.style]} />
          ),
          headerTintColor: 'white',
        }}
      />

      <ScrollView
        style={sharedStyles.flex1}
        contentContainerStyle={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <Animated.View style={[StyleSheet.absoluteFill, mainBackground.style]} />

        {assets?.[0] && (
          <Image
            source={{ uri: assets[0].uri }}
            style={{ height: 160, aspectRatio: 1, borderRadius: 160 }}
            resizeMode="cover"
          />
        )}
      </ScrollView>

      <Animated.View style={[secondaryBackground.style, { paddingBottom: safeAreaBottom }]}>
        <View
          style={[sharedStyles.containerPaddingHorizontal, sharedStyles.containerPaddingVertical]}>
          <Button
            onPress={toggleDarkMode}
            title={darkMode ? 'Toggle to light' : 'Toggle to dark'}
          />
        </View>
      </Animated.View>
    </>
  );
}
