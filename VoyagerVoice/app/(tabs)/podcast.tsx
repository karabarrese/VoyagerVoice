import React, { useState, useEffect, useRef } from 'react';
// import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity, Platform, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, JustAnotherHand_400Regular } from '@expo-google-fonts/just-another-hand';
import Slider from '@react-native-community/slider';
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import { RootStackParamList } from './_layout';
import SoundPlayer from 'react-native-sound-player';
const fs = require('fs');
import os from "os";
import path from "path";

type PodcastRouteProp = RouteProp<RootStackParamList, 'Podcast'>;
 
export default function PodcastScreen() {
  if (Platform.OS === 'ios') {
    // return <AppleMaps.View style={{ flex: 1 }} />;
  }  
  // }
  const [fontsLoaded] = useFonts({
      'JustAnotherHand_400Regular': require('../../assets/fonts/JustAnotherHand-Regular.ttf'),
      'JollyLodger': require('../../assets/fonts/JollyLodger-Regular.ttf'),
    });
  
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();  

  // AUDIO
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  // Read audio
  const route = useRoute<PodcastRouteProp>();
  const { selectedLocation, isLatLong } = route.params;

  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingPodcast, setLoadingPodcast] = useState(false);

  if (!audioRef.current) {
    audioRef.current = new Audio(require('../../assets/output.mp3'));
  }

  // useEffect(() => {
  //   if (audioSrc && audioRef.current) {
  //     audioRef.current.src = audioSrc;
  //   }
  // }, [audioSrc]);

  // Fetch the location name first
  const fetchLocationName = async () => { 
    console.log("Getting location name");
    setLoadingLocation(true);
    try {
      if (isLatLong) {
        const [latitude, longitude] = selectedLocation.split(", ").map(coord => parseFloat(coord));
        let apiUrl = `http://172.31.156.103:3000/api/nearby_search_name?latitude=37.34989405149171&longitude=-121.94068139315706`;

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log("Location name fetched:", data);
          setQuery(data); 
          console.log(query);
        } else {
          console.error('Failed to fetch location name');
        }
      } else {
        setQuery(selectedLocation);
        console.log(query);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Fetch the podcast based on the query
  const fetchPodcast = async () => {
    if (query == "") {
      console.error("No query available");
      return;
    }

    setLoadingPodcast(true);
    setResponseText("");
    setAudioSrc("");

    console.log("in fetch podcast");

    try {
      const res = await fetch("http://172.31.156.103:5001/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }

      console.log("waiting res.json");

      const { text, audio_base64 } = await res.json();
      console.log(audio_base64);
      setResponseText(text);
      // setAudioSrc(`data:audio/mp3;base64,${audio_base64}`);

      // try {
      //   const audioBuffer = Buffer.from(audio_base64, 'base64');
      //   fs.writeFileSync('./new_output.mp3', audioBuffer);
      //   console.log("Audio saved hopefully");
      // } catch (err) {
      //   console.log("Error decoding audio");
      // }

      const binaryString = atob(audio_base64); 
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      // adjust MIME type if your TTS is mp3
      const blob = new Blob([bytes], { type: 'audio/mp3' });

      // 4. Trigger download
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `tts-output.mp3`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      // audioRef.current = new Audio(require('../../../../../tiffanynguyen/Downloads/tts-output.mp3'));

    } catch (err) {
      console.error('Error fetching podcast:', err);
    } finally {
      setLoadingPodcast(false); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocationName();
      console.log("query");
      console.log(query);
      await fetchPodcast();
    };

    fetchData();
  }, []);
  
   // Update slider as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateSlider = () => {
      if (audio.duration > 0) {
        const currentPercent = (audio.currentTime / audio.duration) * 100;
        setSliderValue(currentPercent);
      }
    };

    audio.addEventListener('timeupdate', updateSlider);

    return () => {
      audio.removeEventListener('timeupdate', updateSlider);
    };
  }, []);

  // pause play functionality
  const togglePlayPause = () => {
    console.log(audioRef.current);
    // if(!audioRef.current){
    //   const downloadDir = path.join(path.join(os.homedir(), "Downloads"), "tts-output.mp3");
    //   audioRef.current = new Audio(require(downloadDir));
    // }
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error('Cannot play the sound file:', e);
      });
    }
  };

  // user changing slider value
  const changeSliderValue = (value: number) => {
    setSliderValue(value);

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  // SCRIPT variables - TODO: get from model
  const transcript = "Welcome to today’s sightseeing spotlight, where we’re diving into one of Washington, D.C.’s most iconic landmarks: the Washington Monument. This towering obelisk stands proudly on the National Mall, a tribute to George Washington—America’s first president and Revolutionary War hero. At over 554 feet tall, it’s not just the world’s tallest stone obelisk but also a marvel of engineering and perseverance. Fun fact: if you look closely, you’ll notice a subtle color shift in the marble about a third of the way up. That’s because construction hit a snag in the 1850s due to funding issues and the Civil War, leaving the monument half-finished for over 20 years. When work resumed, builders used marble from a different quarry, creating that distinctive “ring” in the stone. The monument’s design is elegantly simple—a hollow Egyptian-style obelisk with a pyramid-shaped top. Inside, an elevator whisks visitors up to observation windows for breathtaking views of the city. And here’s a quirky detail: the very tip of the monument is capped with a tiny aluminum pyramid, a rare metal at the time that symbolized modernity. Over the years, the monument has weathered earthquakes, temporary closures, and even a post-9/11 security upgrade. But today, it’s standing strong, surrounded by 50 flags representing every U.S. state. Whether you’re gazing up at its gleaming marble facade or taking in the view from the top, the Washington Monument is a must-see symbol of American history and ingenuity.  Thanks for tuning in—and if you’re planning a visit, don’t forget to snap a photo with this legendary landmark reflecting in the nearby pool!"

  // UPDATE IMAGE
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    console.log("Selected location");
    try {
      let apiUrl = "";
      if(isLatLong){
        const [latitude, longitude] = selectedLocation.split(", ").map(coord => parseFloat(coord));
        apiUrl = `http://172.31.156.103:3000/api/nearby_search_photo?latitude=${latitude}&longitude=${longitude}`;
        // apiUrl = `http://172.31.156.103:3000/api/nearby_search_photo?latitude=${37.34989405149171}&longitude=${-121.94068139315706}`;
      } else {
        apiUrl = `http://172.31.156.103:3000/api/find_search_photo?searchQuery=${selectedLocation.replace(/ /g, "%20")}}`
      }
      console.log(apiUrl);

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setImageUrl(data); 
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppleMaps.View style={{ flex: 1 }} /> */}
      <Text style={styles.heading}>Voyager Voice</Text>
      <View style={{ marginTop: 65, height: 100, justifyContent: 'center', alignItems: 'center' }}>
        {imageUrl ? (
          <Image style={styles.locationImg} source={{ uri: imageUrl }} />
        ) : (
          <Text>Loading Image...</Text>
        )}

        <Text style={styles.locationName}>{selectedLocation}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={sliderValue}
          onValueChange={(value) => changeSliderValue(value)}
          minimumTrackTintColor="#2C7A65"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#2C7A65"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={togglePlayPause}>  
            <Image 
            source={isPlaying ? require('../../assets/images/Pause.png') : require('../../assets/images/Play.png')} 
            style={styles.icon} 
          />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scriptContainer}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Loading indicators */}
        {loadingLocation && <ActivityIndicator size="large" color="#0000ff" />}
        {!loadingLocation && !loadingPodcast && (
          <>
            <Text style={styles.text}>{responseText || "Loading Transcript..."}</Text>
          </>
        )}
        {loadingPodcast && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>

      <ExpoLinearGradient
        colors={["rgba(218, 241, 241, 0)", "rgba(218, 241, 241, 1)"]}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Location')}>
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
    marginTop: 70,
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
    marginTop: 50,
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
    height: 350, 
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
