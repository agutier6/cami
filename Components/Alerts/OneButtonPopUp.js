import { Alert } from "react-native";
export function createOneButtonAlert(title, message, buttonText) {
    Alert.alert(title, message, [
        {
            text: buttonText,
            onPress: () => console.log(buttonText + ' pressed'),
        },
    ]);
}

