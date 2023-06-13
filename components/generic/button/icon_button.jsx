import Image from "next/image"
import Link from "next/link"

const IconButton = ({ src, clickFunc, href }) => {
  return (
    <>
      {href ? 
          <Link
            href={href}
          >
            <Image 
                  className="w-4 opacity-50 hover:opacity-100 mx-2"
                  src={src}
                  height={100}
                  width={100}
                  alt={src}
            />
          </Link>
        :
          <button
              onClick={clickFunc}
          >
              <Image 
                  className="w-4 opacity-50 hover:opacity-100 mx-2"
                  src={src}
                  height={100}
                  width={100}
                  alt={src}
              />
          </button>
      }
    </>
  )
}

export default IconButton