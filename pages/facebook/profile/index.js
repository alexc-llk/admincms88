import { useContext, useEffect } from "react";
import { getSession } from 'next-auth/react'

// Component
import Profile from "@/components/social/profile";

// Context
import { CreateFacebookContext } from "@/context/facebook/facebook-context";

// Helpers
// import { getProfiles } from "@/helpers/api-utils/facebook/get-profiles";

const Facebook = () => {
	// const { data: session } = useSession()

	const { setFacebookProfileData, currentPage, inputId, sortKey, sortOrder, activeMediaBuyer, activeProfile } = useContext(
		CreateFacebookContext
	);

	const renderPage = async () => {
		const response = await fetch(`/api/facebook/get-profile?page=${currentPage}&search=${inputId}&active_mb=${activeMediaBuyer}&access_token=${activeProfile}`)
		const result = await response.json()
		// console.log(result, "QUERY STATE DATA")
		setFacebookProfileData({ profile_name: "facebook", data: result.data, size: result.size, latest: result.latest, inactive: result.inactive, tableSize: result.tableSize, media_buyer: result.media_buyer });
	}

	// const profiles = JSON.parse(props.profiles);

	useEffect(() => {
		// Suggestion to check if Valid Array before parsing ? otherwise we can default to Skip execution ?
		renderPage()
		// eslint-disable-next-line
	}, [currentPage, inputId, sortKey, sortOrder, activeMediaBuyer, activeProfile]);

	// if(!session) return <div>Login First</div>

	return (
		
		<Profile 
			renderPage={renderPage}
		/>
	
	);
};

export default Facebook;

// export async function getServerSideProps(context) {
// 	const { query } = context
	
// 	const response = await fetch("/api/facebook/get-profile");
// 	const data = await response.json();
// 	const profiles = await getProfiles(query.page);
// 	return { props: { profiles: JSON.stringify(profiles) } };
// }

export async function getServerSideProps({ req }){
	const session = await getSession({ req })

	if(!session){
		return {
		redirect : {
			destination: '/login',
			permanent: false
		}
		}
	}

	return {
		props: { session }
	}
}
