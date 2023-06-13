import ButtonCMS from "../../generic/button/button_cms"

const Error = ({ closeModal, message }) => {

    return (
        <div className="fixed w-[100%] h-screen flex justify-center items-center top-0 left-0">
            <div 
                className="fixed w-[100%] h-screen bg-black opacity-50" 
                onClick={closeModal}
            />
            <div className="w-[50%] h-[50%] bg-white rounded-lg z-20 flex flex-col justify-center items-center gap-5">
                <p>{message}</p>
                <div className="flex gap-5">
                    <ButtonCMS 
                        title="Ok"
                        clickFunc={closeModal}
                    />
                </div>
            </div>
        </div>
  )
}

export default Error