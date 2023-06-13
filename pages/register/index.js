import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

const roles = ["admin", "facebook", "tiktok", "telegram", "google_seo", "google_sem"]

export default function Register() {
    const [show, setShow] = useState({ password: false, cpassword: false })
    const [addRole, setAddRole] = useState([])
    const [error, setError] = useState({})

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            cpassword: '',
        },
        // validate: registerValidate,
        onSubmit
    })

    function registerValidate(values) {
        const errors = {}
    
        if (!values.email) {
            errors.email = 'Email Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
    
        // validation for password
        if(!values.password){
            errors.password = "Password Required";
        } else if(values.password.length < 8 || values.password.length > 20){
            errors.password = "Must be greater then 8 and less then 20 characters long";
        } else if(values.password.includes(" ")){
            errors.password = "Invalid Password";
        }
    
        // validate confirm password
        if(!values.cpassword){
            errors.cpassword = "Confirm Password Required";
        } else if(values.password !== values.cpassword){
            errors.cpassword = "Password Not Match...!"
        } else if(values.cpassword.includes(" ")){
            errors.cpassword = "Invalid Confirm Password"
        }

        if(!addRole.length) {
            errors.role = "Role Required"
        }
    
        return errors;
    }

    async function onSubmit(values){
        const errors = registerValidate(values)

        if(Object.keys(errors).length) {
            return setError(errors)
        }

        const form_data = {...values, role: addRole}

        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form_data)
        }

        const response = await fetch(`/api/auth/signup`, options)
        const data = await response.json()

        if(data) router.push("/")
    }

    const handleAddRole = (value) => {
        if(!addRole.includes(value)) {
            setAddRole([...addRole, value])
        }
    }

    function removeRole(index){
        setAddRole(addRole.filter((el, i) => i !== index))
    }

    return (
        <>
            <Head>
                <title>Create Account</title>
            </Head>

            <section className='w-1/2 mx-auto flex flex-col justify-center gap-10 min-h-[80vh] my-5'>
                <div className="title">
                    <h1 className='text-gray-800 text-4xl font-bold pt-4'>Create an User Account</h1>
                </div>

                {
                    <div className="text-red-500 font-bold">
                        <ul>
                            <li>{error.email}</li>
                            <li>{error.password}</li>
                            <li>{error.cpassword}</li>
                            <li>{error.role}</li>
                        </ul>
                    </div>
                }
                
                 {/* form */}
                <form autocomplete="off" className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                    <div className="flex border rounded-xl">
                        <input 
                            type="email"
                            name='email'
                            placeholder='Email'
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                            autocomplete="false"
                            {...formik.getFieldProps('email')}
                        />
                        <span className='icon flex items-center px-4'>
                            -
                        </span>
                    </div>
                    {formik.errors.email && formik.touched.email ? <span className='text-rose-500'>{formik.errors.email}</span> : <></>}
                    
                    <div className="flex border rounded-xl">
                        <input 
                            type={`${show.password ? "text" : "password"}`}
                            name='password'
                            placeholder='password'
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                            autocomplete="false"
                            {...formik.getFieldProps('password')}
                        />
                        <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password})}>
                            -
                        </span>
                    </div>
                    {formik.errors.password && formik.touched.password ? <span className='text-rose-500'>{formik.errors.password}</span> : <></>}

                    <div className="flex border rounded-xl">
                        <input 
                            type={`${show.cpassword ? "text" : "password"}`}
                            name='cpassword'
                            placeholder='Confirm Password'
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                            autocomplete="false"
                            {...formik.getFieldProps('cpassword')}
                        />
                        <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, cpassword: !show.cpassword})}>
                            -
                        </span>
                    </div>
                    {formik.errors.cpassword && formik.touched.cpassword ? <span className='text-rose-500'>{formik.errors.cpassword}</span> : <></>}

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                        <p>Select Roles:</p>
                        {roles.map((item, i) => 
                            <span 
                                className={`p-2 bg-red-200 rounded-md mx-2 hover:cursor-pointer ${addRole.includes(item) && "hidden"}`} key={i}
                                onClick={() => handleAddRole(item)}
                            >
                                {item}
                            </span>
                        )}
                        </div>
                        <div 
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                        >
                            <div className="flex gap-2">
                                {addRole.map((item, i) => 
                                    <div className="bg-gray-200 px-2 rounded-md flex gap-1" key={i}>{/* One hardcoded tag for test */}
                                        <span className="text">{item}</span>
                                        <span className="close hover:cursor-pointer" onClick={() => removeRole(i)}>x</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-blue-700 hover:border">
                            Create User
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export async function getServerSideProps({ req }){
	const session = await getSession({ req })

	if(!session.user.role.includes("admin")){
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