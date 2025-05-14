import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../utils/actions";
import { useDrizzle } from "@/hooks/useDrizzle";
import { AuthenticatedUser } from "@/types/models";

type UserContextType = {
    user: AuthenticatedUser | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);
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
    }, [drizzleDb]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            { children }
        </UserContext.Provider>
    );
}