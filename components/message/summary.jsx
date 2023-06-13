import { useState, useContext } from "react"
import { CreateCMSContext } from "@/context/cms/cms-context"
import Image from "next/image"
import Button from "../generic/button/button"
import Confirm from "../social/modal/confirm"
// import data from "./modal/hostname.json"

const Summary = ({ toggleModalSite }) => {
    const { contentSite, setContentSite, setFindContent, selectedContent, setSelectedContent } = useContext(CreateCMSContext)

    const [hostName, setHostName] = useState("")
    const [search, setSearch] = useState("")
    const [confirmModal, setConfirmModal] = useState(false)

    const emptySearch = () => {
		setSearch("")
        setFindContent({ hostname: "", path: "" })
	}

    const closeModal = () => {
        setConfirmModal(false)
    }

    const handleChange = (e) => {
        setHostName(e.target.value)
    }

    const searchProfileId = () => {
        setFindContent({ hostname: hostName, path: search })
    }

    const deleteMultiple = async () => {
        try {
            const response = await fetch(`/api/google-seo/delete-content`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ ids: selectedContent })
                }
            )
            const result = await response.json()
            setContentSite({ contents: result.data, size: result.size, tableSize: result.tableSize })
            setSelectedContent([])
            setConfirmModal(false)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='flex gap-3 mt-2 flex-wrap justify-center'>
            <div className='border-2 py-5 px-5 maxw-[12%] rounded-md flex flex-col justify-center items-center'>
                <Button  
                    title="Delete"
                    profile_name="Google SEO"
                    src='/icons/trash.png'
                    width='18'
                    height='18'
                    color="bg-[#FF9F9F]"
                    method={() => setConfirmModal(true)}
                />
            </div>

            {/* <div className='flex flex-col justify-center border-2 py-3 px-5 rounded-md'>
                <h4 className='font-[500] text-left text-gray-400'>
                    Total Records
                </h4>
                <div className='flex justify-center items-center'>
                    <p className='text-[2.5rem] font-[600] text-[#2da85f]'>{contentSite.size}</p>
                </div>
                <div className='font-bold w-[100%] text-[0.7rem]'>
                    <p className="text-gray-600">Last content created : </p>
                    <p className="text-[#823df2]">{contentSite.contents && contentSite.contents[0].hostname}</p>
                </div>
            </div> */}

            <div className='flex flex-col justify-end py-5 px-5 rounded-md w-[100%] lg:flex-1 gap-3 text-[0.8rem]'>
                <div className="flex border-2 self-end w-[250px] rounded-sm">
                    <input 
                        className="p-2 focus:outline-none w-[100%]"
                        placeholder='Search by id...' 
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                
                    <button
                        disabled={search === "" ? true : false} 
                        onClick={emptySearch}
                        className={`${search === "" && "opacity-0"} transition-all duration-500`}
                    >
                        <Image 
                            className="object-contain mr-5"
                            src="/icons/close.png" 
                            width="12" 
                            height="12" 
                            alt="close"
                        />
                    </button>
            
                    <button 
                        disabled={search === "" ? true : false} 
                        className={`${search === "" && "opacity-0 translate-x-[2rem]"} bg-[#7CB9E8] hover:bg-[#7CB9E890] px-3 rounded-r-sm transition-all duration-500`}
                        onClick={searchProfileId}
                    >
                        Find
                    </button>
                </div>
            </div>

            {confirmModal && 
                <Confirm 
                    executeFunction={deleteMultiple}
                    closeModal={closeModal}
                />
            }
        </div>
    )
}

export default Summary