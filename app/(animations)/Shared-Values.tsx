import { faker } from '@faker-js/faker';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function SharedValues() {
  // NOTICE: useSharedValue is a hook that returns a SharedValue object with a single .value property initially set to the initialValue.
  // we use SharedValue objects to create animations in Reanimated.
  const width = useSharedValue(100);
  const height = useSharedValue(100);
  const color = useSharedValue('red');
  const opacity = useSharedValue(1);

  const animatedBoxStyles = useAnimatedStyle(() => ({
    // NOTICE: withSpring and withTiming are functions that start animations.
    width: withSpring(width.value),
    height: withSpring(height.value),
    backgroundColor: withTiming(color.value, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
    opacity: withTiming(opacity.value, {
      duration: 500,
    }),
  }));

  // NOTICE: you can reuse the same SharedValue object to animate multiple properties or components.
  const animatedInputStyles = useAnimatedStyle(() => ({
    borderColor: withTiming(color.value),
  }));

  const startAnimation = () => {
    width.value = faker.number.int({ min: 30, max: 300 });
    height.value = faker.number.int({ min: 30, max: 300 });
    color.value = faker.color.rgb();
  };

  const toggleOpacity = () => {
    opacity.value = opacity.value === 0 ? 1 : 0;
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Shared Values' }} />
      <Container>
        <ScrollView
          style={sharedStyles.flex1}
          contentContainerStyle={sharedStyles.containerPaddingHorizontal}>
          {/**
           *
           * Shared Value Animation
           *
           * */}
          <>
            <View style={styles.boxContainer}>
              <Animated.View style={animatedBoxStyles} />
            </View>

            <View style={sharedStyles.containerPaddingVertical}>
              <AnimatedInput style={[styles.input, animatedInputStyles]} />
            </View>

            <View style={sharedStyles.containerPaddingVertical}>
              <Button onPress={startAnimation} title="Start Animation" />
            </View>
            <View style={sharedStyles.containerPaddingVertical}>
              <Button onPress={toggleOpacity} title="Toggle opacity" />
            </View>
          </>
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    width: '100%',
    height: 300,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 20,
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 18,
  },
});
