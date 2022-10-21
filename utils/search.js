import { compareTwoStrings } from 'string-similarity';

const MIN_SEARCH_RATING = 0.3;

export function handleUserSearch(input, setSearchResults, data) {
    if (input.length > 0) {
        let searchMap = new Map();
        data.forEach((value, key) => {
            let rating = compareTwoStrings(value.username.toLowerCase(), input.toLowerCase()) + compareTwoStrings(value.displayName.toLowerCase(), input.toLowerCase());
            if (rating > MIN_SEARCH_RATING) {
                searchMap.set(key, {
                    ...value,
                    rating: rating
                })
            }
        })
        setSearchResults(searchMap);
    } else {
        setSearchResults(null);
    }
}

export function handleChatSearch(input, setSearchChats, chatData, chats) {
    if (input.length > 0) {
        let search = [];
        chats.forEach(chat => {
            if (chatData[chat.id]) {
                let rating = compareTwoStrings(chatData[chat.id]["name"].toLowerCase(), input.toLowerCase())
                if (rating > MIN_SEARCH_RATING) {
                    search.push({
                        id: chat.id,
                        recentMessage: chat["recentMessage"],
                        lastModified: chat["lastModified"],
                        rating: rating
                    })
                }
            }
        })
        setSearchChats(search.sort((a, b) => {
            if (a.rating < b.rating) {
                return 1;
            } else if (a.rating > b.rating) {
                return -1;
            }
            return 0;
        }));
    } else {
        setSearchChats(null);
    }
}