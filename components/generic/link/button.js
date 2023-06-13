import Image from "next/image"
import Link from "next/link"

const LinkButton = (props) => {
  return (
    <Link className={`flex rounded-md items-center p-2 ${props.color} hover:bg-[#e8b2f7] w-[8rem] text-[0.8rem] justify-center`} href="#">
        {props.title}
        <Image
            className='object-contain ml-2'
            src={props.src}
            width={props.width}
            height={props.height}
            alt='down-arrow'
        />
    </Link>
  )
}

export default LinkButton