import { faker } from '@faker-js/faker';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// import { imageSharedTransition } from '~/animations/ImageSharedTransition';
import { data } from '~/assets/fake';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function Home() {
  // NOTICE: useSharedValue is a hook that returns a SharedValue object with a single .value property initially set to the initialValue.
  // we use SharedValue objects to create animations in Reanimated.
  const width = useSharedValue(100);
  const height = useSharedValue(100);
  const color = useSharedValue('red');

  const animatedBoxStyles = useAnimatedStyle(() => ({
    // NOTICE: withSpring and withTiming are functions that start animations.
    width: withSpring(width.value),
    height: withSpring(height.value),
    backgroundColor: withTiming(color.value, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
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

  // NOTICE: useAnimatedRef is a hook that returns a ref object that can be used to reference an Animated component.
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  // NOTICE: useScrollViewOffset is a hook that returns the current scroll position of an AnimatedScrollView.
  const scrollY = useScrollViewOffset(scrollViewRef);
  const scrollButtonStyle = useAnimatedStyle(() => ({
    zIndex: scrollY.value > 100 ? 1 : -1,
    opacity: withTiming(scrollY.value > 100 ? 1 : 0, { duration: 400 }),
  }));

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <Animated.ScrollView
          ref={scrollViewRef}
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
          </>

          {/**
           *
           * Staggered List Animation
           *
           * */}
          <>
            <View style={sharedStyles.containerPaddingVertical}>
              <Link href="/list" asChild>
                <Button title="Go to Staggered List" />
              </Link>
            </View>
          </>

          {/**
           *
           * Shared Element Transition
           *
           * */}
          <>
            {data.map((item) => (
              <Link key={item.id} href={`/details/${item.id}`} asChild>
                <TouchableOpacity style={styles.listItem}>
                  <Animated.Image
                    // NOTICE: !!! EXPERIMENTAL !!! Shared Element Transition animates transition from one
                    // component on screen A to another component on screen B.
                    // sharedTransitionTag={`item-image-${item.id}`}
                    // sharedTransitionStyle={imageSharedTransition}
                    source={{ uri: item.image }}
                    style={styles.listItemImage}
                  />

                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </>
        </Animated.ScrollView>

        {/**
         *
         * Animate on Scroll
         *
         * */}
        <Animated.View style={[scrollButtonStyle, { position: 'absolute', bottom: 48, right: 20 }]}>
          <Button onPress={() => {}} title="AnimOnScroll" />
        </Animated.View>
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
  listItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 20,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemPrice: {
    fontSize: 18,
    color: 'grey',
  },
});
