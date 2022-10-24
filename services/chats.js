import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc, query, getDocs, where, getDoc, updateDoc, deleteField, increment, limit } from 'firebase/firestore';
import { uploadImageAsync } from './imagePicker';
import { getStorage, ref, deleteObject } from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

export const createChatAsync = async (sender, recipients, name, photoURI, creatorName, description) => {
    try {
        const chat = await addDoc(collection(firestore, 'groupChats'), {
            creator: sender,
            creatorName: creatorName,
            name: name,
            creationTimestamp: Date.now(),
            description: description,
            numParticipants: 1
        });
        if (chat["id"]) {
            try {
                const batch = writeBatch(firestore);
                if (photoURI) {
                    const photoURL = await uploadImageAsync(photoURI, `groupChats/${chat.id}/groupPic`);
                    batch.update(doc(firestore, 'groupChats', chat.id), {
                        photoURL: photoURL
                    })
                }
                batch.set(doc(firestore, `users/${sender}/groupChats`, chat.id), {
                    lastModified: Date.now()
                })
                batch.set(doc(firestore, `groupChats/${chat.id}/users`, sender), { role: 'admin' })
                recipients.forEach(recipient => {
                    batch.set(doc(firestore, `users/${recipient}/groupChats`, chat.id), {
                        lastModified: Date.now()
                    })
                    batch.set(doc(firestore, `groupChats/${chat.id}/users`, recipient), {})
                })
                batch.update(doc(firestore, `groupChats`, chat.id), {
                    numParticipants: increment(recipients.length)
                })
                batch.commit();
            } catch (error) {
                console.log(error);
                await deleteDoc(doc(firestore, 'groupChats', chat.id), {});
                await deleteObject(ref(storage, `groupChats/${chat.id}`)).catch((error) => console.log(error), {});
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export const leaveGroupChatAsync = async (chatId, userId) => {
    try {
        const batch = writeBatch(firestore);
        batch.delete(doc(firestore, `groupChats/${chatId}/users`, userId));
        batch.delete(doc(firestore, `users/${userId}/groupChats`, chatId));
        batch.update(doc(firestore, 'groupChats', chatId), {
            numParticipants: increment(-1)
        })
        batch.commit();
    } catch (error) {
        console.error(error);
    }
}

export const deleteChatAsync = async (chatId) => {
    try {
        const groupParticipants = await getDocs(collection(firestore, `groupChats/${chatId}/users`));
        const batch = writeBatch(firestore);
        groupParticipants.docs.forEach(participant => {
            batch.delete(doc(firestore, `users/${participant.id}/groupChats`, chatId));
        });
        batch.delete(doc(firestore, 'groupChats', chatId));
        batch.commit();
    } catch (error) {
        console.log(error);
    }
}

export const addGroupParticipantsAsync = async (chatId, recipients) => {
    try {
        const batch = writeBatch(firestore);
        recipients.forEach(recipient => {
            batch.set(doc(firestore, `users/${recipient}/groupChats`, chatId), {
                lastModified: Date.now()
            })
            batch.set(doc(firestore, `groupChats/${chatId}/users`, recipient), {})
        })
        batch.update(doc(firestore, `groupChats`, chatId), {
            numParticipants: increment(recipients.length)
        })
        batch.commit();
    } catch (error) {
        console.error(error)
    }
}

export const addGroupAdminAsync = async (chatId, newAdminId) => {
    try {
        updateDoc(doc(firestore, `groupChats/${chatId}/users`, newAdminId), { role: 'admin' })
    } catch (error) {
        console.log(error);
    }
}

export const removeGroupAdminAsync = async (chatId, adminId) => {
    try {
        updateDoc(doc(firestore, `groupChats/${chatId}/users`, adminId), { role: deleteField() })
    } catch (error) {
        console.log(error);
    }
}

export const getChatDataAsync = async (chats) => {
    let chatData = [];
    try {
        for (let i = 0; i < chats.length; i += 10) {
            let array = chats.slice(i, Math.max(chats.length, i + 10));
            if (array.length > 0) {
                const querySnapshot = await getDocs(query(collection(firestore, 'groupChats'), where('__name__', 'in', array)));
                querySnapshot.docs.forEach(doc => {
                    chatData.push({
                        id: doc.id,
                        name: doc.data()["name"],
                        photoURL: doc.data()["photoURL"]
                    });
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
    return chatData;
}

export const getGroupParticipantsAsync = async (groupId) => {
    try {
        let participants = {}
        const users = await getDocs(query(collection(firestore, `groupChats/${groupId}/users`)));
        users.docs.forEach(user => participants[user.id] = user.data()["role"]);
        return participants;
    } catch (error) {
        console.error(error);
    }
}

export const getGroupParticipantsWithLimitAsync = async (groupId, lim) => {
    try {
        let participants = {}
        const users = await getDocs(query(collection(firestore, `groupChats/${groupId}/users`), limit(lim)));
        users.docs.forEach(user => participants[user.id] = user.data()["role"]);
        return participants;
    } catch (error) {
        console.error(error);
    }
}

export const getChatInfoAsync = async (groupId) => {
    try {
        const info = await getDoc(doc(firestore, `groupChats/${groupId}`));
        return info.exists() ? info.data() : null;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const editGroupDescriptionAsync = async (groupId, desc) => {
    try {
        await updateDoc(doc(firestore, `groupChats/${groupId}`), {
            description: desc
        })
    } catch (error) {
        console.error(error);
    }
}

export const changeGroupPhotoAsync = async (groupId, photoURI) => {
    try {
        const photoURL = await uploadImageAsync(photoURI, `groupChats/${groupId}/groupPic`);
        updateDoc(doc(firestore, 'groupChats', groupId), {
            photoURL: photoURL
        })
    } catch (error) {
        console.error(error);
    }
}

export const changeGroupNameAsync = async (groupId, name) => {
    try {
        await updateDoc(doc(firestore, `groupChats/${groupId}`), {
            name: name
        })
    } catch (error) {
        console.error(error);
    }
}