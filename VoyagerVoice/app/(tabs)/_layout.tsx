// (tabs)/_layout.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '.';
import LocationScreen from './location';
import PodcastScreen from './podcast';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Location: undefined;
  Podcast: undefined;
};

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Podcast" component={PodcastScreen} />
    </Stack.Navigator>
  );
}
