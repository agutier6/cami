import { updateProfile, updateEmail } from 'firebase/auth';

export async function changeName(user, name) {
    var response = {
        success: true,
        message: 'Bingpot'
    }
    if (name === '') {
        response.message = 'Name is mandatory.'
        console.log(response.message);
        response.success = false;
    } else {
        updateProfile(user, {
            displayName: name
        }).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        });
    }
    return {
        success: response.success,
        message: response.message
    };
}

export async function changeEmail(user, email) {
    var response = {
        success: true,
        message: 'Bingpot'
    }
    if (email === '') {
        response.message = 'Email is mandatory. '
        console.log(response.message);
        response.success = false;
    } else {
        updateEmail(user, email).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        });
    }
    return {
        success: response.success,
        message: response.message
    };
}