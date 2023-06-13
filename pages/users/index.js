import { useState, useEffect } from "react"
import { getSession } from "next-auth/react"
import axios from "axios"

const Users = () => {
    const [allUser, setAllUser] = useState()
    
    const getUser = async () => {
        const response = await axios(`/api/users/get-users`)
        setAllUser(response.data.users)
    }

    useEffect(() => {
        getUser()
    }, [])
    

    return (
        <div className="min-h-[80vh] flex-col flex">
            <h1 className="lg-w-1/2 mx-auto text-xl font-[500] text-gray-800 my-5">Users Management</h1>
            <header className="w-1/2 mx-auto flex">
                <div className="flex w-[33%] bg-emerald-100 border-[2px] border-emerald-400 p-2 justify-center text-gray-800 font-[500]">Email</div>
                <div className="flex w-[33%] bg-emerald-100 border-y-[2px] border-emerald-400 p-2 justify-center text-gray-800 font-[500]">Role</div>
                <div className="flex w-[33%] bg-emerald-100 border-[2px] border-emerald-400 p-2 justify-center text-gray-800 font-[500]">Setting</div>
            </header>

            {allUser?.map((account, index) => 
                <section key={index} className="w-1/2 mx-auto flex">
                    <div className="w-[33%] flex border-x-[2px] border-b-[2px] border-emerald-400 p-2 justify-center text-gray-800">
                        {account.email}
                    </div>
                    <div className="w-[33%] flex border-b-[2px] border-emerald-400 p-2 justify-center text-gray-800">
                        {account.role.map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <div className="w-[33%] flex border-x-[2px] border-b-[2px] border-emerald-400 p-2 justify-center text-gray-800">
                        <button className="bg-red-400 text-white px-2 rounded-sm hover:bg-white hover:text-red-800 border-[1px] hover:border-red-800">delete</button>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Users

export async function getServerSideProps({ req }){
	const session = await getSession({ req })

	if(!session?.user.role.includes("admin")){
		return {
		redirect : {
			destination: '/',
			permanent: false
		}
		}
	}

	return {
		props: { session }
	}
}