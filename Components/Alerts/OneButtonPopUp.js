import { Alert } from "react-native";
export function createOneButtonAlert(title, message, buttonText) {
    Alert.alert(title, message, [
        {
            text: buttonText
        },
    ]);
}

export function createOneButtonActionAlert(title, message, confirmText, denyText, action) {
    Alert.alert(title, message, [
        {
            text: denyText
        },
        {
            text: confirmText,
            onPress: () => action ? action() : console.error("Action Missing"),
        },
    ]);
}

