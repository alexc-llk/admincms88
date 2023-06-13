import { useState, useEffect } from "react";
import Link from "next/link";

const Tiktok = () => {
  const [url, setUrl] = useState()

  const init = () => {
    const client_key = "aw47ylakfnsf39dq";
		const csrfState = Math.random().toString(36).substring(2);
		let url = "https://www.tiktok.com/auth/authorize/";

		url += `?client_key=${client_key}`;
		url += `&scope=user.info.basic,video.list`;
		url += "&response_type=code";
		url += `&redirect_uri=https://a1d2-115-133-62-77.ngrok-free.app`;
		url += "&state=" + csrfState;

		setUrl(url);
  }

  useEffect(() => {
    init()
  }, [])
  

  return (
    <>
      <div className="h-[80vh] flex justify-center items-center">
        <Link className="" href={`${url}`} legacyBehavior>
			<a className="bg-sky-500 p-3 rounded-md text-white font-[500] border-2 hover:bg-white hover:text-gray-700" target="_blank" rel="noopener noreferrer">
				Connect to Tiktok
			</a>
        </Link>
      </div>
    </>
  )
}

export default Tiktok

// export async function getServerSideProps({ req }){
// 	const session = await getSession({ req })

// 	if(!session){
// 		return {
// 		redirect : {
// 			destination: '/login',
// 			permanent: false
// 		}
// 		}
// 	}

// 	return {
// 		props: { session }
// 	}
// }