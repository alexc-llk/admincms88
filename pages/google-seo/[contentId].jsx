import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import ContentBanner from "@/components/cms/content_banner"
import ContentEditor from "@/components/cms/content_editor"
import { getSession } from "next-auth/react"

const DomainContent = () => {
    const router = useRouter()
    const { contentId } = router.query

    // Content State
    const [siteContent, setSiteContent] = useState()
    

    useEffect(() => {
      if(!contentId) {
        return
      }

      const renderPage = async () => {
        try {
            const response = await fetch(`/api/google-seo/get-content-by-id/${contentId}`)
            const result = await response.json()
            setSiteContent(result.data[0])
        } catch (error) {
            console.log(error)
        }
      }

      renderPage()
    }, [contentId])

    if(!siteContent) return <p className="text-[1.2rem] animate-bounce flex justify-center my-10 text-center font-[700]"><span className="w-[200px]">isLoading...</span></p>
    
    return (
        <div className="min-h-[80vh]">
            <ContentBanner 
              siteContent={siteContent}
              setSiteContent={setSiteContent}
            />

            <div>
              <ContentEditor />
            </div>
        </div>
    )
}

export default DomainContent

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