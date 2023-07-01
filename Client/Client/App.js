import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Admin } from './Views/Admin';
import { Customer } from './Views/Customer';
export default function App() {
  return (
    <>
      <Customer />
      <Admin />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
