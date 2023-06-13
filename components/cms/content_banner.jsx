import { useState } from "react"
import EditSite from "./modal/editSite"
import Image from "next/image"

const ContentBanner = (props) => {
  const { siteContent, setSiteContent } = props

  // Component State
  const [openEditModal, setOpenEditModal] = useState(false)

  return (
    <div
      className="bg-cover "
    >
      <div className="relative w-[100%] flex justify-between items-center h-[220px]">
        <div className="absolute top-0 left-0 -z-20">
          <Image 
            className="h-[220px] object-cover"
            src="/images/banner_winter.jpg" 
            height={900}
            width={1800}
            alt="content banner"
          />
        </div>
        <div className="absolute w-[100%] top-0 left-0 bg-sky-200 opacity-75 h-[220px] -z-10" />

        <div className="lg:mx-[10%] rounded-lg relative">
          <div className="text-sky-900 font-[500] lg:text-[1.2rem]">
            <div className="flex gap-7">
              <h1 className="w-20">Hostname</h1>
              <h1>:</h1>
              <h1>{siteContent.hostname}</h1>
            </div>

            <div className="flex gap-7">
              <p className="w-20">Title</p>
              <p>:</p>
              <p className="flex gap-3 items-center">
                {siteContent.title}
              </p>
            </div>
            
            <div className="flex gap-7">
              <p className="w-20">Description</p> 
              <p>:</p>
              <p>{siteContent.description}</p>
            </div>

            <div className="flex gap-7">
              <p className="w-20">Keywords</p> 
              <p>:</p>
              <p>{siteContent.keywords}</p>
            </div>
          </div>
        </div>

        <Image 
          className="z-20 w-7 h-7 self-start opacity-60 hover:opacity-100 hover:cursor-pointer my-3 mx-5"
          src="/icons/edit2.png"
          width={100}
          height={100}
          onClick={() => setOpenEditModal(true)}
          alt="edit content"
        />
      </div>
      
      

      

      {openEditModal && 
        <EditSite 
          setOpenEditModal={setOpenEditModal}
          siteContent={siteContent}
          setSiteContent={setSiteContent}
        />
      }
    </div>
  )
}

export default ContentBanner