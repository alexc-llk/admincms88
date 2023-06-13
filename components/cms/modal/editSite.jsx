import { useState } from "react"
import data from "./hostname.json"

const EditSite = (props) => {
    // Component State
    const [content, setContent] = useState(props.siteContent)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setError("")
        setContent(existingValues => ({
            ...existingValues,
            [e.target.name]: e.target.value
        }))
    }

    const updateContentApi = async (e) => {
        e.preventDefault()

        if(content.domain === "" || content.path === "" || content.description === "" || content.title === "" || content.keywords === "") {
            return setError("All input must not be empty...!")
        }

        try {
            const response = await fetch(
                `/api/google-seo/edit-content`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(content)
                }
            )
            const result = await response.json()
            props.setSiteContent(result.data[0])
        } catch (error) {
            console.log(error)
        }

        props.setOpenEditModal(false)
    }

    return (
        <div className="fixed w-[100%] h-screen flex justify-center items-center top-0 left-0">
            <div 
                className="fixed w-[100%] h-screen bg-[#33333380]"
                onClick={() => props.setOpenEditModal(false)}
            />
            <div className="flex w-[80%] h-[90vh] z-20">
                {/* Form Section */}
                <div className="flex-1 bg-white rounded-lg flex flex-col justify-start gap-3 items-center overflow-y-auto">
                    <h3 className="font-[700] text-[1.6rem] w-[80%] mt-10">
                        Edit Content - Form 
                    </h3>
                    
                    {/* Display Error */}
                    <p>
                        {error !== "" && 
                            <span className={`text-rose-800 bg-rose-300 text-[0.8rem] text-center font-[700] w-[300px] py-1 px-3 rounded-md fixed top-[6%] right-[40%] duration-300`}>
                                {error}
                            </span>
                        }
                    </p>

                    <form className="grid grid-cols-2 gap-5 text-[0.8rem] py-2 w-[80%]">                        
                        {/* Path Input */}
                        <div>
                            <label className="font-[500]" htmlFor="path">Path URL : </label><br />
                            <input 
                                type="text" name="path" id="path" value={content.path}
                                className="w-[100%] border-2 px-3 py-1 bg-white placeholder:font-[500] focus:outline-none" 
                                placeholder="Enter new path" 
                                onChange={handleChange}
                            />
                        </div>
                        
                        {/* Title Input */}
                        <div>
                            <label className="font-[500]" htmlFor="title">
                                {`Title (Metadata) - `} 
                                <span className={`${content.title.length > 60 && "text-rose-500"}`}>{`[ characters count: ${content.title.length} ]`}</span>
                            </label> <br />
                            <input
                                className={`w-[100%] border-2 px-3 py-1 placeholder:font-[500] focus:outline-none`}  
                                onChange={handleChange} 
                                name="title"  type="text" id="site-url" placeholder="Enter Title..." value={content.title}
                            />
                        </div>
                                    
                        {/* Keywords Input */}
                        <div>
                            <label className="font-[500]" htmlFor="keywords">{`Keywords (Metadata) :`}</label><br />
                            <input onChange={handleChange} value={content.keywords} name="keywords" className="w-[100%] border-2 px-3 py-1 placeholder:font-[500] focus:outline-none" type="text" id="site-url" placeholder="Enter keywords..." />
                        </div>

                        {/* Descriptions Input */}
                        <div className="col-span-2">
                            <label className="font-[500]" htmlFor="description">{`Description (Metadata) - `} 
                                <span className={`${content.description.length > 160 && "text-rose-500"}`}>
                                    {`[ characters count: ${content.description.length} ]`}
                                </span>
                            </label><br />
                            <textarea onChange={handleChange} value={content.description} name="description" className="w-[100%] h-[80px] border-2 px-3 py-1 resize-none placeholder:font-[500] focus:outline-none" type="text" id="site-url" placeholder="Enter Description..." />
                        </div>

                        {/* <div className="col-span-2">
                            <label className="font-[500]" htmlFor="schema">{`Schema Markup (JSON) :`}</label><br />
                            <div className="flex gap-3">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    {schemas.map((_, index) => 
                                        <div className="w-[100%] h-[190px] border-2 placeholder:font-[500] relative" key={index}>
                                            <textarea className="resize-none w-[96.5%] h-[155px] m-2 focus:outline-none" onChange={(e) => handleSchema(e, index)} name={`schema${index}`} type="text" id="site-url" placeholder="Enter Schema..."  />
                                            <Image
                                                onClick={() => deleteSchema(index)}
                                                className="absolute bottom-1 right-1 opacity-50 w-3 h-3 hover:cursor-pointer hover:opacity-100 duration-300"
                                                src="/icons/trash.png" height={100} width={100} alt="delete schema"
                                            />
                                        </div>
                                        
                                    )}
                                </div>
                                <Image 
                                    onClick={addSchema}
                                    className="w-6 h-6 mt-2 opacity-50 hover:cursor-pointer hover:opacity-100 duration-300"
                                    src="/icons/add.png" height={100} width={100} alt="add schema"
                                />
                            </div>
                        </div> */}

                        <button 
                            className="text-[#333] font-[700] bg-slate-200 w-[100px] h-[30px] rounded-lg my-2 hover:border-slate-200 hover:border-2 hover:text-white hover:bg-[#2A2F33] duration-300"
                            onClick={updateContentApi}
                        >
                            Edit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditSite