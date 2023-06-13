import { useState, useContext } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"
import moment from "moment/moment"
import EditProfileModal from "../modal/edit_profile"
import SelectId from "./select_id"
import Statistics from "./statistics"
import ProfileDetailTable from "../table/detail"

const DashboardProfile = (props) => {
    // Global State
    const { singleFbProfile } = useContext(CreateFacebookContext)

    // Local State
    const [openModal, setOpenModal] = useState(false)
    const [activeId, setActiveId] = useState({business: "", ad: ""})
    const [timeRange, setTimeRange] = useState("today")

    return (
        <div>
            <div className="flex gap-2 flex-wrap mt-5">
                <div className="py-3 px-5 border-slate-300 border-2 rounded-md w-[60%] flex flex-col justify-center gap-3">
                    <span className="text-sm block font-[500] text-indigo-400">Current Date: {moment().toLocaleString().slice(3, 15)}</span>
                    <hr className="border-slate-300" />
                    <div className="lg:w-[70%]">
                        <SelectId 
                            singleFbProfile={singleFbProfile}
                            activeId={activeId}
                            setActiveId={setActiveId}
                            setOpenModal={setOpenModal}
                            openModal={openModal}
                        />
                    </div>
                </div>
                <div className="py-3 px-5 border-slate-300 border-2 rounded-md lg:flex-1">
                    <Statistics 
                        singleFbProfile={singleFbProfile}
                        activeId={activeId}
                        setTimeRange={setTimeRange}
                        timeRange={timeRange}
                    />
                </div>
            </div>

            <div className="mt-5">
                {activeId.ad ? 
                    <ProfileDetailTable 
                        setTimeRange={setTimeRange}
                        timeRange={timeRange}
                        activeAdaccount={activeId.ad}
                    /> : 
                    <div className="border-2 rounded-md border-indigo-500 min-h-[200px] flex items-center justify-center">
                        {!singleFbProfile.valid_token ? <p className="text-rose-400 animate-pulse">Business Manager Account Not Found</p> : 
                            <p className="text-slate-400 animate-pulse">Select an ad manager account</p>
                        }
                    </div>
                }
            </div>

            {openModal && 
                    <EditProfileModal 
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        profileId={props.profileId}
                    />
            }
        </div>
    )
}

export default DashboardProfile