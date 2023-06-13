import Head from "next/head";
import { useState } from "react";
import { useFormik } from 'formik';
// import login_validate from "@/helper/validate";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
    const [show, setShow] = useState(false)
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        // validate: login_validate,
        onSubmit
    })

    async function onSubmit(values){
        const status = await signIn('credentials', {
            redirect: false, 
            email: values.email,
            password: values.password,
            callbackUrl: "/"
        })
        // console.log(status.url, "url status")
        if(status.ok) router.push(status.url)
    }

    // useEffect(() => {
    //   checkSession()
    // }, [])
    
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <section className='w-1/2 mx-auto flex flex-col justify-center gap-10 min-h-[80vh]'>
                <div className="title">
                    <h1 className='text-gray-800 text-4xl font-bold pb-4'>Login Page</h1>
                </div>

                {/* form */}
                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                    <div className="flex border rounded-xl">
                        <input 
                            type="email"
                            name='email'
                            placeholder='Email'
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                            {...formik.getFieldProps('email')}
                        />
                        <span className='icon flex items-center px-4'>
                            {`+`}
                        </span>
                    </div>
                    {formik.errors.email && formik.touched.email ? <span className='text-rose-500'>{formik.errors.email}</span> : <></>}

                    <div className="flex border rounded-xl">
                        <input 
                            type={`${show ? "text" : "password"}`}
                            name='password'
                            placeholder='password'
                            className="w-full py-4 px-6 border rounded-xl bg-slate-50"
                            {...formik.getFieldProps('password')}
                        />
                        <span className='icon flex items-center px-4' onClick={() => setShow(!show)}>
                            {`+`}
                        </span>
                    </div>
                    {formik.errors.password && formik.touched.password ? <span className='text-rose-500'>{formik.errors.password}</span> : <></>}

                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-blue-700 hover:border">
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}
