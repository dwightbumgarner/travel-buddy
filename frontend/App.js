import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import HomeComponent from './components/HomeComponent';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <HomeComponent />
        </NavigationContainer>
    </ApplicationProvider>
  );
}
