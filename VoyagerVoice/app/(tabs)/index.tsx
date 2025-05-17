import React, { useState } from 'react';
// import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { useFonts, JustAnotherHand_400Regular } from '@expo-google-fonts/just-another-hand';
import Slider from '@react-native-community/slider';
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";

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

  // Slider variables

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Script variables - TODO: get from model
  const textArray = [
    "Lorem ipsum dolor sit amet, ",
    "consectetur adipiscing elit, ",
    "sed do eiusmod tempor, ",
    "incididunt ut labore et dolore magna aliqua. ",
    "Ut enim ad minim veniam, ",
    "quis nostrud exercitation ullamco, ",
    "laboris nisi ut aliquip ex ea commodo, ",
    "duis aute irure dolor in reprehenderit, ",
    "voluptate velit esse cillum dolore, ",
    "eu fugiat nulla pariatur.",
    "duis aute irure dolor in reprehenderit, ",
    "voluptate velit esse cillum dolore, ",
    "eu fugiat nulla pariatur.",
  ];

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const changeSliderValue = (value: number) => {
    setHighlightedIndex(Math.floor((value / 100) * textArray.length))
  };

  return (
    <View style={styles.container}>
      {/* <AppleMaps.View style={{ flex: 1 }} /> */}
      <Text style={styles.heading}>Voyager Voice</Text>
      <View style={{ marginTop: 60, height: 100, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={styles.locationImg}
          source={require('../../assets/images/defaultLoc.png')}
        />
        <Text style={styles.locationName}>Location Name</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          onValueChange={(value) => changeSliderValue(value)}
          minimumTrackTintColor="#2C7A65"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#2C7A65"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePlayPause}>  
            <Image 
            source={isPlaying ? require('../../assets/images/Pause.png') : require('../../assets/images/Play.png')} 
            style={styles.icon} 
          />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scriptContainer}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          {textArray.map((text, index) => (
            <Text
              key={index}
              style={index === highlightedIndex ? styles.highlightedText : styles.text}
            >
              {text}
            </Text>
          ))}
        </Text>
      </ScrollView>

      <ExpoLinearGradient
        colors={["rgba(218, 241, 241, 0)", "rgba(218, 241, 241, 1)"]}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
      
      <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed')}>
        <Text style={styles.buttonText}>Select New Location</Text>
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
  locationImg: {
    height: 100,
    aspectRatio: 1.3,
  },
  locationName: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 54,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  icon: {
    marginTop: 0,
    width: 40,
    height: 40,
  },
  instruction2: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 53,
    color: '#2C7A65',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 20,
  },
  valueText: {
    marginTop: 10,
    fontSize: 18,
    color: '#2C7A65',
  },
  buttonContainer: {
    margin: 'auto',
    marginRight: 10,
    // width: '50%',
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
  },
  scriptContainer: {
    marginTop: 20,
    height: 250, 
    position: "relative",
    overflow: "hidden"
  },
  scrollView: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 32,
    lineHeight: 34,
    marginVertical: 2,
    color: '#AAAAAA',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  highlightedText:{
    fontSize: 32,
    lineHeight: 34,
    marginVertical: 2,
    color: '#626060',
    fontFamily: 'JustAnotherHand_400Regular',
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, 
  },
});
