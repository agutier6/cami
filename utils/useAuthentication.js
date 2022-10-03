import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
    const [user, setUser] = useState();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            onAuthStateChanged(auth, (authenticatedUser) => {
                if (authenticatedUser) {
                    setUser(authenticatedUser);
                } else {
                    setUser(undefined);
                }
            });
        }
        return () => isSubscribed = false;
    }, []);

    return [user];
}