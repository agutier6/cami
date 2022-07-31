import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
    const [user, setUser] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (authenticatedUser) => {
            if (authenticatedUser) {
                setUser(authenticatedUser);
            } else {
                setUser(undefined);
            }
        });
    }, []);

    return [user];
}