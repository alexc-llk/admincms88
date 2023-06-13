import Image from "next/image"
import Button from "../../generic/button/button"
import { useContext, useState, useEffect } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"

const EditProfileModal = ({ openModal, setOpenModal, profileId }) => {
    const { facebookProfileData, singleFbProfile } = useContext( CreateFacebookContext )
    const [formInput, setFormInput] = useState({ profile_id: "", access_token: singleFbProfile.access_token, media_buyer: singleFbProfile.media_buyer })
    
    const initialize = () => {
        setFormInput(facebookProfileData.data.filter(profile => profile.profile_id === profileId)[0])
    }

    const editProfileData = async () => {
        try {
            await fetch("/api/facebook/edit-profile", 
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formInput)
            })
        } catch (err) {
            console.log(err)
        }
        
        setOpenModal(false)
    }

    useEffect(() => {
      initialize()
    }, [])
    

    return (
        <div className="absolute top-0 left-0 w-[100%] h-screen flex justify-center items-center">
            <div 
                className="fixed bg-[#33333350] w-[100%] h-screen top-0 left-0 z-10" 
                onClick={() => setOpenModal(!openModal)}
            />

            <div className="fixed min-w-[50%] bg-white z-20 shadow.lg rounded-lg">
                    
                    <Image
                        onClick={() => setOpenModal(false)}
                        className='object-contain absolute top-4 left-3 hover:cursor-pointer'
                        src='/icons/close.png'
                        width='18'
                        height='18'
                        alt='close-icon'
                    />
                    
                    <h4 className="px-3 py-3 font-[600] text-slate-600 text-lg text-center bg-[#ECF2FF] rounded-t-lg">
                        Edit Profile 
                    </h4>

                    <div className="px-10 py-10 flex flex-col justify-between min-h-[220px]">
                        
                        {/* <div className="flex">
                            <label className="w-[10rem]">Profile ID</label>
                            <span>:</span>
                            <input 
                                value={formInput.profile_id}
                                onChange={(e) => setFormInput((existing) => ({...existing, profile_id: e.target.value }))}
                                type="text" 
                                placeholder="Profile ID" 
                                className="border-[1px] px-3 py-1 ml-5 border-gray-500 rounded-sm text-[#428ac9] font-[500]" 
                                autoFocus
                            />
                        </div> */}
                            
                        <div className="flex">
                            <label className="w-[10rem]">Access Token: </label>
                            <span>:</span>
                            <input 
                                value={formInput?.access_token}
                                onChange={(e) => setFormInput((existing) => ({...existing, access_token: e.target.value}))}
                                type="text" 
                                placeholder="Access Token" 
                                className="border-[1px] px-3 py-1 ml-5 border-gray-500 rounded-sm text-[#428ac9] font-[500]" 
                                autoFocus
                            />
                        </div>

                        <div className="flex">
                            <label className="w-[10rem]">Media Buyer: </label>
                            <span>:</span>
                            <input 
                                value={formInput?.media_buyer}
                                onChange={(e) => setFormInput((existing) => ({...existing, media_buyer: e.target.value}))}
                                type="text" 
                                placeholder="Media Buyer" 
                                className="border-[1px] px-3 py-1 ml-5 border-gray-500 rounded-sm text-[#428ac9] font-[500]" 
                                autoFocus
                            />
                        </div>

                        <div>
                            <Button 
                                title="Edit Confirm"
                                src='/icons/edit.png'
                                width='18'
                                height='18'
                                color="bg-[#86C8BC]"
                                method={editProfileData}
                            />
                        </div>
                    </div>

                    
            </div>
        </div>
    )
}

export default EditProfileModal