import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser, getUsername } from "../utils/actions";
import { User } from "@supabase/supabase-js";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const UserContext = createContext(null);

export const useUserContext = () => {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                if (!user) {
                    setUser(null);
                    return;
                }

                const { data, error } = await getUsername(user.id);
                if (error) {
                    console.error("Unable to get username:", error);
                    return;
                }

                setUser(user);
                setUsername(data?.[0]?.username);
            } catch (err) {
                console.error("Unexpected error:", err);
                setUser(null);
            }
        }
        
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, username }}>
            { children }
        </UserContext.Provider>
    );
}