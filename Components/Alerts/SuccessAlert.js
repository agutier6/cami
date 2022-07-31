import { Alert, VStack, HStack, Text } from "native-base";
export function SuccessAlert() {
    const getTextColor = variant => {
        switch (variant) {
            case "left-accent":
            case "top-accent":
            case "subtle":
                return "coolGray.800";

            case "solid":
                return "warmGray.50";
        }
    };

    // Variants: "solid", "left-accent", "top-accent", "outline", "subtle", "outline-light"

    return (
        <Alert w="100%" variant={key} colorScheme="success" status="success">
            <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text color={getTextColor(key)}>
                            Selection successfully moved!
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
        </Alert>
    );
}