import React from 'react';
import { NativeBaseProvider, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

function Home() {
    const navigation = useNavigation();
    return (
        <NativeBaseProvider>
            <Button variant="outline" safeArea="10" margin="5"
                onPress={() => navigation.navigate("User Dashboard")}>
                My Account
            </Button>
        </NativeBaseProvider>
    );
}

export default Home;