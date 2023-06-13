import Image from "next/image"

const Button = (props) => {

    return (
        <button
            onClick={props.method}
            className={`py-2 px-3 my-2 h-[40px] w-[160px] gap-3 flex justify-center items-center ${props.color} rounded-md flex hover:bg-white hover:border-[#333] hover:border-2 text-[0.9rem] transition duration-500`}
        >
            <Image
                className='object-contain'
                src={props.src}
                width={props.width}
                height={props.height}
                alt='add-user'
            />
            {props.title}
        </button>
    )
}

export default Button