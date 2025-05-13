import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../utils/actions";
import { User } from "@supabase/supabase-js";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useDrizzle } from "@/hooks/useDrizzle";

const UserContext = createContext(null);

export const useUserContext = () => {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const drizzleDb = useDrizzle()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getAuthenticatedUser(drizzleDb);
                if (!user) {
                    setUser(null);
                    return;
                }
                
                setUser(user);
            } catch (err) {
                console.error("Unexpected error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            { children }
        </UserContext.Provider>
    );
}