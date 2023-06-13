import { useContext, useState } from "react"
import { CreateCMSContext } from "@/context/cms/cms-context"
import IconButton from "../generic/button/icon_button"
import Confirm from "../social/modal/confirm"
import Pagination from "../generic/pagination/Pagination"

const pageSize = 10

const Table = () => {
    const { contentSite, setContentSite, currentPage, setCurrentPage, selectedContent, setSelectedContent } = useContext(CreateCMSContext)

    const num_of_contents = contentSite.tableSize
    const lastPage = Math.ceil((contentSite.tableSize / pageSize))

    // Table States
    const [confirmModal, setConfirmModal] = useState(false)
    const [deleteId, setDeleteId] = useState()

    const popUpConfirm = (id) => {
        setConfirmModal(true)
        setDeleteId(id)
    }

    const closeModal = () => {
        setConfirmModal(false)
    }

    const handleClick = (e) => {
        const { checked } = e.target
        if(checked) {
            const checked = contentSite.contents.filter(content => content._id === e.target.value)[0]
            setSelectedContent((existing) => [...existing, checked._id])
        } else {
            const selected = selectedContent.filter(selectedId => selectedId !== e.target.value)
            setSelectedContent(selected)
        }
        
    }

    const deleteDomain = async (id) => {
        try {
            const response = await fetch(`/api/google-seo/delete-content`, 
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                }
            )
            const result = await response.json()
            
            setContentSite({ contents: result.data, size: result.size, tableSize: result.tableSize })
            setConfirmModal(false)
            setCurrentPage(1)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="my-5 flex justify-between">
                <div>
                    {num_of_contents ? 
                        <div className="ml-5 font-[500] text-gray-600">
                            {(pageSize * (currentPage - 1)) + 1} - {currentPage === lastPage ? num_of_contents : currentPage * pageSize} of {num_of_contents}
                        </div>         
                        :
                        <div></div>
                    }
                </div>

                {lastPage !== 1 && 
                    <Pagination 
                        lastPage={lastPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                }
            </div>
            {/* {JSON.stringify(selectedContent)} */}
            <div>
                <header className="flex w-[100%] text-gray-700 bg-[#ECF2FF] py-2 font-[500]">
                    <div className="w-[10%] text-center">Check</div>
                    <div className="w-[40%] text-center">Domain Url</div>
                    <div className="w-[30%] text-center">Path</div>
                    <div className="w-[20%] text-center">Edit / Delete</div>
                </header>
            </div>

            <div>
                {Array.isArray(contentSite.contents) && contentSite.contents.map((data, i) => (
                    <section className="flex justify-evenly items-center w-[100%] text-sm border-y-[1px] py-3" key={i}>
                        <div className="w-[10%] text-center">
                            {/* <input checked={user.selected} onChange={(e) => handleClick(e)} className="w-5" type="checkbox" id={user.profile_id} value={user.profile_id} /> */}
                            <input checked={selectedContent.filter(selectedId => selectedId === data._id).length > 0 ? true : false} onChange={handleClick} type="checkbox" value={data._id} />
                        </div>
                        <div className="w-[40%] text-center">{data.hostname}</div>
                        <div className="w-[30%] text-center">{data.path}</div>
                        <div className="w-[20%] text-center">
                            <div className="flex justify-center">
                                <IconButton 
                                    href={`google-seo/${data._id}`}
                                    src="/icons/edit2.png"
                                />
                                <IconButton 
                                    clickFunc={() => popUpConfirm(data._id)}
                                    src="/icons/trash.png"
                                />
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <div className="my-5 flex justify-end">
                {lastPage !== 1 && 
                    <Pagination 
                        lastPage={lastPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                }
            </div>

            {
                confirmModal && 
                <Confirm 
                    executeFunction={() => deleteDomain(deleteId)}
                    closeModal={closeModal}
                />
            }
        </div>
  )
}

export default Table