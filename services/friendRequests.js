import { doc, getFirestore, getDocs, runTransaction, query, collection, where } from 'firebase/firestore';

const firestore = getFirestore();

export const sendFriendRequestAsync = async (sender, recipient) => {
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${sender}/friends`, recipient));
            if (friendEntry.exists()) {
                throw "Already sent friend request!";
            }
            transaction.set(doc(firestore, `users/${sender}/friends`, recipient), { status: 'sent' });
            transaction.set(doc(firestore, `users/${recipient}/friends`, sender), { status: 'received' });
        })
    } catch (error) {
        console.error(error);
    }
}

export const acceptFriendRequestAsync = async (sender, recipient) => {
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Friend request not found";
            }
            const recipientNumFriends = await transaction.get(doc(firestore, 'users', recipient));
            const senderNumFriends = await transaction.get(doc(firestore, 'users', sender));
            transaction.update(doc(firestore, `users/${recipient}/friends`, sender), { status: 'accepted' });
            transaction.update(doc(firestore, `users/${sender}/friends`, recipient), { status: 'accepted' });
            transaction.update(doc(firestore, 'users', recipient), { numFriends: recipientNumFriends.exists() && recipientNumFriends.data()["numFriends"] ? recipientNumFriends.data().numFriends + 1 : 1 });
            transaction.update(doc(firestore, 'users', sender), { numFriends: senderNumFriends.exists() && senderNumFriends.data()["numFriends"] ? senderNumFriends.data().numFriends + 1 : 1 });
        })
    } catch (error) {
        console.error(error);
    }
}

export const rejectFriendRequestAsync = async (ender, recipient) => {
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Friend request not found";
            }
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
        })
    } catch (error) {
        console.error(error);
    }
}

export const deleteFriendAsync = async (sender, recipient) => {
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists()) {
                throw "Could not find friend";
            }
            const recipientNumFriends = await transaction.get(doc(firestore, 'users', recipient));
            const senderNumFriends = await transaction.get(doc(firestore, 'users', sender));
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
            transaction.update(doc(firestore, 'users', recipient), { numFriends: recipientNumFriends.exists() && recipientNumFriends.data()["numFriends"] ? recipientNumFriends.data().numFriends - 1 : 0 });
            transaction.update(doc(firestore, 'users', sender), { numFriends: senderNumFriends.exists() && senderNumFriends.data()["numFriends"] ? senderNumFriends.data().numFriends - 1 : 0 });
        })
    } catch (error) {
        console.error(error);
    }
}

export const cancelFriendRequestAsync = async (sender, recipient) => {
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Could not find friend request";
            }
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
        })
    } catch (error) {
        console.error(error);
    }
}

export const getFriendsAsync = async (status, userId) => {
    try {
        const friendsQuery = query(collection(firestore, `users/${userId}/friends`), where('status', '==', status))
        const querySnapshot = await getDocs(friendsQuery);
        return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.log(error);
    }
}

export const getFriendsDataAsync = async (friends) => {
    let friendsData = []
    try {
        for (let i = 0; i < friends.length; i += 10) {
            let array = friends.slice(i, Math.max(friends.length, i + 10));
            if (array.length > 0) {
                const friendsDataQuery = query(collection(firestore, 'users'), where('__name__', 'in', array))
                const querySnapshot = await getDocs(friendsDataQuery);
                friendsData = friendsData.concat(querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    username: doc.data().username,
                    displayName: doc.data().displayName,
                    photoURL: doc.data().photoURL
                })))
            }
        }
        return friendsData;
    } catch (error) {
        console.log(error)
    }
}