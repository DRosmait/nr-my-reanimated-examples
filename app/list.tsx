import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  LinearTransition,
  SlideOutLeft,
} from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { sharedStyles } from '~/styles/sharedStyles';

const StaggeredList = () => {
  const [emailList, setEmailList] = React.useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const getItemAnimation = (index: number) => {
    if (isInitialLoad && index < 20) return FadeInUp.delay((index + 1) * 200).duration(400);
    if (!isInitialLoad) return FadeInDown.duration(500);
    return undefined;
  };

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await fetch('https://randomuser.me/api?results=5');
      const users = (await response.json()) as { results: { email: string }[] };
      const emails = users.results.map((user) => user.email);
      setEmailList(emails);
    };

    fetchEmails();
  }, []);

  const addEmail = async () => {
    const response = await fetch('https://randomuser.me/api');
    const newEmail = (await response.json()) as { results: { email: string }[] };
    setEmailList((currentEmailList) => [...currentEmailList, newEmail.results[0].email]);
  };

  const removeEmail = (email: string) => {
    setEmailList((currentEmailList) =>
      currentEmailList.filter((currentEmail) => currentEmail !== email)
    );
  };

  return (
    <View style={sharedStyles.flex1}>
      <View
        style={[sharedStyles.containerPaddingHorizontal, sharedStyles.containerPaddingVertical]}>
        <Button onPress={addEmail} title="Add Email" />
      </View>

      <ScrollView
        style={sharedStyles.flex1}
        contentContainerStyle={{ paddingBottom: 32 }}
        ref={scrollViewRef}
        // Scroll to the end of the list when the content size changes
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {emailList.map((email, index) => (
          <Animated.View
            key={email}
            onTouchEnd={() => removeEmail(email)}
            style={styles.emailItem}
            entering={getItemAnimation(index)}
            exiting={SlideOutLeft.duration(500)}
            // NOTICE: use `layout`  prop to delay the animation until the component is removed from the layout
            layout={LinearTransition.delay(200)}
            // after animating the last item, set isInitialLoad to false
            onLayout={index + 1 === emailList.length ? () => setIsInitialLoad(false) : undefined}>
            <Text style={{ fontSize: 18, color: 'white' }}>{email}</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StaggeredList;

const styles = StyleSheet.create({
  emailItem: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#3155c1',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    alignItems: 'center',
  },
});
