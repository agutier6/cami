import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function signUp(auth, email, password, name) {
  var response = {
    success: true,
    message: 'Bingpot'
  }
  if (email === '' || password === '' || name === '') {
    response.message = 'You Brittaed it. Name, email and password are mandatory.'
    console.log(response.message);
    response.success = false;
  } else {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "https://www.w3schools.com/css/img_lights.jpg"
      }).catch((error) => {
        response.message = error.message;
        response.success = false;
        console.log(response.message);
      });
    } catch (error) {
      response.message = error.message;
      console.log(response.message);
      response.success = false;
    }
  }
  return {
    success: response.success,
    message: response.message
  };
}