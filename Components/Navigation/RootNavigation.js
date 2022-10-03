import UserStack from './UserStack';
import AuthStack from './AuthStack';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RootNavigation() {
    const [user, setUser] = useState();
    const auth = getAuth();

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

    return user ? <UserStack /> : <AuthStack />;
}