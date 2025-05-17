import React, { useRef, useEffect, useState } from 'react';
import { Animated, ImageSourcePropType, View, StyleSheet } from 'react-native';

const landmarks: ImageSourcePropType[] = [
    require('../../../assets/images/pyramid.png'),
    require('../../../assets/images/bridge.png'),
    require('../../../assets/images/tower.png'),
  ];

export default function Landmark() {
    const [index, setIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
  
    useEffect(() => {
      const interval = setInterval(() => {
        // fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // switch img & fade in
          setIndex((prev) => (prev + 1) % landmarks.length);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      }, 3000); //3s
  
      return () => clearInterval(interval);
    }, [fadeAnim]);
  
    return (
        <View style={styles.container}>
        <Animated.Image
            source={landmarks[index]}
            style={[styles.image, { opacity: fadeAnim }]}
            resizeMode="contain"
        />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
      marginTop: -500,
      alignItems: 'center',
    },
    image: {
      width: 500,
      height: 300,
    },
  });

