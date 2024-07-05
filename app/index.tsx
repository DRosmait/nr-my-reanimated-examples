import { faker } from '@faker-js/faker';
import { Link, Stack } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { data } from '~/assets/fake';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

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

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScrollView style={styles.flex1}>
          <View style={styles.boxContainer}>
            <Animated.View style={animatedBoxStyles} />
          </View>

          <Button onPress={startAnimation} title="Start Animation" />

          <View style={{ padding: 16 }}>
            <AnimatedInput style={[styles.input, animatedInputStyles]} />
          </View>

          {data.map((item) => (
            <Link key={item.id} href={`/details/${item.id}`} asChild>
              <TouchableOpacity style={styles.listItem}>
                <Image source={{ uri: item.image }} style={styles.listItemImage} />
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                  <Text style={styles.listItemPrice}>${item.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
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
    paddingHorizontal: 20,
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
