import { Image } from 'expo-image';
import { Button, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import { useFonts, JustAnotherHand_400Regular } from '@expo-google-fonts/just-another-hand';


export default function HomeScreen2() {
  const [fontsLoaded] = useFonts({
    JustAnotherHand_400Regular,
    'JollyLodger': require('../../assets/fonts/JollyLodger-Regular.ttf'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voyager Voice</Text>
      <Text style={styles.subheading}>Stories that travel with you</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed')}>
        <Text style={styles.buttonText}>Get Started</Text>
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
    fontSize: 35,
    color: '#69868A',
    fontFamily: 'JustAnotherHand_400Regular',
  },
});
