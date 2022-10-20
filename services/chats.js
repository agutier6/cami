import { doc, getFirestore, addDoc, writeBatch, collection } from 'firebase/firestore';

const firestore = getFirestore();

export const createChatAsync = async (sender, recipients, name, photoURL) => {
    try {
        const chat = await addDoc(collection(firestore, 'chats'), {
            creator: sender,
            users: sender.concat(recipients),
            name: name,
            photoURL: photoURL
        });
        if (chat.exists()) {
            const batch = writeBatch(firestore);
            batch.set(doc(firestore, `users/${sender}/chats`, chat.id), {
                name: name
            })
            recipients.forEach(recipient => {
                batch.set(doc(firestore, `users/${recipient}/chats`, chat.id), {
                    name: name
                })
            })
            batch.commit();
        }
    } catch (error) {
        console.error(error);
    }
}