import { getSession, useSession } from 'next-auth/react'
import Link from "next/link";
import Image from "next/image";

export default function Home() {
	const { data: session } = useSession()
	// const windowHeight = (window.innerHeight).toString() + "px"

	if(!session) return <Guest />

	return <>
		<div className={`flex justify-center items-center min-h-[80vh]`}>
			<Image 
					className="w-[30%]"
					src="/images/welcome.jpg"
					height={300}
					width={500}
			/>
		</div>
	</>;
}

// Guest
function Guest() {
	return (
		<main className="container mx-auto text-center py-20">
		<h3 className='text-4xl font-bold'>Guest HomePage</h3>

		<div className='flex justify-center'>
			<Link href={'/login'} className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50'>Sign In</Link>
		</div>
		</main>
	)
}

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
