import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from 'react-native-reanimated';

// import { imageSharedTransition } from '~/animations/ImageSharedTransition';
import { data } from '~/assets/fake';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

export default function AnimateOnScroll() {
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
      <Stack.Screen options={{ title: 'Animate on Scroll' }} />
      <Container>
        <Animated.ScrollView ref={scrollViewRef}>
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
