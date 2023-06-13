import { useState, useContext, useEffect } from "react"
import { CreateCMSContext } from "@/context/cms/cms-context"
import { getSession } from "next-auth/react"

// import components
import Table from "@/components/cms/table"
import AddSite from "@/components/cms/modal/addsite"
import Summary from "@/components/cms/summary"

const ContentManager = () => {
  const { setContentSite, currentPage, findContent } = useContext(CreateCMSContext)

  const [showModalSite, setshowModalSite] = useState(false)

  const renderPage = async () => {
    const response = await fetch(`/api/google-seo/get-contents?page=${currentPage}&hostname=${findContent.hostname}&path=${findContent.path}`)
    const result = await response.json()

		// console.log(result.data, "QUERY STATE DATA")
    setContentSite({ contents: result.data, size: result.size, tableSize: result.tableSize });
  }

  // Function to toggle add site modal
  const toggleModalSite = () => {
    setshowModalSite(!showModalSite)
  }

  useEffect(() => {
    renderPage()
  }, [currentPage, findContent])
  

  return (
    <div className='flex flex-col mx-[4.5rem] pt-3 min-h-[80vh]'>
        {
          showModalSite && <AddSite setshowModalSite={setshowModalSite} />
        }
        <h3 className='my-2 text-2xl font-bold text-gray-700'>
          {/* Fixed Linting Issue Here causing not able to build Project */}
          {/* User's Profile for {profile_name} */}
          {`Content Management System for Google SEO`}
        </h3>

        <Summary 
          toggleModalSite={toggleModalSite}
        />

        <div className="px-10 flex flex-col justify-start gap-5 rounded-md">
          <Table />
        </div>
        {
          showModalSite && <AddSite setshowModalSite={setshowModalSite} />
        }
    </div>
  )
}

export default ContentManager

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