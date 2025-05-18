import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';

export default function LandmarkScreen() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://9rdccx9m-7861.usw3.devtunnels.ms/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [input] }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const raw = await res.text();
        console.log('⚠️ Non-JSON response:', raw);
        setResponse('Unexpected server response:\n\n' + raw);
        return;
      }

      const data = await res.json();
      console.log('JSON parsed:', data);

      if (Array.isArray(data.data) && data.data[0]) {
        setResponse(data.data[0]);
      } else {
        setResponse('❗ Unexpected response format:\n' + JSON.stringify(data));
      }
    } catch (err: any) {
      console.error(' Network or parse error:', err.message);
      setResponse(' Failed to fetch or parse response:\n' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Enter a landmark:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Eiffel Tower"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Get Info" onPress={handleGenerate} disabled={loading} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        response !== '' && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Result:</Text>
            <Text style={styles.result}>{response}</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 8,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  resultLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  result: {
    fontSize: 16,
  },
});
