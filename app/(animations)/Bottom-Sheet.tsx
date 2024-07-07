import { Stack } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BottomSheet = () => {
  // Bottom Sheet
  const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
  const showBottomSheet = () => setBottomSheetVisible(true);
  const hideBottomSheet = () => setBottomSheetVisible(false);

  return (
    <>
      <Stack.Screen options={{ title: 'Bottom Sheet' }} />
      <View style={sharedStyles.flex1}>
        <View
          style={[sharedStyles.containerPaddingHorizontal, sharedStyles.containerPaddingVertical]}>
          <Button onPress={showBottomSheet} title="Show Bottom Sheet" />
        </View>
      </View>

      {bottomSheetVisible && (
        <>
          <AnimatedPressable
            onPress={hideBottomSheet}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.delay(200).duration(500)}
            style={[StyleSheet.absoluteFill, styles.bottomSheetBackdrop]}
          />

          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown.duration(500)}
            style={styles.bottomSheetContent}>
            <ScrollView
              style={sharedStyles.flex1}
              contentContainerStyle={sharedStyles.containerPaddingHorizontal}>
              <Text>Modal content</Text>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  bottomSheetContent: {
    position: 'absolute',
    height: 500,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    bottom: -50 * 1.1,
    zIndex: 2,
  },
});
