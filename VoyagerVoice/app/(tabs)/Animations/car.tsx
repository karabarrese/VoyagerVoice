import React, { useRef, useEffect } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

export default function Car() {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: -10, // up
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0, // down
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [moveAnim]);

  return (
    <Animated.Image
      source={require('../../../assets/images/car.png')}
      style={[
        styles.car,
        {
          transform: [{ translateY: moveAnim }],
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  car: {
    width: 500,
    height: 250,
    alignSelf: 'center',
    marginTop: 150,
  },
});
