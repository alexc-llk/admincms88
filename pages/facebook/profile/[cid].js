import { useContext, useEffect } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"
import { useRouter } from "next/router"
import Link from "next/link"
import DashboardProfile from "@/components/social/dashboard/profile"
import { getSession } from "next-auth/react"

const SingleProfile = () => {
    // Global State
    const { singleFbProfile, setSingleFbProfile, setAllReports } = useContext(CreateFacebookContext);

    const router = useRouter()
    const { cid } = router.query

    // Fetch data from mongo database
	useEffect(() => {
        if(!cid) {
          return
        }
    
        const renderPage = async () => {
            try {
                const response = await fetch(`/api/facebook/get-profile-by-id/${cid}`)
                const result = await response.json()
                setSingleFbProfile(result.data[0])
                // console.log(result, "RESULT")
                setAllReports({ campaigns: result.campaigns, adsets: result.adsets, ads: result.ads })
            } catch (error) {
                console.log(error)
            }
        }
    
        renderPage()
      }, [cid])

    return (
        <div className="flex flex-col m-5 min-h-[80vh]">
            <h1 className="font-[400] text-[0.75rem]"><Link className="text-[#457aed] hover:text-[#3158ad]" href="/facebook/profile?page=1">facebook</Link> | <span className="italic">{singleFbProfile.profile_id}</span></h1>
            {/* {JSON.stringify(singleFbProfile)} */}
            {/* Options need to be dynamic */}
            <DashboardProfile 
                profileId={singleFbProfile.profile_id} 
            />

            
        </div>
    )
}

export default SingleProfile

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