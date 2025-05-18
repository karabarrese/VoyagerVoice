// console.error = ((originalError: typeof console.error) => {
//   return (...args: any[]) => {
//     if (typeof args[0] === "string" && args[0].includes("findDOMNode is deprecated")) {
//       return;
//     }
//     originalError(...args);
//   };
// })(console.error);

import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import { useFonts } from '@expo-google-fonts/just-another-hand';
import React from 'react';
import Car from './Animations/car';
import Landmark from './Animations/landmark';
import { useNavigation, NavigationProp} from '@react-navigation/native';
import { RootStackParamList } from './_layout';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'JustAnotherHand_400Regular': require('../../assets/fonts/JustAnotherHand-Regular.ttf'),
    'JollyLodger': require('../../assets/fonts/JollyLodger-Regular.ttf'),
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voyager Voice</Text>
      <Text style={styles.subheading}>Stories that travel with you</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Location')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Car />
      <Landmark />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAF1F1',
  },
  heading: {
    textAlign: 'left',
    marginTop: 70,
    marginLeft: 20,
    fontSize: 60,
    color: '#2C7A65',
    fontFamily: 'JollyLodger',
  },
  subheading: {
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 53,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  button: {
    backgroundColor: '#F7C4B4',
    padding: 10,
    position: 'absolute',
    left: 25,
    right: 25,
    bottom: 50,
    height: 75,
    borderRadius: 15,
    shadowColor: '#FFDDD3',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
  },
  buttonText: {
    margin: 'auto',
    marginTop: 15,
    fontSize: 34,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  },
});
