import { faker } from '@faker-js/faker';
import { Stack } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
  SlideOutLeft,
} from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StaggeredList = () => {
  const [emailList, setEmailList] = React.useState<string[]>(
    Array(5)
      .fill('')
      .map(() => faker.internet.email())
  );
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const getItemAnimation = (index: number) => {
    if (isInitialLoad && index < 20) return FadeInUp.delay((index + 1) * 200).duration(400);
    if (!isInitialLoad) return FadeInDown.duration(500);
    return undefined;
  };

  const addEmail = () => {
    setEmailList((currentEmailList) => [...currentEmailList, faker.internet.email()]);
  };

  const removeEmail = (email: string) => {
    setEmailList((currentEmailList) =>
      currentEmailList.filter((currentEmail) => currentEmail !== email)
    );
  };

  // Bottom Sheet
  const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
  const showBottomSheet = () => setBottomSheetVisible(true);
  const hideBottomSheet = () => setBottomSheetVisible(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Staggered List',
          headerRight: ({ tintColor }) => (
            <TouchableOpacity onPress={showBottomSheet}>
              <Text style={{ color: tintColor, fontSize: 16 }}>Modal</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={sharedStyles.flex1}>
        <View
          style={[sharedStyles.containerPaddingHorizontal, sharedStyles.containerPaddingVertical]}>
          <Button onPress={addEmail} title="Add Email" />
        </View>

        <ScrollView
          style={sharedStyles.flex1}
          contentContainerStyle={{ paddingBottom: 32 }}
          ref={scrollViewRef}
          // Scroll to the end of the list when the content size changes
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          {emailList.map((email, index) => (
            <Animated.View
              key={email}
              onTouchEnd={() => removeEmail(email)}
              style={styles.emailItem}
              entering={getItemAnimation(index)}
              exiting={SlideOutLeft.duration(500)}
              // NOTICE: use `layout`  prop to delay the animation until the component is removed from the layout
              layout={LinearTransition.delay(200)}
              // after animating the last item, set isInitialLoad to false
              onLayout={index + 1 === emailList.length ? () => setIsInitialLoad(false) : undefined}>
              <Text style={{ fontSize: 18, color: 'white' }}>{email}</Text>
            </Animated.View>
          ))}
        </ScrollView>
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

export default StaggeredList;

const styles = StyleSheet.create({
  emailItem: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#3155c1',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    alignItems: 'center',
  },
  bottomSheetBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  bottomSheetContent: {
    position: 'absolute',
    height: 400,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    bottom: -50 * 1.1,
    zIndex: 2,
  },
});
