// import React, { useState, useEffect, useMemo } from 'react';
// import { useCookies } from 'react-cookie'
// export const Context = React.createContext();

// export const ContextStore = ({ children }) => {
//     let initialValue = null;
//     const [cookies] = useCookies(['USER_SESSION']);
//     const [userData, setUserData] = useState(initialValue)
    
//     useEffect(() => {
//         if (cookies.USER_SESSION) {
//             const userSession = cookies.USER_SESSION;
//             console.log(userSession);
//             fetch(`http://localhost:5000/auth/getUser`).then(res => res.json())
//                 .then(res => {
//                     return setUserData(res.user)
//                 })
//         }
//     }, [])

//     console.log(userData)
//     const providerValue = useMemo(() => ({ userData, setUserData }), [userData, setUserData])

//     return (
//         <Context.Provider value={providerValue}>
//             {children}
//         </Context.Provider>
//     )
// }

import React, { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie'
export const Context = React.createContext();

export const ContextStore = ({ children }) => {
    let initialValue = null;
    const [cookies] = useCookies(['USER_SESSION']);
    const [userData, setUserData] = useState(initialValue)
    
    useEffect(() => {
        if (cookies.USER_SESSION) {
            fetch(`/auth/getUser`).then(res => res.json())
                .then(res => {
                    return setUserData(res.user)
                })
        }
    }, [])

    console.log(userData)
    const providerValue = useMemo(() => ({ userData, setUserData }), [userData, setUserData])

    return (
        <Context.Provider value={providerValue}>
            {children}
        </Context.Provider>
    );
};
