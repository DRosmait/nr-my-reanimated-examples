import { SharedTransition, withSpring } from 'react-native-reanimated';

export const imageSharedTransition = SharedTransition.custom((values) => {
  // NOTICE: `worklet` is a keyword that tells Reanimated to run this function on the UI thread.
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
  };
});
