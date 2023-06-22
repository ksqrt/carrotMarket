import React, { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie'
export const Context = React.createContext();

export const ContextStore = ({ children }) => {
    let initialValue = null;
    const [cookies] = useCookies(['USER_SESSION']);
    const [userData, setUserData] = useState(initialValue)
    const [query, setQuery] = useState('')
    
    useEffect(() => {
        if (cookies.USER_SESSION) {
            fetch(`/auth/getUser`).then(res => res.json())
                .then(res => {
                    return setUserData(res.user)
                })
        }
        if (!userData) {
            const localStorageData = localStorage.getItem('user');
            const parsedData = JSON.parse(localStorageData);
            setUserData(parsedData);
        }
    }, [])

    console.log(userData);

    const providerValue = useMemo(() => ({ userData, setUserData, query, setQuery }), [userData, setUserData, query, setQuery]);

    return (
        <Context.Provider value={providerValue}>
            {children}
        </Context.Provider>
    )
}



