import React from 'react';
import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity, Platform, TextInput, Dimensions } from 'react-native';
import { useFonts, JustAnotherHand_400Regular } from '@expo-google-fonts/just-another-hand';
// import { AppleMaps, GoogleMaps } from 'expo-maps';

export default function HomeScreen() {
  if (Platform.OS === 'ios') {
    // return <AppleMaps.View style={{ flex: 1 }} />;
  }
  // }
  const [fontsLoaded] = useFonts({
    JustAnotherHand_400Regular,
    'JollyLodger': require('../../assets/fonts/JollyLodger-Regular.ttf'),
  });

  const [enteredLocation, onChangeEnteredLocation] = React.useState('');

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
        <TouchableOpacity style={styles.enterLocationBtn} onPress={() => alert('Button pressed')}>
          <Image
            style={styles.arrowImg}
            source={require('../../assets/images/arrow.png')}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction}>or</Text>

      <TouchableOpacity style={styles.curLocationBtn} onPress={() => alert('Button pressed')}>
        <Text style={styles.buttonText}>Get your current location</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed')}>
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
    marginTop: 20,
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
    marginTop: 20,
    textAlign: 'center',
    fontSize: 53,
    color: '#2C7A65',
    fontFamily: 'JustAnotherHand_400Regular',
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
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    height: 75,
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
    fontSize: 36,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  },
});
