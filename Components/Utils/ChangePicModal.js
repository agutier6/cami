import { Center, Modal, Button, VStack } from 'native-base';
import { pickImage, takePicture } from "../../services/imagePicker";
import React from 'react'
import { useWindowDimensions } from 'react-native';

const ChangePicModal = ({ openModal, setOpenModal, setPhotoURL }) => {
    const layout = useWindowDimensions();

    return (
        <Center>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Content maxWidth={0.9 * layout.width}>
                    <Modal.Body keyboardShouldPersistTaps={'handled'} horizontal={false}>
                        <VStack space={layout.height * 0.01}>
                            <Button onPress={async () => {
                                let pickerResult = await pickImage();
                                setPhotoURL(!pickerResult.cancelled && pickerResult.uri ? pickerResult.uri : null);
                                setOpenModal(false);
                            }}>
                                Choose Picture
                            </Button>
                            <Button onPress={async () => {
                                let pickerResult = await takePicture();
                                setPhotoURL(!pickerResult.cancelled && pickerResult.uri ? pickerResult.uri : null);
                                setOpenModal(false);
                            }}>
                                Take Picture
                            </Button>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center >
    )
}

export default ChangePicModal