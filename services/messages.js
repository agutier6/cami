import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc, query, getDocs, where, limit, orderBy } from 'firebase/firestore';

const firestore = getFirestore();

export const sendGroupMessageAsync = async (groupId, message) => {
    try {
        const users = await getDocs(collection(firestore, `groupChats/${groupId}/users`));
        const batch = writeBatch(firestore);
        users.forEach(user => {
            batch.update(doc(firestore, `users/${user["id"]}/groupChats`, groupId), {
                recentMessage: message["user"]["displayName"] + ": " + message["text"],
                lastModified: Date.now()
            });
        })
        batch.set(doc(collection(firestore, `groupChats/${groupId}/messages`)), message);
        batch.commit()
    } catch (error) {
        console.error(error);
    }
}