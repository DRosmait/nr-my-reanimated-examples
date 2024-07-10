import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { sharedStyles } from '~/styles/sharedStyles';

export default function Layout() {
  return (
    <GestureHandlerRootView style={sharedStyles.flex1}>
      <SafeAreaProvider>
        <Stack />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
