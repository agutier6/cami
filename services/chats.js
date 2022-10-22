import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc, query, getDocs, where, getDoc, updateDoc } from 'firebase/firestore';
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
            description: description
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
                batch.set(doc(firestore, `groupChats/${chat.id}/users`, sender), {})
                recipients.forEach(recipient => {
                    batch.set(doc(firestore, `users/${recipient}/groupChats`, chat.id), {
                        lastModified: Date.now()
                    })
                    batch.set(doc(firestore, `groupChats/${chat.id}/users`, recipient), {})
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
        const users = await getDocs(query(collection(firestore, `groupChats/${groupId}/users`)));
        return users.docs.map(user => user.id);
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