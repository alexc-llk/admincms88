import { createContext, useState, useEffect } from "react";

export const CreateTiktokContext = createContext()

const TiktokContext = (props) => {
    const [tiktokProfileData, setTiktokProfileData] = useState({profile_name: "", data: []})

    useEffect(() => {
        fetch(`/api/facebook/get-profile`)
        .then((response) => response.json())
        .then((result) => {
            const profile = {
                profile_name: "tiktok",
                data: result.data
            }
            setTiktokProfileData(profile)
        })
    }, [])
    
    
    return (
        <>
            <CreateTiktokContext.Provider value={tiktokProfileData}>
                { props.children }
            </CreateTiktokContext.Provider>
        </>
    )
}

export default TiktokContext