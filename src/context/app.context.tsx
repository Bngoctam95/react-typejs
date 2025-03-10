import { fetchAccountAPI } from "services/api";
import { createContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
}

type TProps = {
    children: React.ReactNode
}

export const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            const res = await fetchAccountAPI();
            if (res?.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        fetchAccount();
    }, [])

    return (
        <>
            {isLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isLoading, setIsLoading
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)"
                }}>
                    <ClipLoader
                        color="#5ee8e8"
                    />
                </div>
            }
        </>
    );
};