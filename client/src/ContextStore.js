import React, { createContext, useState, useEffect, useMemo } from 'react';

export const Context = React.createContext();

export const ContextStore = ({ children }) => {
    let initialValue = null;
    const [userData, setUserData] = useState(initialValue);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/auth/getUser`).then(res => res.json())
            .then(res => {
                console.log(setUserData(res.user))
                return setUserData(res.user)
            })
    }, []);

    const providerValue = useMemo(() => ({ userData, setUserData, query, setQuery }), [userData, setUserData, query, setQuery]);

    return (
        <Context.Provider value={providerValue}>
            {children}
        </Context.Provider>
    );
};
