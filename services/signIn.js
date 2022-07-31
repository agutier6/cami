import { signInWithEmailAndPassword } from 'firebase/auth';

export async function signIn(auth, email, password) {
    var response = {
        success: true,
        message: 'Bingpot'
    }
    if (email === '' || password === '') {
        response.message = 'You Brittaed it. Email and password are mandatory.'
        console.log(response.message);
    } else {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            response.message = error.message;
            console.log(response.message);
        }
    }
    return {
        success: response.success,
        message: response.message
    };
}