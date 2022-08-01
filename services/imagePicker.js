import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth'

async function handleImagePicked(pickerResult, uploadPath) {
    try {
        if (!pickerResult.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResult.uri, uploadPath);
            console.log('2: ' + uploadUrl);
            return uploadUrl;
        }
    } catch (e) {
        console.log(e);
        alert('Upload failed, sorry');
    }
};

export async function takePicture(uploadPath) {
    let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
    console.log("taking a photo");
    return handleImagePicked(pickerResult, uploadPath);
};

export async function pickImage(uploadPath) {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
    });
    console.log("just picking... ");
    return handleImagePicked(pickerResult, uploadPath);
};

export async function pickProfilePhoto(auth, userId) {
    const photoURL = await pickImage(`users/${userId}/profilePic`);
    console.log('dkrkrkrkrkrkrkrkrk');
    updateProfilePhotoURL(auth, photoURL);
    return photoURL;
}

export async function takeProfilePhoto(auth, userId) {
    const photoURL = await takePicture(`users/${userId}/profilePic`);
    updateProfilePhotoURL(auth, photoURL);
    return photoURL;
}

export async function updateProfilePhotoURL(auth, photoURL) {
    console.log(photoURL);

    if (photoURL) {
        updateProfile(auth.currentUser, {
            photoURL: photoURL
        }).then(() => {
            console.log('Profile Picture Uploaded:' + photoURL);
        }).catch((error) => {
            console.log(error);
        });
    } else {
        console.log('No photo url');
    }
}

async function uploadImageAsync(uri, uploadPath) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
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
        console.log('hello: ' + url);
        return url;
    });
    return uploadTask;
}