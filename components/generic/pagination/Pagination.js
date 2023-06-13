import Image from "next/image"

const Pagination = ({ lastPage, currentPage, setCurrentPage }) => {

    return (
        <div className="flex justify-end">
            {
                currentPage !== 1 && 
                <div onClick={() => setCurrentPage(currentPage + -1)} className="hover:cursor-pointer">
                    <Image className="object-contain rotate-[-90deg] mt-[6px] mr-2" src="/icons/nav-arrow.png" width="12" height="12" alt="arrow" />
                </div> 
            }
            {
                Array.from({ length: lastPage }, (_, index) => index + 1).map((page, index) => 
                    {
                        if(page === currentPage) {
                            return <li 
                                        className="mx-1 w-6 h-6 rounded-full bg-[#ECF2FF] text-center align-middle text-sm list-none flex items-center justify-center"
                                        onClick={() => setCurrentPage(page)}
                                        key={index}
                                    >
                                        {page}
                                    </li>
                        } else if (page === currentPage + 1 || page === currentPage - 1 || page === 1 || page === lastPage) {
                            return <li 
                                        className="mx-1 w-6 h-6 rounded-full hover:bg-[#ECF2FF] hover:cursor-pointer text-center align-middle text-sm list-none flex items-center justify-center"
                                        onClick={() => setCurrentPage(page)}
                                        key={index}
                                    >{page}</li>
                        } else if ((page === currentPage + 2 && page !== lastPage) || (page === currentPage - 2 && page !== 1)) {
                            return <li className="list-none" key={index}>...</li>
                        }  else {
                            return <></>
                        }
                    }
                )
            }
            {
                currentPage !== lastPage &&
                <div onClick={() => setCurrentPage(currentPage + 1)} className="hover:cursor-pointer">
                    <Image className="object-contain rotate-[90deg] mt-[6px] ml-2" src="/icons/nav-arrow.png" width="12" height="12" alt="arrow" />
                </div>
            }
        </div>
    )
}

export default Pagination