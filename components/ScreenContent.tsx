import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { animationNames } from '~/data/animationNames';
import { parseAnimationName } from '~/helpers/parseAnimationName';
import { sharedStyles } from '~/styles/sharedStyles';

export const ScreenContent = () => {
  return (
    <ScrollView style={sharedStyles.flex1}>
      {animationNames.map((name) => (
        <Link href={`/(animations)/${name}`} asChild key={name}>
          <TouchableOpacity>
            <View
              style={[
                styles.animationItemWrapper,
                sharedStyles.containerPaddingVertical,
                sharedStyles.containerPaddingHorizontal,
              ]}>
              <Text style={styles.animationItemText} ellipsizeMode="tail" numberOfLines={1}>
                {parseAnimationName(name)}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  paddingVertical: {
    paddingVertical: 20,
  },
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
  animationItemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  animationItemText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
