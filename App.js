import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './config/firebase';
import RootNavigation from "./Components/Navigation/RootNavigation";
import store from './app/store'
import { Provider } from 'react-redux'
import { NativeBaseProvider } from "native-base";
import { nativeBaseTheme } from "./styles/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={nativeBaseTheme}>
        <RootNavigation />
      </NativeBaseProvider>
    </Provider>
  );
}


