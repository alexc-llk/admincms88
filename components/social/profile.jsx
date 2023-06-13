import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import CreateProfileModal from "./modal/profile";
import { CreateFacebookContext } from "@/context/facebook/facebook-context";
import Table from "./table/table";
import Button from "../generic/button/button";
import Confirm from "./modal/confirm";
import Error from "./modal/error";

const Profile = ({ renderPage }) => {
	const [openModal, setOpenModal] = useState(false)
	const [openConfirmModal, setopenConfirmModal] = useState(false)
	const [errorModal, setErrorModal] = useState(false)
	const [search, setSearch] = useState("")

	const { facebookProfileData, setFacebookProfileData, setInputId, setCurrentPage, setActiveMediaBuyer, setActiveProfile } = useContext(CreateFacebookContext)

	const filterMediaBuyer = (e) => {
		setActiveMediaBuyer(e.target.value)
		setCurrentPage(1)
	}

	const filterActiveProfiles = (e) => {
		setActiveProfile(e.target.value)
		setCurrentPage(1)
	}

	const toggleModal = () => {
		setOpenModal(!openModal)
	}

	const deleteProfiles = async () => {
        let ids = []
        const selectedProfiles = facebookProfileData.data.filter(item => item.selected === true)
        selectedProfiles.map(profile => ids.push(profile.profile_id))

		const response = await fetch("/api/facebook/delete-profiles", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ids})
		})

		const result = await response.json()

		if(result.success) {
			setFacebookProfileData({...facebookProfileData, data: result.data, size: result.size, tableSize: result.tableSize})
		}

		setopenConfirmModal(false)
    }

	const emptySearch = () => {
		setSearch("")
		setInputId("")
	}

	const searchProfileId = () => {
		setCurrentPage(1)
		setInputId(search)
	}

	const confirmDelete = () => {
		const selectedProfiles = facebookProfileData.data.filter(item => item.selected === true)
		if (selectedProfiles.length === 0) {
			setErrorModal(true)
		} else {
			setopenConfirmModal(true)
		}
	}

	return (
		<div className='flex flex-col mx-[4.5rem] pt-3 min-h-[80vh]'>
			<h3 className='my-2 text-2xl font-bold text-gray-700'>
				{/* Fixed Linting Issue Here causing not able to build Project */}
				{/* User's Profile for {profile_name} */}
				{`User's Profile for ${facebookProfileData.profile_name}`}
			</h3>

			<div className='flex gap-3 mt-2 flex-wrap justify-center'>
				<div className='border-2 py-5 px-5 maxw-[12%] rounded-md flex flex-col justify-center items-center'>
					<Button  
						title="Create Profiles"
						profile_name={facebookProfileData.profile_name}
						src='/icons/add-user.png'
						width='18'
						height='18'
						color="bg-[#86C8BC]"
						method={toggleModal}
					/>

					<Button  
						title="Delete Profiles"
						profile_name={facebookProfileData.profile_name}
						src='/icons/trash.png'
						width='18'
						height='18'
						color="bg-[#FF9F9F]"
						method={confirmDelete}
					/>
				</div>
				

				<div className='flex flex-col justify-center border-2 py-3 px-5 rounded-md'>
					<h4 className='font-[500] text-left text-gray-400'>
						Total Profiles
					</h4>
					<div className='flex justify-center items-center'>
						<p className='text-[2.5rem] font-[600] text-[#2da85f]'>{facebookProfileData.size}</p>
					</div>
					<div className='font-bold w-[100%] text-[0.7rem]'>
						<p className="text-gray-600">Last profile created : </p>
						<p className="text-[#823df2]">{facebookProfileData.latest ? <>{facebookProfileData.latest[0]?.created_at.toString().substring(0, 10)}</> : <>null</>}</p>
					</div>
				</div>
	

				<div className='flex flex-col justify-center items-center border-2 py-3 px-5 rounded-md'>
					<h4 className='font-[500] text-left text-gray-400'>
						Total Inactive
					</h4>
					<div className='flex justify-center items-center'>
						<p className='text-[2.5rem] font-[600] text-red-500'>{facebookProfileData.inactive && facebookProfileData.inactive.length}</p>
					</div>
					<div className='font-bold w-[100%] text-[0.7rem]'>
						<p className="text-gray-600">% of inactive profile : </p>
						<p className="text-[#823df2]">{facebookProfileData.inactive && (facebookProfileData.inactive.length / facebookProfileData.size * 100).toFixed(2)}%</p>
					</div>
				</div>

				<div className='flex justify-end py-5 px-5 rounded-md w-[100%] lg:flex-1 items-end gap-2'>
					<div className="border-2 rounded-sm">
						<select onClick={filterActiveProfiles} defaultValue="default" className="p-2  w-[250px]">
							<option value="default">-- All Profiles --</option>
							<option value="active">Active Profiles</option>
							<option value="inactive">Inactive Profiles</option>
						</select>
					</div>
					<div className="border-2 rounded-sm">
						<select onClick={filterMediaBuyer} defaultValue="default" className="p-2  w-[250px]">
							<option value="default">-- All Media Buyer --</option>
							{facebookProfileData.media_buyer?.map(mb => 
								<option key={mb} value={mb}>{mb}</option>	
							)}
						</select>
					</div>
					<div className="flex border-2 w-[250px] rounded-sm">
						<input 
							className="text-[0.8rem] p-2 focus:outline-none w-[100%]"
							placeholder='Search by ID...' 
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
			</div>

			<Table />

			{/* Modals */}
			{errorModal &&
				<Error 
					message="No profiles was selected"
					closeModal={() => setErrorModal(false)}
				/>
			}

			{openConfirmModal &&
				<Confirm 
					executeFunction={deleteProfiles}
					closeModal={() => setopenConfirmModal(false)}
				/>
			}

			{openModal && 
				<CreateProfileModal 
					openModal={openModal} 
					setOpenModal={setOpenModal} 
					renderPage={renderPage}
				/>
			}
		</div>
	);
};

export default Profile;
