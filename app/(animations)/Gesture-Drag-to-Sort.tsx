import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sharedStyles } from '~/styles/sharedStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const CARD_GAP = 24;

interface CardItemProps {
  imageUri: string;
  index: number;
  onMove: (from: number, to: number) => void;
  onMoveEnd: (from: number, to: number) => void;
  // when activly moving CardItem is pushing the current CardItem, 'pushedDirection' tells where to move
  // 0: not pushing, 1: pushing down, -1: pushing up
  pushedDirection?: 0 | 1 | -1;
}

const CardItem = ({ imageUri, index, onMove, onMoveEnd, pushedDirection = 0 }: CardItemProps) => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  // use 'isAnimationFinished' for zIndex to prevent overlapping
  const isAnimationFinished = useSharedValue(true);

  const [cardHeight, setCardHeight] = useState(0);
  const cardFullOffset = cardHeight + CARD_GAP;

  // after user moved cards, the index will change. So, reset the offset to {x: 0, y: 0}
  useLayoutEffect(() => {
    offset.value = { x: 0, y: 0 };
  }, [index]);

  // when activly moving CardItem is pushing the current CardItem, we need to move move it to the pushed direction
  useLayoutEffect(() => {
    offset.value = withSpring({ x: 0, y: pushedDirection * cardFullOffset });
  }, [pushedDirection]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value.x },
      { translateY: offset.value.y },
      { scale: withSpring(isPressed.value ? 1.05 : 1) },
    ],
    // prevent overlapping
    zIndex: isAnimationFinished.value ? 0 : 100,
  }));

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      isAnimationFinished.value = false;
    })
    .onUpdate(({ translationX, translationY }) => {
      offset.value = { x: translationX, y: translationY };

      // when we move the card to top, the 'translationY' will be negative, so we need to use 'Math.ceil' to round the number (e.g. -1.1 -> -1)
      // when we move the card to bottom, the 'translationY' will be positive, so we need to use 'Math.floor' to round the number (e.g. 1.1 -> 1)
      const roundFunc = Math.sign(translationY) > 0 ? Math.floor : Math.ceil;
      const movedToIndex = index + roundFunc(translationY / cardFullOffset);

      // let the parent component know the card is moving from 'index' to 'movedToIndex'
      runOnJS(onMove)(index, movedToIndex);
    })
    .onFinalize(({ translationY }) => {
      const roundFunc = Math.sign(translationY) > 0 ? Math.floor : Math.ceil;
      const movedToIndex = index + roundFunc(translationY / cardFullOffset);

      isPressed.value = false;

      // if CardItem's index did not chaged, reset the offset to {x: 0, y: 0}
      if (index === movedToIndex) {
        offset.value = withSpring({ x: 0, y: 0 }, {}, (finished) => {
          if (finished) {
            // reset zIndex
            isAnimationFinished.value = true;
          }
        });
      } else {
        // 1. if CardItem's index changed, animate the CardItem to the new position
        offset.value = withSpring(
          { x: 0, y: cardFullOffset * (movedToIndex - index) }, // new position
          {},
          (finished) => {
            if (finished) {
              isAnimationFinished.value = true;
              // 2. let the parent component know the card must chang its index
              runOnJS(onMoveEnd)(index, movedToIndex);
            }
          }
        );
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedImage
        source={{ uri: imageUri }}
        style={[styles.image, animatedStyle]}
        onLayout={(event) => setCardHeight(event.nativeEvent.layout.height)}
      />
    </GestureDetector>
  );
};

const GestureDragToSort = () => {
  const [assets = []] = useAssets([
    require('~/assets/images/chameleon.jpg'),
    require('~/assets/images/pain-boom.jpg'),
    require('~/assets/images/pink-buble.jpg'),
  ]);

  const [assetsState, setAssetsState] = useState(assets);
  useEffect(() => {
    setAssetsState(assets);
  }, [assets]);

  const [movedPositions, setMovedPositions] = useState<{ from: number; to: number }>({
    from: 0,
    to: 0,
  });

  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  // Event handlers
  // track currently moving CradItem's positions (preliminary index change {from, to})
  const onMoveHandler = (from: number, to: number) => {
    setMovedPositions({ from, to });
  };

  // when CardItem's moving is finished, update the position in the item list
  const onMoveEndHandler = (from: number, to: number) => {
    const newAssets = [...assetsState];
    const [movedItem] = newAssets.splice(from, 1);
    newAssets.splice(to, 0, movedItem);

    setAssetsState([...newAssets]);
    // reset moved position
    setMovedPositions({ from: 0, to: 0 });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Gesture Drag to Sort',
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
        {assetsState.map(({ uri }, idx) => {
          const { from, to } = movedPositions;
          const directionToMove = to > from ? -1 : 1;
          const isBetweenMoved = idx >= Math.min(from, to) && idx <= Math.max(from, to);

          return (
            <CardItem
              key={uri}
              imageUri={uri}
              index={idx}
              onMove={onMoveHandler}
              onMoveEnd={onMoveEndHandler}
              pushedDirection={isBetweenMoved && idx !== from ? directionToMove : 0}
            />
          );
        })}
      </View>
    </>
  );
};

export default GestureDragToSort;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    gap: CARD_GAP,
  },
  image: {
    borderRadius: 16,
    flexGrow: 1,
    width: '100%',
  },
});
