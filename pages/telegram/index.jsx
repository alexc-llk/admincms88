import { useState, useContext, useEffect } from "react"
import { CreateTelegramContext } from "@/context/telegram/telegram-context"
import Table from "@/components/message/table"
import Summary from "@/components/message/summary"
import { getSession } from "next-auth/react"

const Telegram = () => {
    const { setTelegramContent, findTelegram } = useContext(CreateTelegramContext)

    const [showModalSite, setshowModalSite] = useState(false)

    // Function to toggle add site modal
    const toggleModalSite = () => {
        setshowModalSite(!showModalSite)
    }

    const renderPage = async () => {
        const respone = await fetch(`/api/telegram/get-contents?group_id=${findTelegram}`)
        const result = await respone.json()
        setTelegramContent({ telegram: result.data, size: result.size })
    }

    useEffect(() => {
      renderPage()
    }, [])
    

    return (
        <div className='flex flex-col mx-[4.5rem] pt-3 min-h-[80vh]'>
            <Summary 
                toggleModalSite={toggleModalSite}
            />

            <div className="px-10 flex flex-col justify-start gap-5 rounded-md">
                <Table />
            </div>
        </div>
    )
}

export default Telegram

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