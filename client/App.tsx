// In App.tsx
import React from 'react';
import { View } from 'react-native';
import Dashboard from './app/index'; // Adjust the import name if needed

interface Props {}

export default function App(props: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Dashboard />
    </View>
  );
}