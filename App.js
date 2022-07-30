import React from "react";
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Recover from "./Components/Authentication/Recover";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Log In" component={Login} />
        <Stack.Screen name="Sign Up" component={Signup} />
        <Stack.Screen name="Recover Password" component={Recover} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


