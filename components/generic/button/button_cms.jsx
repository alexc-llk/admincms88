
const ButtonCMS = ({ clickFunc, title }) => {
  return (
    <>
        <button
            className="bg-[#2A2F33] text-white hover:border-[#2A2F33] hover:border-[3px] w-[100px] h-[30px] rounded-[3px] text-[0.8rem] font-[700] shadow-lg hover:bg-white hover:text-[#2A2F33] duration-300" 
            onClick={clickFunc}
        >
            {title}
        </button>
    </>
  )
}

export default ButtonCMS