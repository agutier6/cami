export function validateName(name) {
    if (name === undefined || name === "") {
        return 'A girl has no name.';
    } else if (name.length < 5) {
        return 'You undercook fish? Believe it or not, jail.';
    } else if (name.length > 50) {
        return 'You overcook chicken, also jail. Undercook, overcook.';
    } else {
        return false;
    }
};

export function validateEmail(email) {
    const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
    if (email === undefined || email === "") {
        return 'It\'s the 21st century. You must have an email.';
    } else if (email.length > 320) {
        return 'Not even Mr. Bonzu Pippinpaddle Oppsokopolis the Third has such a long email!';
    } else if (reg.test(email) === false) {
        return 'Hint: It should have an @ and a . in there somewhere.';
    } else {
        return false;
    }
};

export function validatePassword(password) {
    let passwordErrorCount = 0;
    let tempPasswordErrorMessage = 'Password must...';
    if (password === undefined || password === "") {
        return 'Would you leave your home without a lock?';
    } else {
        if (password.length < 8 || password.length > 20) {
            tempPasswordErrorMessage += '\n be betweeen 8 and 20 characters ';
            passwordErrorCount += 1;
        }
        if (!/[A-Z]/.test(password)) {
            tempPasswordErrorMessage += '\n contain at least one UPPERCASE character ';
            passwordErrorCount += 1;
        }
        if (!/[a-z]/.test(password)) {
            tempPasswordErrorMessage += '\n contain at least one lowercase character ';
            passwordErrorCount += 1;
        }
        if (!/[0-9]/.test(password)) {
            tempPasswordErrorMessage += '\n contain at least one number';
            passwordErrorCount += 1;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            tempPasswordErrorMessage += '\n contain at least one special character';
            passwordErrorCount += 1;
        }
    }
    if (passwordErrorCount === 0) {
        return false;
    } else {
        return tempPasswordErrorMessage;
    }
}

export function validateConfirmPassword(password, confirmPassword) {
    console.log(password, confirmPassword);
    if (confirmPassword === password) {
        return false;
    } else {
        return 'Passwords must match!';
    }
}

// function validateName() {
//     if (name === undefined || name === "") {
//         setNameErrorMessage('A girl has no name.');
//         return false;
//     } else if (name.length < 5) {
//         setNameErrorMessage('You undercook fish? Believe it or not, jail.');
//         return false;
//     } else if (name.length > 50) {
//         setNameErrorMessage('You overcook chicken, also jail. Undercook, overcook.');
//         return false;
//     } else {
//         setNameErrorMessage(undefined);
//         return true;
//     }
// };

// function validateEmail() {
//     const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
//     if (email === undefined || email === "") {
//         setEmailErrorMessage('It\'s the 21st century. You must have an email.');
//         return false;
//     } else if (email.length > 320) {
//         setEmailErrorMessage('Not even Mr. Bonzu Pippinpaddle Oppsokopolis the Third has such a long email!');
//         return false;
//     } else if (reg.test(email) === false) {
//         setEmailErrorMessage('Hint: It should have an @ and a . in there somewhere.');
//         return false;
//     } else {
//         setEmailErrorMessage(undefined);
//         return true;
//     }
// };

// function validatePassword() {
//     let passwordErrorCount = 0;
//     let tempPasswordErrorMessage = 'Password must...';
//     if (password === undefined || password === "") {
//         setPasswordErrorMessage('Would you leave your home without a lock?');
//         return false;;
//     } else {
//         if (password.length < 8 || password.length > 20) {
//             tempPasswordErrorMessage += '\n be betweeen 8 and 20 characters ';
//             passwordErrorCount += 1;
//         }
//         if (!/[A-Z]/.test(password)) {
//             tempPasswordErrorMessage += '\n contain at least one UPPERCASE character ';
//             passwordErrorCount += 1;
//         }
//         if (!/[a-z]/.test(password)) {
//             tempPasswordErrorMessage += '\n contain at least one lowercase character ';
//             passwordErrorCount += 1;
//         }
//         if (!/[0-9]/.test(password)) {
//             tempPasswordErrorMessage += '\n contain at least one number';
//             passwordErrorCount += 1;
//         }
//         if (!/[^A-Za-z0-9]/.test(password)) {
//             tempPasswordErrorMessage += '\n contain at least one special character';
//             passwordErrorCount += 1;
//         }
//     }
//     if (passwordErrorCount == 0) {
//         setPasswordErrorMessage(undefined);
//         return true;
//     } else {
//         setPasswordErrorMessage(tempPasswordErrorMessage);
//         return false;
//     }
// }

// function validateConfirmPassword() {
//     if (confirmPassword === password) {
//         setConfirmPasswordErrorMessage(undefined);
//         return true;
//     } else {
//         setConfirmPasswordErrorMessage('Passwords must match!');
//         return false;
//     }
// }
