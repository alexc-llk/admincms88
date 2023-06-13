import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { CreateTelegramContext } from "@/context/telegram/telegram-context"
import { getSession } from "next-auth/react"

const Id = () => {
  // Global State
  const { singleTelegram, setSingleTelegram } = useContext(CreateTelegramContext)

  const router = useRouter()
  const { id } = router.query

  const uploadImage = (e) => {
    const { files } = e.target
    console.log(files[0])
  }

  // Obtain from mongo database
  useEffect(() => {
    if(!id) {
      return
    }

    const renderPage = async () => {
      try {
          const response = await fetch(`/api/telegram/get-content-by-id/${id}`)
          const result = await response.json()
          setSingleTelegram(result.data[0])
      } catch (error) {
          console.log(error)
      }
    }

    renderPage()
  }, [id])
  

  return (
    <div className="px-[5%] py-5 min-h-[80vh]">
      <h1>Broadcast Content</h1>
      {JSON.stringify(singleTelegram)}
      <div className="flex gap-5">
        <h3>Group ID</h3>
        <p>:</p>
        <p>{singleTelegram.group_id}</p>
      </div>
    
      <div className="flex gap-5">
        <h3>key</h3>
        <p>:</p>
        <p>{singleTelegram.key}</p>
      </div>

      <div className="">
        <h3 className="font-[500] text-[1.3rem]">Broadcasts</h3>
        
          {singleTelegram.data?.map((item, i) =>
            <div className="my-3 p-5 bg-indigo-300 rounded-md" key={i}>
              <h3>Banner: <br /> {item.broadcast_banner ? item.broadcast_banner : item.broadcast_video}</h3>
              <p>Message: <br /> {item.broadcast_message}</p>
            </div>
          )}
      </div>

      <div className="my-5">
        <div className="border-dotted border-slate-500 border-2 w-[300px] h-[90px] p-3">
          <label className="bg-sky-100 h-[100%] hover:cursor-pointer flex justify-center items-center" htmlFor="image">
            Choose an image
          </label>
        </div>
        
        <input className="hidden" type="file" onChange={uploadImage} id="image" />
      </div>
    </div>
  )
}

export default Id

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