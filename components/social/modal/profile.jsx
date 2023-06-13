import { useState, useContext } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"
import Image from "next/image"
import Button from "../../generic/button/button"

const CreateProfileModal = ({ openModal, setOpenModal, renderPage }) => {
    const { facebookProfileData, setFacebookProfileData } = useContext(CreateFacebookContext)

    const [addProfileData, setAddProfileData] = useState([{ profile_id: "", access_token: "" }])
    const [duplicateId, setDuplicateId] = useState([])
    const [duplicateInput, setDuplicateInput] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const resetState = () => {
        setDuplicateInput([])
        setDuplicateId([])
        setError("")
    }

    const insertRow = () => {
        resetState()
        if (addProfileData.length + 1 > 5) {
            setError("Only a max of 5 rows are allowed")
            console.log(error)
            return setTimeout(() => setError(""), 5000)
        }
        setAddProfileData([...addProfileData, { profile_id: "", access_token: "" }])
    }

    const deleteRow = (index) => {
        resetState()
        const newData = addProfileData.filter((_, i) => i !== index)
        setAddProfileData(newData)
    }

    const handleChange = (index, e) => {
        resetState()
        const { name, value } = e.target

        const newEntries = [...addProfileData]
        newEntries[index][name] = value
        setAddProfileData(newEntries)
    }

    const validateEmptyInput = () => {
        const emptyInput = addProfileData.map((entry) => {
            if(entry.profile_id === "" || entry.access_token === "") {
                return false
            } 
            return true
        })

        return emptyInput
    }

    const validateDuplicateInput = () => {
        const inputID = []
        addProfileData.map(profile => {
            inputID.push(profile.profile_id)
        })
        const uniqueSet = new Set(inputID)
        const filteredElement = addProfileData.map((profile, index) => {
            if(uniqueSet.has(profile.profile_id)) {
                uniqueSet.delete(profile.profile_id)
                return false
            } else {
                duplicateInput.push(profile)
                return true
            }
        })

        setDuplicateInput(duplicateInput)
        // console.log(duplicateInput, "DUPLICATES")
        
        if(filteredElement.includes(true)) {
            return false
        }

        return true
    }

    // pass tk
    const createProfile = async () => {
        resetState()
        
        const emptyInput = validateEmptyInput()

        if(emptyInput.includes(false)) {
            return setError("Field cannot be empty...!")
        }

        const duplicateInput = validateDuplicateInput()
        if(!duplicateInput) {
            return setError("Not allow to have duplicate Profile ID input...!")
        }

        const newEntries = await Promise.all(addProfileData.map(async (item) => {
            const response = await fetch(`https://graph.facebook.com/v16.0/me?access_token=${item.access_token}`)

            item.platform = "facebook"   
            item.bm_account = []
            item.ad_account = []
            item.campaign = []
            item.adset = []
            item.ad = []
            item.created_at = new Date()
            item.valid_token = response.status === 200 ? true : false

            return item
        }))

        try {
            setLoading(true)
            const response = await fetch("/api/facebook/create-profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEntries)
            })

            if(response.status !== 200) {
                setError("Something went wrong while trying to create a profile. Check for duplicates profile ID...!")
                setLoading(false)
                return
            } else {
                renderPage()
                setLoading(false)
                setOpenModal(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if(loading) {
        return (<div className="absolute top-0 left-0 w-[100%] h-screen flex justify-center items-center">
            <div 
                className="fixed bg-[#33333350] w-[100%] h-screen top-0 left-0 z-10" 
            />
            <div className="fixed w-[85%] max-h-[80%] bg-white z-20 left-[7.5%] top-[12%] shadow.lg rounded-lg">
                <p className="m-5 my-10 animate-bounce">Creating Profiles...</p>
            </div>
        </div>)
    }

    return (
        <div className="absolute top-0 left-0 w-[100%] h-screen flex justify-center items-center">
            <div 
                className="fixed bg-[#33333350] w-[100%] h-screen top-0 left-0 z-10" 
                onClick={() => setOpenModal(!openModal)}
            />

            <div className="fixed w-[85%] max-h-[80%] bg-white z-20 left-[7.5%] top-[12%] shadow.lg rounded-lg">
                <Image
                    onClick={() => setOpenModal(false)}
                    className='object-contain absolute top-4 left-3 hover:cursor-pointer'
                    src='/icons/close.png'
                    width='18'
                    height='18'
                    alt='close-icon'
                />
                
                <h4 className="px-3 py-3 font-[600] text-slate-600 text-lg text-center bg-[#ECF2FF] rounded-t-lg">
                    Create Profile(s)
                </h4>
    
                <div className="mt-3 flex flex-col mx-[20%]">
                    <p className="text-red-400 font-bold text-sm mb-2 text-center">{error}</p>
                    <div className="flex mb-3 mx-5 gap-3">
                        {/* {JSON.stringify(addProfileData)} */}
                            <Button 
                                title="Add Row"
                                profile_name={facebookProfileData.profile_name}
                                src='/icons/add.png'
                                width='18'
                                height='18'
                                color="bg-[#E6E657]"
                                method={insertRow}
                            />

                            <Button     
                                title="Create Profile"
                                profile_name={facebookProfileData.profile_name}
                                src='/icons/add-user.png'
                                width='18'
                                height='18'
                                color="bg-[#86C8BC]"
                                method={createProfile}
                            />
                    </div>

                    <div className="mb-5">
                        {addProfileData.map((_, index) => 
                            <div key={index} className="flex items-center my-1">
                                <div className="mr-3"><p className="text-gray-700 font-[500] text-[0.8rem] w-4">{index + 1}.</p></div>
                                <input 
                                    className={`${addProfileData[index].profile_id === "" && error !== "" ? 'border-red-500' : 'border-slate-500'} border-[1px] px-3 py-1 mr-5 text-[0.8rem]`}
                                    type="text" 
                                    placeholder="Profile ID..." 
                                    name="profile_id"
                                    onChange={(e) => handleChange(index, e)} 
                                    value={addProfileData[index].profile_id}
                                />
                                <input 
                                    className={`${addProfileData[index].access_token === "" && error !== "" ? 'border-red-500' : 'border-slate-500'} border-[1px] px-3 py-1 mr-5 text-[0.8rem]`}
                                    type="text" 
                                    placeholder="Access Token..." 
                                    name="access_token"
                                    onChange={(e) => handleChange(index, e)}
                                    value={addProfileData[index].access_token}
                                />
                                {addProfileData.length !== 1 
                                    ?   <div className="w-5 ml-3">
                                            <Image
                                                onClick={() => deleteRow(index)}
                                                className='object-contain hover:cursor-pointer'
                                                src='/icons/trash.png'
                                                width='16'
                                                height='16'
                                                alt='up-arrow'
                                            />
                                        </div>
                                    : <div className="w-5 ml-3"></div>
                                }
                                {duplicateId.filter(duplicate => duplicate.profile_id == addProfileData[index].profile_id).length !== 0
                                    && <div className="ml-2 mb-1"><span className="text-red-500 font-bold text-[0.8rem]">Duplicate ID</span></div>
                                }
                                {duplicateInput.filter(duplicate => duplicate.profile_id == addProfileData[index].profile_id).length !== 0
                                    && <div className="ml-2 mb-1"><span className="text-red-500 font-bold text-[0.8rem]">Duplicate Input</span></div>
                                }
                            </div>
                        )}                
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CreateProfileModal