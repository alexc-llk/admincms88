import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"

const Navbar = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const [facebook, setFacebook] = useState(false)
    const [tiktok, setTiktok] = useState(false)
    const [telegram, setTelegram] = useState(false)
    const [settings, setSettings] = useState(false)

    const handleSignOut = () => {
        signOut()
    }

    const toggleSettings = () => {
        setSettings(!settings)
    }

    const handleCreateUser = () => {
        setSettings(false)
        router.push("/register")
    }

    return (
        <nav className="flex p-2 justify-between items-center flex-wrap bg-white drop-shadow-lg z-50 h-[11vh]">
            <div className="text-3xl ml-20 text-gray-900">
                <Link href="/">
                    <Image className="object-contain" src="/icons/home.png" width="32" height="32" alt="logo" />
                </Link>
            </div>

            <div className="flex flex-wrap">
                {session ? 
                    <ul className="flex items-center text-gray-600 font-[500] mr-20">
                        <li className="p-3 hover:text-gray-400"><Link href="/">Home</Link></li>
                        <li 
                            className="p-3 hover:cursor-pointer relative"
                            onMouseEnter={() => setFacebook(true)}
                            onMouseLeave={() => setFacebook(false)}
                        >
                            <span>Facebook</span>
                            {facebook && 
                                <div className="absolute bg-white flex flex-col top-12 left-0">
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/facebook/profile">Profile</Link>
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/facebook/analytics">Analytics</Link>
                                </div>
                            }
                        </li>
                        
                        <li
                            className="p-3 hover:cursor-pointer relative"
                            onMouseEnter={() => setTiktok(true)}
                            onMouseLeave={() => setTiktok(false)}
                        >
                            <span>Tiktok</span>
                            {tiktok && 
                                <div className="absolute bg-white flex flex-col top-12 left-0">
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/tiktok/profile">Profile</Link>
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/tiktok/analytics">Analytics</Link>
                                </div>
                            }
                        </li>

                        <li className="p-3 hover:cursor-pointer">
                            <Link href="/google-seo">Google SEO</Link>
                        </li>

                        <li className="p-3 hover:cursor-pointer">
                            <Link href="/google-sem">Google SEM</Link>
                        </li>

                        <li
                            className="p-3 hover:cursor-pointer relative"
                            onMouseEnter={() => setTelegram(true)}
                            onMouseLeave={() => setTelegram(false)}
                        >
                            <span>Telegram</span>
                            {telegram && 
                                <div className="absolute bg-white flex flex-col top-12 left-0">
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/telegram">Profile</Link>
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/telegram/analytics">Analytics</Link>
                                </div>
                            }
                        </li>
                        {session.user.role.includes("admin") &&  
                            <li className="p-3 hover:cursor-pointer">
                                <Link href="/users">Users</Link>
                            </li>
                        }
                        

                        <li className="p-3 hover:cursor-pointer">
                            <div className="relative">
                                <button onClick={toggleSettings} className="bg-gray-200 rounded-lg flex justify-center p-2 hover:bg-blue-200 mr-10">
                                    <Image 
                                        className="w-[25px]"
                                        src="/images/settings.png"
                                        height={20}
                                        width={20}
                                        alt="settings"
                                    />
                                </button>
                            
                                {settings &&
                                    <div className={`justify-center rounded-md absolute right-7 top-11 bg-blue-200`}>
                                        {session.user.role.includes("admin") && 
                                            <button onClick={handleCreateUser} className='w-[160px] py-2 border-t-[1px] border-gray-100 font-[500] text-gray-700 hover:bg-blue-300 flex justify-center gap-2'>
                                                <div className="flex items-center gap-4 w-[80%]">
                                                    <Image 
                                                        className="w-[20px] h-[20px]"
                                                        src="/images/create.png"
                                                        height={25}
                                                        width={25}
                                                        alt="create"
                                                    />    
                                                    Create User
                                                </div>    
                                            </button>
                                        }
                                        
                                        
                                        <button onClick={handleSignOut} className='w-[160px] py-2 border-t-[1px] border-gray-100 font-[500] text-gray-700 hover:bg-blue-300 rounded-b-md flex justify-center gap-2'>
                                            <div className="flex items-center gap-4 w-[80%]">
                                                <Image 
                                                    className="w-[18px] h-[18px]"
                                                    src="/images/logout.png"
                                                    height={20}
                                                    width={20}
                                                    alt="logout"
                                                />
                                                Sign Out
                                            </div>
                                        </button>
                                    </div>
                                }
                            </div>
                        </li>
                       
                    </ul>
                : 
                <ul className="flex items-center text-gray-600 font-[500] mr-20">
                    <li
                            className="p-3 hover:cursor-pointer relative"
                            onMouseEnter={() => setTiktok(true)}
                            onMouseLeave={() => setTiktok(false)}
                        >
                            <span>Tiktok</span>
                            {tiktok && 
                                <div className="absolute bg-white flex flex-col top-12 left-0">
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/tiktok/profile">Profile</Link>
                                    <Link className="py-3 px-7 hover:bg-[#ECF2FF]" href="/tiktok/analytics">Analytics</Link>
                                </div>
                            }
                        </li>
                </ul>
                }
            </div>
        </nav>
    )
}

export default Navbar