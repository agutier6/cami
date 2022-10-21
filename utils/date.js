const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getChatEntryDate(lastModified) {
    const now = new Date();
    const date = new Date(lastModified);
    if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        if (date.getHours() >= 12) {
            return (date.getHours() - 12 === 0 ? 12 : date.getHours() - 12) + ":" + date.getMinutes() + " PM";
        } else {
            return (date.getHours() === 0 ? 12 : date.getHours()) + ":" + date.getMinutes() + " AM";
        }
    } else if (date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return "Yesterday";
    } else if (now.getDate() === 0 && date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()) {
        return "Yesterday";
    } else if (now.getDate() === 0 && now.getMonth() === 0 && date.getFullYear() === now.getFullYear() - 1) {
        return "Yesterday";
    }
    return date.getDate() + " " + mon[date.getMonth()] + " " + date.getFullYear();
}