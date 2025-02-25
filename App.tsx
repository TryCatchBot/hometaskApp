import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Calendar } from '@/components/Calendar/Calendar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Calendar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 