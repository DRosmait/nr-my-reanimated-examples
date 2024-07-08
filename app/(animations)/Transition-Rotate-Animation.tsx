import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const TransitionRotateAnimation = () => {
  const [assets = []] = useAssets([
    require('~/assets/images/chameleon.jpg'),
    require('~/assets/images/pain-boom.jpg'),
    require('~/assets/images/pink-buble.jpg'),
  ]);

  const rotationOne = useSharedValue(0);
  const rotationOneStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withSpring(`${rotationOne.value}deg`) }],
    };
  });

  const rotationTwo = useSharedValue(0);
  const rotationTwoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withSpring(`${rotationTwo.value}deg`) }],
    };
  });

  const onRotate = () => {
    rotationOne.value = rotationOne.value === 0 ? -36 : 0;
    rotationTwo.value = rotationTwo.value === 0 ? 36 : 0;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Transition Rotate Animation',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
        ]}>
        <View
          style={[
            sharedStyles.flex1,
            sharedStyles.containerPaddingHorizontal,
            styles.imagesSection,
          ]}>
          <View style={styles.imagesWrapper}>
            {assets.map((image, idx) => (
              <AnimatedImage
                key={idx}
                source={{ uri: image.uri }}
                style={[styles.image, idx === 0 && rotationOneStyle, idx === 2 && rotationTwoStyle]}
              />
            ))}
          </View>
        </View>

        <View style={sharedStyles.containerPaddingVertical}>
          <Button title="Animate" onPress={onRotate} />
        </View>
      </View>
    </>
  );
};

export default TransitionRotateAnimation;

const styles = StyleSheet.create({
  imagesSection: {
    justifyContent: 'center',
  },
  imagesWrapper: {
    width: '100%',
    aspectRatio: 1.5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    width: '100%',
    aspectRatio: 1.5,
    transformOrigin: 'left center',
  },
});
