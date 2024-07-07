import { useAssets } from 'expo-asset';
import { Stack } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { sharedStyles } from '~/styles/sharedStyles';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;

interface Layout {
  id: string;
  name: string;
  containerStyle: ViewStyle;
  itemStyle: ImageStyle;
}

const RowLayout: Layout = {
  id: 'row',
  name: 'Row',
  containerStyle: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: GRID_GAP,
  },
  itemStyle: {
    flex: 1,
    aspectRatio: 1,
  },
};

const ColumnLayout: Layout = {
  id: 'column',
  name: 'Column',
  containerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: GRID_GAP,
  },
  itemStyle: {
    flex: 1,
    aspectRatio: 1,
  },
};

const WrapLayout: Layout = {
  id: 'wrap',
  name: 'Wrap',
  containerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  itemStyle: {
    width: (width - GRID_GAP - sharedStyles.containerPaddingHorizontal.paddingHorizontal * 2) / 2,
    height: (width - GRID_GAP - sharedStyles.containerPaddingHorizontal.paddingHorizontal * 2) / 2,
  },
};

const layouts = [RowLayout, ColumnLayout, WrapLayout];

const AnimatedImage = Animated.createAnimatedComponent(Image);

const FlexBoxLayoutAnimation = () => {
  const [currentLayout, setCurrentLayout] = React.useState<Layout>(layouts[0]);

  const [assets] = useAssets([
    require('~/assets/images/chameleon.jpg'),
    require('~/assets/images/pain-boom.jpg'),
    require('~/assets/images/pink-buble.jpg'),
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'FlexBox Layout Animation',
        }}
      />
      <View style={sharedStyles.flex1}>
        <View
          style={[
            sharedStyles.flex1,
            sharedStyles.containerPaddingHorizontal,
            sharedStyles.containerPaddingVertical,
            currentLayout.containerStyle,
          ]}>
          {assets &&
            assets.map((image, idx) => (
              <AnimatedImage
                source={{ uri: image.uri }}
                style={[
                  currentLayout.itemStyle,
                  {
                    borderRadius: 12,
                  },
                ]}
                key={idx}
                layout={LinearTransition.springify().damping(14).stiffness(100)}
              />
            ))}
        </View>

        <View
          style={[
            sharedStyles.containerPaddingVertical,
            sharedStyles.containerPaddingHorizontal,
            { paddingBottom: 22 },
          ]}>
          {layouts.map((layoutItem) => (
            <TouchableOpacity
              key={layoutItem.id}
              onPress={() => setCurrentLayout(layoutItem)}
              style={[
                {
                  backgroundColor: layoutItem.id === currentLayout.id ? 'blue' : 'gray',
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                },
              ]}>
              <Text style={{ color: 'white' }}>{layoutItem.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

export default FlexBoxLayoutAnimation;
