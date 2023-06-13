import { useContext, useState } from "react";
import { CreateFacebookContext } from "@/context/facebook/facebook-context";
import Image from "next/image"
import Pagination from "../../generic/pagination/Pagination";
import IconButton from "../../generic/button/icon_button";
import Confirm from "../modal/confirm";

let PageSize = 10;

// function SortButton({
//     sortOrder,
//     onClick,
//   }) {
//     return (
//       <button
//         onClick={onClick}
//         className={`${
//           sortOrder === "desc"
//             ? "rotate-180 duration-200 text-violet-500 mb-[2px] text-[10px]"
//             : "duration-200 text-violet-500 text-[10px]"
//         }`}
//       >
//         ▲
//       </button>
//     );
// }

const Table = () => {
    const { facebookProfileData, setFacebookProfileData, currentPage, setCurrentPage } = useContext(CreateFacebookContext)

    // console.log(facebookProfileData, "test")

    // State 
    const [confirmModal, setConfirmModal] = useState(false)
    const [deleteId, setDeleteId] = useState()
    
    const num_of_profiles = facebookProfileData.tableSize
    const lastPage = Math.ceil((facebookProfileData.tableSize / PageSize))

    // function changeSort() {
    //     setSortOrder(sortOrder === "ascn" ? "desc" : "ascn")
    //     setSortKey("status")
    // }
    
    const deleteProfile = async (id) => {
        const response = await fetch("/api/facebook/delete-profiles", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
        })

        const result = await response.json()
        setFacebookProfileData({...facebookProfileData, data: result.data, size: result.size, tableSize: result.tableSize})
        setConfirmModal(false)
        // console.log(facebookProfileData, "delete profile")
    }

    const popUpConfirm = (id) => {
        setConfirmModal(true)
        setDeleteId(id)
    }

    const closeModal = () => {
        setConfirmModal(false)
    }

    const handleClick = (e) => {
        const index = facebookProfileData.data.findIndex(profile => profile.profile_id === e.target.value)
        if(e.target.checked) {
            facebookProfileData.data[index].selected = true
        } else {
            facebookProfileData.data[index].selected = false
        }
    }
    
    return (
        <div>
            {
                confirmModal && 
                <Confirm 
                    executeFunction={() => deleteProfile(deleteId)}
                    closeModal={closeModal}
                />
            }
            <div className="my-5 flex justify-between">
                
                <div>
                    {
                        num_of_profiles === 0
                        ?   <div>
                                0 - 0 of 0
                            </div> 
                        :   <div className="ml-5 font-[500] text-gray-600">
                                {currentPage * PageSize - (PageSize - 1)} - {currentPage === lastPage ? num_of_profiles : currentPage * PageSize} of {num_of_profiles}
                            </div>
                    }
                </div>

                {lastPage > 1 && lastPage && 
                    <Pagination 
                        lastPage={lastPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                }
            </div>

            <div className="flex">
                <header className="flex justify-evenly w-[100%] text-gray-700 bg-[#ECF2FF] py-3">
                    <div className="w-[30%] text-center font-[500]"></div>
                    <div className="w-[100%] text-center font-[500]">Profile ID</div>
                    <div className="w-[100%] text-center font-[500]">Media Buyer</div>
                    <div className="w-[50%] text-center font-[500] flex justify-center items-center gap-2">
                        <span className="block">Account Status</span>
                        {/* <SortButton 
                            onClick={changeSort}
                            {...{sortOrder}}
                        /> */}
                    </div>
                    <div className="w-[50%] text-center font-[500]">Date Created</div>
                    <div className="w-[50%] text-center font-[500]">Edit / Delete</div>
                </header>
            </div>
                
            <div>
                {facebookProfileData.data.map(user => 
                    <section className="flex justify-evenly items-center w-[100%] text-sm border-y-[1px]" key={user.profile_id}>
                        <div className="w-[30%] text-center">
                            <input checked={user.selected} onChange={(e) => handleClick(e)} className="w-5" type="checkbox" id={user.profile_id} value={user.profile_id} />
                        </div>
                        <div className="w-[100%] text-center py-2">{user.profile_id}</div>
                        <div className="w-[100%] text-center py-2">{user.media_buyer ? user.media_buyer : "unassigned"}</div>
                        <div className="w-[50%] flex justify-center py-2">
                        {user.valid_token 
                            ? <Image src="/icons/checkmark.png" width="25" height="25" alt="checkmark" /> 
                            : <Image src="/icons/close.png" width="22" height="22" alt="error" />}
                        </div>
                        <div className="w-[50%] text-center py-2 text-[0.8rem]">
                            <p>
                                {user.created_at && user.created_at.toString().substring(0, 10)}, {user.created_at && (Number(user.created_at.toString().substring(11, 13)) + 8).toString() + user.created_at.toString().substring(13, 16)}
                            </p>
                        </div>
                        <div className="w-[50%] text-center py-2 flex justify-center">
                            <div className="flex justify-center">
                                <IconButton 
                                    href={`profile/${user._id}`}
                                    src="/icons/edit2.png"
                                />
                                <IconButton 
                                    clickFunc={() => popUpConfirm(user.profile_id)}
                                    src="/icons/trash.png"
                                />
                            </div>
                        </div>
                    </section>
                )}
            </div>
            
        
            <div className="my-5 flex justify-end">
                {lastPage > 1 && lastPage && 
                    <Pagination 
                        lastPage={lastPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                }
            </div>
        </div>
    )
}

export default Table