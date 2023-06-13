import { useState } from 'react'
import Pagination from '@/components/generic/pagination/Pagination'

let PageSize = 10

const CampaignTable = ({
    data,
    header
}) => {
    // Local State
    const [currentPage, setCurrentPage] = useState(1)

    const lastPage = Math.ceil((data.length / PageSize))
  return (
    <div>
        <div className="m-3">
            <Pagination 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                lastPage={lastPage}
            />
        </div>
        <div className="mx-5">
            <header className="flex w-[100%] text-gray-700 bg-[#ECF2FF] text-[0.8rem]">
                {header.map((title, i) => 
                    <div className="text-center p-2 font-[500] border-[1px] flex-1" key={i}>{title}</div>
                )}
            </header>
            {
                data.sort((a,b) => {
                    if(a.spent > b.spent) return -3
                    if(a.status < b.status) return -2
                    return 0
                }).slice((currentPage - 1)*PageSize, currentPage*PageSize).map((camp, i) => 
                    <section className="flex w-[100%] text-[0.75rem]" key={i}>
                        <div className="p-2 border-[1px] flex-1">{camp.name} {`(${camp.campaign_id})`}</div>
                        <div className="text-center p-2 border-[1px] flex-1">{camp.status}</div>
                        <div className="text-center p-2 border-[1px] flex-1">$ {camp.spent.toFixed(2)}</div>
                    </section>
                )
            }
        </div>
        <div className="m-3">
            <Pagination 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                lastPage={lastPage}
            />
        </div>
    </div>
  )
}

export default CampaignTable