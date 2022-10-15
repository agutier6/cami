import UserStack from './UserStack';
import AuthStack from './AuthStack';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RootNavigation() {
    const [user, setUser] = useState();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
            if (authenticatedUser) {
                setUser(authenticatedUser);
            } else {
                setUser(undefined);
            }
        });
        return () => unsubscribe();
    }, []);

    return user ? <UserStack /> : <AuthStack />;
}