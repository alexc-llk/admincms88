import { createContext, useState } from "react";

export const CreateCMSContext = createContext()

const CMSContext = (props) => {
    const [contentSite, setContentSite] = useState({}) 
    const [selectedContent, setSelectedContent] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [findContent, setFindContent] = useState({ hostname: "", path: "" })
    
    return (
        <>
            <CreateCMSContext.Provider 
                value={{ 
                    contentSite, setContentSite, 
                    selectedContent, setSelectedContent, 
                    currentPage, setCurrentPage,
                    findContent, setFindContent
                }}
            >
                { props.children }
            </CreateCMSContext.Provider>
        </>
    )
}

export default CMSContext