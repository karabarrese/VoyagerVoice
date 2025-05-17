import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity, Platform, TextInput, Dimensions } from 'react-native';
import { useFonts, JustAnotherHand_400Regular } from '@expo-google-fonts/just-another-hand';
import * as Location from 'expo-location';
import { useNavigation, NavigationProp} from '@react-navigation/native';
import { RootStackParamList } from './_layout';
// import { AppleMaps, GoogleMaps } from 'expo-maps';

export default function LocationScreen() {
  // if (Platform.OS === 'ios') {
    // return <AppleMaps.View style={{ flex: 1 }} />;
  // }
  const [fontsLoaded] = useFonts({
    'JustAnotherHand_400Regular': require('../../assets/fonts/JustAnotherHand-Regular.ttf'),
    'JollyLodger': require('../../assets/fonts/JollyLodger-Regular.ttf'),
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [enteredLocation, onChangeEnteredLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('test');

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setSelectedLocation(`${latitude}, ${longitude}`);
    } catch (error) {
      alert('Failed to get location');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppleMaps.View style={{ flex: 1 }} /> */}
      <Text style={styles.heading}>Voyager Voice</Text>
      <Text style={styles.instruction}>Enter a location:</Text>
      <View style={styles.locationInputContainer}>
        <TextInput
          style={styles.locationInput}
          onChangeText={onChangeEnteredLocation}
          value={enteredLocation}
          placeholder="123 Main Street"
          keyboardType="default"
        />
        <TouchableOpacity style={styles.enterLocationBtn} onPress={() => {if(enteredLocation != ''){setSelectedLocation(enteredLocation)}}}>
          <Image
            style={styles.arrowImg}
            source={require('../../assets/images/arrow.png')}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction2}>or</Text>

      <TouchableOpacity style={styles.curLocationBtn} onPress={() => getUserLocation()}>
        <Text style={styles.buttonText}>Get your current location</Text>
      </TouchableOpacity>

      <Text style={styles.selectedLocationText}>Selected Location: {'\n'} {selectedLocation}</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Podcast')}>
        <Text style={styles.buttonText}>Hear Stories</Text>
      </TouchableOpacity>
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
  instruction: {
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 53,
    color: '#2C7A65',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  instruction2: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 53,
    color: '#2C7A65',
    fontFamily: 'JustAnotherHand_400Regular',
    alignSelf: 'center',
    width: '100%',
  },
  selectedLocationText:{
    marginTop: 40,
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 30,
    color: 'white',
    fontFamily: 'JustAnotherHand_400Regular',
    backgroundColor: '#2C7A65',
  },
  locationInputContainer:{
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",  
    width: "100%", 
    padding: 0,
    paddingRight: 20,
    paddingLeft: 20,
    // backgroundColor: "#f0f0f0",
  },
  locationInput: {
    margin: 0,
    padding: 15,
    paddingBottom: 5,
    backgroundColor: '#FFDDD3',
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
    fontSize: 35,
    width: Dimensions.get("window").width - 115,
    borderRadius: 10,
    // marginRight: 75,
  },
  enterLocationBtn: {
    backgroundColor: '#FFDDD3',
    padding: 10,
    width: 55,
    height: 55,
    borderRadius: 15,
  },
  arrowImg: {
    width: 30,
    height: 21,
    margin: 'auto',
  },
  curLocationBtn: {
    backgroundColor: '#FFDDD3',
    padding: 0,
    marginLeft: 20,
    marginRight: 20,
    height: 65,
    borderRadius: 15,
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
    shadowRadius: 3.85,
  },
  buttonText: {
    margin: 'auto',
    marginTop: 15,
    fontSize: 37,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  }
});
