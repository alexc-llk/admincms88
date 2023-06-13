import { createContext, useState } from "react";

export const CreateFacebookContext = createContext();

const FacebookContext = (props) => {
	const [facebookProfileData, setFacebookProfileData] = useState({
		profile_name: "",
		data: [],
	});
	const [currentPage, setCurrentPage] = useState(1)
	const [inputId, setInputId] = useState("")
	const [singleFbProfile, setSingleFbProfile] = useState({bm_account: [], ad_account: []})
	const [allReports, setAllReports] = useState({campaigns: [], adsets: [], ads: []})
	const [allCampaigns, setAllCampaigns] = useState([])
	const [analyticsReport, setAnalyticsReport] = useState()
	const [selectedProfile, setSelectedProfile] = useState([])
	const [sortOrder, setSortOrder] = useState('ascn')
	const [sortKey, setSortKey] = useState('')
	const [activeMediaBuyer, setActiveMediaBuyer] = useState("default")
	const [activeProfile, setActiveProfile] = useState("default")

	return (
		<>
			<CreateFacebookContext.Provider
				value={{ 
					facebookProfileData, setFacebookProfileData, 
					currentPage, setCurrentPage, 
					inputId, setInputId,
					singleFbProfile, setSingleFbProfile,
					allReports, setAllReports,
					allCampaigns, setAllCampaigns,
					selectedProfile, setSelectedProfile,
					analyticsReport, setAnalyticsReport,
					sortOrder, setSortOrder,
					sortKey, setSortKey,
					activeMediaBuyer, setActiveMediaBuyer,
					activeProfile, setActiveProfile
				}}
			>
				{props.children}
			</CreateFacebookContext.Provider>
		</>
	);
};

export default FacebookContext;
