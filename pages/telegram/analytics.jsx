import { getSession } from "next-auth/react"

const Analytics = () => {
  return (
    <div className="min-h-[80vh]">Analytics</div>
  )
}

export default Analytics

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