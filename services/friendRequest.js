import { updateDoc, doc, getFirestore, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export async function getFriendStatus(sender, recipient) {
    let status = 'error';
    const firestore = getFirestore();
    const friendEntry = await getDoc(doc(firestore, `users/${sender}/friends`, recipient)).catch((error) => {
        console.log(error.message);
    })

    if (friendEntry.exists()) {
        status = friendEntry.data().status;
    } else {
        status = 'empty';
    }

    return status;
}
export async function sendFriendRequest(sender, recipient) {
    let response = { message: 'Friend request already sent.', success: false };
    const firestore = getFirestore();
    const friendEntry = await getDoc(doc(firestore, `users/${sender}/friends`, recipient)).catch((error) => {
        response.message = error.message;
        response.success = false;
        console.log(response.message);
    });
    if (!friendEntry.exists()) {
        await setDoc(doc(firestore, `users/${sender}/friends`, recipient), { status: 'sent' }).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        }).then(async () => {
            await setDoc(doc(firestore, `users/${recipient}/friends`, sender), { status: 'received' }).catch((error) => {
                response.message = error.message;
                response.success = false;
                console.log(response.message);
            }).then(() => {
                response.success = true;
                response.message = 'Friend request sent.'
            });
        });
    }
    return response;
}

export async function acceptFriendRequest(sender, recipient) {
    let response = { message: 'Request could not be accepted', success: false };
    const firestore = getFirestore();
    const friendEntry = await getDoc(doc(firestore, `users/${recipient}/friends`, sender)).catch((error) => {
        response.message = error.message;
        response.success = false;
        console.log(response.message);
    });

    if (friendEntry.exists() && friendEntry.data().status === 'received') {
        await updateDoc(doc(firestore, `users/${recipient}/friends`, sender), { status: 'accepted' }).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        }).then(async () => {
            await updateDoc(doc(firestore, `users/${sender}/friends`, recipient), { status: 'accepted' }).catch((error) => {
                response.message = error.message;
                response.success = false;
                console.log(response.message);
            }).then(() => {
                response.success = true;
                response.message = 'Friend request accepted.'
            });
        });
    }

    return response;
}

export async function rejectFriendRequest(sender, recipient) {
    let response = { message: 'Request could not be rejected', success: false };
    const firestore = getFirestore();
    const friendEntry = await getDoc(doc(firestore, `users/${recipient}/friends`, sender)).catch((error) => {
        response.message = error.message;
        response.success = false;
        console.log(response.message);
    });

    if (friendEntry.exists() && friendEntry.data().status === 'received') {
        await deleteDoc(doc(firestore, `users/${recipient}/friends`, sender)).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        }).then(async () => {
            await deleteDoc(doc(firestore, `users/${sender}/friends`, recipient)).catch((error) => {
                response.message = error.message;
                response.success = false;
                console.log(response.message);
            }).then(() => {
                response.success = true;
                response.message = 'Friend request rejected.'
            });
        });
    }

    return response;
}

export async function deleteFriend(sender, recipient) {
    let response = { message: 'Could not delete friend.', success: false };
    const firestore = getFirestore();
    const friendEntry = await getDoc(doc(firestore, `users/${sender}/friends`, recipient)).catch((error) => {
        response.message = error.message;
        response.success = false;
        console.log(response.message);
    });

    if (friendEntry.exists()) {
        await deleteDoc(doc(firestore, `users/${recipient}/friends`, sender)).catch((error) => {
            response.message = error.message;
            response.success = false;
            console.log(response.message);
        }).then(async () => {
            await deleteDoc(doc(firestore, `users/${sender}/friends`, recipient)).catch((error) => {
                response.message = error.message;
                response.success = false;
                console.log(response.message);
            }).then(() => {
                response.success = true;
                response.message = 'Friend deleted.'
            });
        });
    }

    return response;
}