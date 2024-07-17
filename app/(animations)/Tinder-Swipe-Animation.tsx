import { faker } from '@faker-js/faker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  DimensionValue,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sharedStyles } from '~/styles/sharedStyles';

const screenSize = Dimensions.get('window');

interface TinderCardProps {
  person: Person;
  style?: StyleProp<ViewStyle>;
}

const TinderCard = ({ person, style }: TinderCardProps) => {
  const { name, age, description, imageUri } = person;

  const isPressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const MIN_SUCCESS_DRAG = screenSize.width * 0.25;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: withSpring(isPressed.value ? 0.98 : 1) },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      offsetX.value = translationX;
      offsetY.value = translationY;

      const yClamp = interpolate(
        translationY,
        [-screenSize.height / 2, screenSize.height / 2],
        [-45, 45],
        'clamp'
      );

      const xClamp = interpolate(
        translationX,
        [-screenSize.width / 2, screenSize.width / 2],
        [-1, 1],
        'clamp'
      );

      rotation.value = yClamp * xClamp;
    })
    .onEnd((event) => {
      if (event.velocityX > 1000 || Math.abs(event.translationX) >= MIN_SUCCESS_DRAG) {
        offsetX.value = withDecay({
          velocity: Math.sign(event.velocityX) * Math.max(Math.abs(event.velocityX), 1200),
          deceleration: 0.998,
          clamp: [-screenSize.width * 2, screenSize.width * 2],
          velocityFactor: 0.9,
          rubberBandEffect: true,
          rubberBandFactor: 0.6,
          reduceMotion: ReduceMotion.System,
        });

        offsetY.value = withDecay({
          velocity: Math.sign(event.velocityY) * Math.max(Math.abs(event.velocityY), 1600),
          deceleration: 0.998,
          clamp: [-screenSize.height * 2, screenSize.height * 2],
          velocityFactor: 0.9,
          rubberBandEffect: true,
          rubberBandFactor: 0.6,
          reduceMotion: ReduceMotion.System,
        });

        rotation.value = withDecay({
          velocity: interpolate(
            Math.sign(event.velocityY) * Math.max(Math.abs(event.velocityX), 1200),
            [-2000, 2000],
            [-180, 180],
            'clamp'
          ),
          deceleration: 0.998,
          clamp: [-screenSize.width * 2, screenSize.width * 2],
          velocityFactor: 0.9,
          rubberBandEffect: true,
          rubberBandFactor: 0.6,
          reduceMotion: ReduceMotion.System,
        });
      } else {
        offsetX.value = withSpring(0, { damping: 14 });
        offsetY.value = withSpring(0, { damping: 14 });
        rotation.value = withSpring(0, { damping: 10 });
      }
    })
    .onFinalize((event) => {
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardItem, style, animatedStyle]}>
        <Image
          source={{
            uri: imageUri,
          }}
          style={styles.image}
        />

        <View style={[sharedStyles.containerPaddingHorizontal, styles.bioContainer]}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.bioBackground}
          />
          <Text style={styles.nameText}>
            {name}, {age}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

interface Person {
  uuid: string;
  name: string;
  age: number;
  description: string;
  imageUri: string;
}

const getPerson = (): Person => ({
  uuid: faker.string.uuid(),
  name: faker.person.firstName(),
  age: faker.number.int({ min: 19, max: 35 }),
  description: faker.lorem.sentences(faker.number.int({ min: 1, max: 5 })),
  imageUri: `https://picsum.photos/${Math.ceil(screenSize.width)}/${Math.ceil(screenSize.height)}?${Math.random()}`,
});

const userStack = Array(10)
  .fill(0)
  .map(() => getPerson());

const TinderSwipeAnimation = () => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tinder Swipe Animation',
        }}
      />
      <View
        style={[
          sharedStyles.flex1,
          sharedStyles.containerPaddingHorizontal,
          sharedStyles.containerPaddingVertical,
          styles.container,
          { paddingBottom: safeAreaBottom },
        ]}>
        {userStack.map((user, idx) => (
          <TinderCard
            key={user.uuid}
            person={user}
            style={{ zIndex: userStack.length - idx, top: `-${idx * 100}%` as DimensionValue }}
          />
        ))}
      </View>
    </>
  );
};

export default TinderSwipeAnimation;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  cardItem: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bioContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 96,
  },
  bioBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  nameText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'white',
  },
});
