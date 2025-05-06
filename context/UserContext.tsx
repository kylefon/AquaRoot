import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../utils/actions";

const UserContext = createContext(null);

export const useUserContext = () => {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                if (!user) {
                    console.error("Error fetching user");
                    setUser(null);
                    return;
                }

                console.log( "USER", user);
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