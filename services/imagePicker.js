import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

async function handleImagePicked(pickerResult, uploadPath) {
    try {
        if (!pickerResult.cancelled) {
            return await uploadImageAsync(pickerResult.uri, uploadPath);
        }
    } catch (e) {
        console.error(e);
        alert('Upload failed, sorry');
    }
};

export async function takePicture(uploadPath) {
    let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
    return handleImagePicked(pickerResult, uploadPath);
};

export async function pickImage(uploadPath) {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
    return handleImagePicked(pickerResult, uploadPath);
};

export async function pickProfilePhoto(user, userId) {
    const photoURL = await pickImage(`users/${userId}/profilePic`);
    updateProfilePhotoURL(user, photoURL);
    return photoURL;
}

export async function takeProfilePhoto(user, userId) {
    const photoURL = await takePicture(`users/${userId}/profilePic`);
    updateProfilePhotoURL(user, photoURL);
    return photoURL;
}

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

async function uploadImageAsync(uri, uploadPath) {
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

    const uploadTask = await uploadBytes(storageRef, blob).then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        return url;
    });

    return uploadTask;
}