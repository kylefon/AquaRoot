import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../utils/actions";
import { User } from "@supabase/supabase-js";
import { ActivityIndicator, Text, View } from "react-native";

const UserContext = createContext(null);

export const useUserContext = () => {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                if (!user) {
                    setUser(null);
                    return;
                }
                setUser(user);
            } catch (err) {
                console.error("Unexpected error:", err);
                setUser(null);
            }
        }
        
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={ user }>
            { children }
        </UserContext.Provider>
    );
}