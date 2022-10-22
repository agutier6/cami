import { doc, getFirestore, addDoc, writeBatch, collection, deleteDoc, query, getDocs, where, limit, orderBy } from 'firebase/firestore';

const firestore = getFirestore();
const RECENT_MESSAGE_MAX_LENGTH = 20;

export const sendGroupMessageAsync = async (groupId, message) => {
    try {
        const users = await getDocs(collection(firestore, `groupChats/${groupId}/users`));
        const batch = writeBatch(firestore);
        let recentMessage = message["user"]["displayName"] + ": " + message["text"]
        recentMessage = recentMessage.length > RECENT_MESSAGE_MAX_LENGTH ? recentMessage.substring(0, RECENT_MESSAGE_MAX_LENGTH) + "..." : recentMessage;
        users.forEach(user => {
            batch.update(doc(firestore, `users/${user["id"]}/groupChats`, groupId), {
                recentMessage: recentMessage,
                lastModified: Date.now()
            });
        })
        batch.set(doc(collection(firestore, `groupChats/${groupId}/messages`)), message);
        batch.commit()
    } catch (error) {
        console.error(error);
    }
}