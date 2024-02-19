import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import AuthComponent from './components/AuthComponent';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <View style={styles.container}>
          <AuthComponent />
        </View>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
