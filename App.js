import React from "react";
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Recover from "./Components/Authentication/Recover";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './config/firebase';
import RootNavigation from "./Components/Navigation/RootNavigation";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RootNavigation />
  );
}


