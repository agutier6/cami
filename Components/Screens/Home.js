import React from 'react';
import { NativeBaseProvider, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import ExploreMain from '../Explore/ExploreMain.js';
function Home() {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesignHeaderButtons>
                    <Item title="add" iconName="user" onPress={() => navigation.navigate("User Dashboard")} />
                </AntDesignHeaderButtons>
            ),
        });
    }, [navigation]);

    return (
        <ExploreMain />
    );
}

export default Home;