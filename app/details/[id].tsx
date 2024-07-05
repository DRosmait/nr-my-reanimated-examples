import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { data } from '~/assets/fake';
import { Container } from '~/components/Container';

// const createIncrementer = (initialValue: number, increment: number) => {
//   return function* incrementer(initialValue: number, increment: number) {
//     while (true) {
//       yield initialValue;
//       initialValue += increment;
//     }
//   };
// };

function* incrementer(initialValue: number, increment: number) {
  while (true) {
    initialValue += increment;
    yield initialValue;
  }
}

const delayIncrementer = incrementer(300, 150);

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = data.find((item) => !!id && item.id === parseInt(id, 10));

  if (!item) {
    return <Text>Item not found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <Container>
        <ScrollView style={styles.flex1}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.contentConainer}>
            <Animated.View
              style={styles.titlePriceContainer}
              entering={FadeInDown.delay(delayIncrementer.next().value ?? 0).duration(500)}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
            </Animated.View>

            <Animated.View
              style={styles.descriptionContainer}
              entering={FadeInDown.delay(delayIncrementer.next().value ?? 0).duration(500)}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  image: {
    height: 300,
    width: '100%',
  },
  contentConainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    flexGrow: 1,
  },
  priceText: {
    fontSize: 20,
    color: 'darkgreen',
    flexShrink: 0,
    fontStyle: 'italic',
  },
  descriptionContainer: {
    paddingTop: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: 'grey',
  },
});
