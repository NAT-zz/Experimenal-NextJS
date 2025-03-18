'use client';
import React from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebase_app from '@/firebase/config';
import { User } from 'firebase/auth';
import { ReactNode } from 'react';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

interface AuthContextType {
    user: User | null;
}

export const useAuthContext = (): AuthContextType =>
    React.useContext(AuthContext) as AuthContextType;

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
