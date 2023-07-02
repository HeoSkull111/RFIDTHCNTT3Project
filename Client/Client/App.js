import { Admin } from './Views/Admin';
import { Customer } from './Views/Customer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Tab.Screen name="Admin" component={Admin} />
        <Tab.Screen name="Customer" component={Customer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}