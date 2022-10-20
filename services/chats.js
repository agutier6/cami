import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc } from 'firebase/firestore';
import { uploadImageAsync } from './imagePicker';
import { getStorage, ref, deleteObject } from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

export const createChatAsync = async (sender, recipients, name, photoURI) => {
    try {
        const chat = await addDoc(collection(firestore, 'groupChats'), {
            creator: sender,
            name: name
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
                    name: name
                })
                batch.set(doc(firestore, `groupChats/${chat.id}/users`, sender), {
                    dateJoined: Date.now()
                })
                recipients.forEach(recipient => {
                    batch.set(doc(firestore, `users/${recipient}/groupChats`, chat.id), {
                        name: name
                    })
                    batch.set(doc(firestore, `groupChats/${chat.id}/users`, recipient), {
                        dateJoined: Date.now()
                    })
                })
                batch.commit();
            } catch (error) {
                console.log(error);
                await deleteDoc(doc(firestore, 'groupChats', chat.id));
                await deleteObject(ref(storage, `groupChats/${chat.id}`)).catch((error) => console.log(error));
            }
        }
    } catch (error) {
        console.error(error);
    }
}