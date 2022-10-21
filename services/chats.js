import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc, query, getDocs, where } from 'firebase/firestore';
import { uploadImageAsync } from './imagePicker';
import { getStorage, ref, deleteObject } from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

export const createChatAsync = async (sender, recipients, name, photoURI) => {
    try {
        const chat = await addDoc(collection(firestore, 'groupChats'), {
            creator: sender,
            name: name,
            creationTimestamp: Date.now()
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
                const chatDataQuery = query(collection(firestore, 'groupChats'), where('__name__', 'in', array))
                const querySnapshot = await getDocs(chatDataQuery);
                querySnapshot.docs.forEach(doc => {
                    chatData.push({
                        id: doc.id,
                        name: doc.data()["name"],
                        photoURL: doc.data()["photoURL"]
                    })
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
    return chatData;
}