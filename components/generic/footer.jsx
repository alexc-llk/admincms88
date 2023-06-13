import Link from "next/link"

const Footer = () => {
    const today = new Date().getFullYear()

    return (
        <div>
            <hr className="bg-blue-100" />
            <div className="bg-gray-200 flex justify-center p-3 h-[9vh]">
                <section className="flex flex-col">
                    <div className="flex justify-center gap-2">
                        <Link href="/terms-and-conditions" className="text-blue-400 hover:text-blue-700">{`Terms & Conditions`}</Link> and
                        <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-700">Privacy Policy</Link>
                    </div>
                    <div className="flex justify-center">© {today} AdminCMS88 | All Rights Reserved</div>
                </section>
            </div>
        </div>
    )
}

export default Footer