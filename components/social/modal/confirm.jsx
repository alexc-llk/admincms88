import Image from "next/image"
import ButtonCMS from "../../generic/button/button_cms"

const Confirm = ({ closeModal, executeFunction }) => {

    return (
        <div className="fixed w-[100%] h-screen flex justify-center items-center top-0 left-0">
            <div 
                className="fixed w-[100%] h-screen bg-black opacity-50" 
                onClick={closeModal}
            />
            <div className="w-[50%] h-[50%] bg-white rounded-lg z-20 flex flex-col justify-center items-center gap-5">
                <Image 
                    className="w-[150px]"
                    src="/icons/thinking.jpg"
                    height={200}
                    width={200}
                    alt="confirm delete"
                />
                <p>{`You're deleting this domain. Are you sure?`}</p>
                <div className="flex gap-5">
                    <ButtonCMS 
                        title="Yes"
                        clickFunc={executeFunction}
                    />
                    <ButtonCMS 
                        title="No"
                        clickFunc={closeModal}
                    />
                </div>
            </div>
        </div>
  )
}

export default Confirm