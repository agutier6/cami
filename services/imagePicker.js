import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

export async function handleUserImagePicked(user, photoURL) {
    var response = {
        success: false,
        message: 'Error'
    };
    try {
        updateProfilePhotoURL(user, await uploadImageAsync(photoURL, `users/${user.uid}/profilePic`));
        response.success = true;
        response.message = 'Bingpot';
    } catch (e) {
        console.error(e);
        alert('Upload failed, sorry');
        response.message = e;
    }
    return response;
};

export async function takePicture() {
    return ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
};

export async function pickImage() {
    return await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
};

export async function updateProfilePhotoURL(user, photoURL) {
    const firestore = getFirestore();
    if (photoURL) {
        updateProfile(user, {
            photoURL: photoURL
        }).catch((error) => {
            alert('Upload failed, sorry');
            console.error(error);
        }).then(async () => {
            await updateDoc(doc(firestore, "users", user.uid), {
                photoURL: photoURL
            }).catch((error) => {
                alert('Upload failed, sorry');
                console.error(error);
            });
        });
    } else {
        alert('Photo URL not found');
    }
}

export async function uploadImageAsync(uri, uploadPath) {
    console.log('__________________________________UPLOAD_IMAGE_ASYNC_______________________________________');
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.error(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const storage = getStorage();
    const storageRef = ref(storage, `${uploadPath}`);

    return await uploadBytes(storageRef, blob).then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        return url;
    });
}