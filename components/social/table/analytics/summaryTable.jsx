import Pagination from "@/components/generic/pagination/Pagination"
import { useState, useEffect, useCallback } from "react"

const pageSize = 10

function sortData({ tableData, sortKey, reverse }) {
    if(!sortKey) return tableData

    const sortedData = tableData.sort((a, b) => {
        return (Number(a[sortKey]) || 0) - Number((b[sortKey]) || 0);
    });

    if (reverse) {
        return sortedData.reverse()
    }

    return sortedData
}

function SortButton({
    sortOrder,
    columnKey,
    sortKey,
    onClick,
  }) {
    return (
      <button
        onClick={onClick}
        className={`${
          sortKey === columnKey && sortOrder === "desc"
            ? "rotate-180 duration-200 text-violet-500 mb-[2px] text-[10px]"
            : "duration-200 text-violet-500 text-[10px]"
        }`}
      >
        ▲
      </button>
    );
}

const SummaryTable = ({
    analytics,
    type,
    timeRange
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [mediaTable, setMediaTable] = useState(analytics.mb_based)
    const [angleTable, setAngleTable] = useState(analytics.angle_based)
    const [sortOrder, setSortOrder] = useState("ascn")
    const [sortKey, setSortKey] = useState("spending")

    let sortedData

    sortedData = useCallback(() => sortData({ tableData: type === "Media Buyer" ? mediaTable : type === "Code" && angleTable, sortKey, reverse: sortOrder === "desc" }), [type === "Media Buyer" ? mediaTable : type === "Code" && angleTable, sortKey, sortOrder])

    function changeSort(key) {
        setSortOrder(sortOrder === "ascn" ? "desc" : "ascn")
        setSortKey(key)
    }

    const updateTable = () => {
        const newMediaBuyer = analytics.mb_based
        const newAngle = analytics.angle_based
        setMediaTable(newMediaBuyer)
        setAngleTable(newAngle)
    }

    useEffect(() => {
      updateTable()
    }, [timeRange, analytics])
    

    useEffect(() => {
        setCurrentPage(1)
        console.log(analytics, "check analytics summaryTable")
        if(type === "Code") {
            setLastPage(Math.ceil(analytics.angle_based.length / pageSize))
        } else if (type === "Geo") {
            setLastPage(Math.ceil(analytics.geo_based.length / pageSize))
        } else if (type === "Brand") {
            setLastPage(Math.ceil(analytics.brand_based.length / pageSize))
        } else if (type === "Media Buyer") {
            setLastPage(Math.ceil(analytics.mb_based.length / pageSize))
        } 
    }, [type])
     

    return (
        <div className="mx-5 my-3 h-screen">
            <div className="my-3">
                <Pagination 
                    lastPage={lastPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {analytics ? 
                <>
                    
                    {type === "Code" && 
                        <>
                            <header  className="flex w-[100%] text-gray-700 bg-[#ECF2FF] text-[0.8rem]">
                                <div className="text-center p-2 font-[500] border-[1px] flex-1">{type}</div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">Total Spending</span>
                                    <SortButton 
                                        columnKey={"total_angle_spending"}
                                        onClick={() => changeSort("total_angle_spending")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">Lead</span>
                                    <SortButton 
                                        columnKey={"total_angle_lead"}
                                        onClick={() => changeSort("total_angle_lead")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">CPL</span>
                                    <SortButton 
                                        columnKey={"angle_cpl"}
                                        onClick={() => changeSort("angle_cpl")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                            </header> 
                            {sortedData().slice((currentPage - 1)*pageSize, currentPage*pageSize).map((row, index) => 
                                <section className="flex w-[100%] text-[0.75rem]" key={index}>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.angle}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">$ {Number(row.total_angle_spending) ? Number(row.total_angle_spending).toFixed(2) : "0.00"}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.total_angle_lead}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.angle_cpl}</div>
                                </section>    
                            )}
                        </>
                    }
                    {type === "Media Buyer" && 
                        <>
                            <header  className="flex w-[100%] text-gray-700 bg-[#ECF2FF] text-[0.8rem]">
                                <div className="text-center p-2 font-[500] border-[1px] flex-1">{type}</div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">Total Spending</span>
                                    <SortButton 
                                        columnKey={"total_mb_spending"}
                                        onClick={() => changeSort("total_mb_spending")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">Lead</span>
                                    <SortButton 
                                        columnKey={"total_mb_lead"}
                                        onClick={() => changeSort("total_mb_lead")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                                <div className="text-center p-2 font-[500] border-[1px] flex-1 flex justify-center gap-2">
                                    <span className="block">CPL</span>
                                    <SortButton 
                                        columnKey={"mb_cpl"}
                                        onClick={() => changeSort("mb_cpl")}
                                        {...{sortOrder, sortKey}}
                                    />
                                </div>
                            </header> 
                            {sortedData().slice((currentPage - 1)*pageSize, currentPage*pageSize).map((row, index) => 
                                <section className="flex w-[100%] text-[0.75rem]" key={index}>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.mb}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">$ {Number(row.total_mb_spending).toFixed(2)}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.total_mb_lead}</div>
                                    <div className="p-2 border-[1px] h-[50px] flex-1 flex flex-col justify-center">{row.mb_cpl}</div>
                                </section>    
                            )}
                        </>
                    }
                </>
                :
                <div>
                    Loading Table...
                </div>
            }
            <div className="my-3">
                <Pagination 
                    lastPage={lastPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    )
}

export default SummaryTable