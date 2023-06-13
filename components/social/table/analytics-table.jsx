import { useState, useEffect, useCallback } from "react"
import Pagination from "@/components/generic/pagination/Pagination"
import ProfileTable from "@/components/analytics/tables/profile_table"

let PageSize = 10

function sortData({ tableData, sortKey, reverse }) {
    if(!sortKey) return [...tableData]

    const sortedData = [...tableData].sort((a, b) => {
        if (sortKey === "angle") {
            if (!a[sortKey]) a[sortKey] = [""]
            if (!b[sortKey]) b[sortKey] = [""]
            
            if (a[sortKey][0] < b[sortKey][0]) {
                return -1;
            }
            if (a[sortKey][0] > b[sortKey][0]) {
                return 1;
            }
            // return 0;
        } else if (sortKey === "total_spending" || sortKey === "total_lead" || sortKey === "cpl") {
            return (a[sortKey] || 0) - (b[sortKey] || 0);
        } else {
            if (!a[sortKey]) {
                a[sortKey] = ""
                // console.log(a[sortKey], b[sortKey])
            }
            return a[sortKey] > b[sortKey] ? 1 : -1;
        }
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

const AnalyticsTable = ({
    allCampaigns,
    timeRange
}) => {
    
    // Local State
    const [currentTablePage, setCurrentTablePage] = useState(1)
    const [tableProfiles, setTableProfiles] = useState(allCampaigns)
    const [sortKey, setSortKey] = useState("spending")
    const [sortOrder, setSortOrder] = useState("ascn")

    const sortedData = useCallback(() => sortData({ tableData: tableProfiles, sortKey, reverse: sortOrder === "desc" }), [tableProfiles, sortKey, sortOrder])

    function changeSort(key) {
        setSortOrder(sortOrder === "ascn" ? "desc" : "ascn")
        setSortKey(key)
    }
    
    const lastPage = Math.ceil((allCampaigns.length / PageSize))
    const formatTime = `${new Date().toISOString().slice(0, 10)}`

    const substractDay = (date, days) => {
        date.setDate(date.getDate() - days);
        return date;
    }

    const filterTable = () => {
        const filtered_campaigns = allCampaigns.map(campaign => ({
          ...campaign,
          total_spending: 0,
          total_lead: 0,
          cpl: 0,
          visits: 0,
          cv: 0
        }));
      
        filtered_campaigns.forEach((data, index) => {
          let campaign_spending = 0, conversion = 0, visits = 0, cv = 0
      
          if (timeRange === "today") {
            const formatDate = new Date(formatTime).toISOString().slice(0, 19);
            const report = data.reports.filter(data => data.date === formatDate);
      
            if (report.length) {
              campaign_spending += Number(report[0].spending);

              // console.log(report, "report")
      
              report[0].voluum?.forEach(conv => {
                // console.log(conv, "voluum")
                conversion += Number(conv.conversions);
                visits += Number(conv.uniqueVisits);
                cv += Number(conv.cv);
              });
      
              filtered_campaigns[index] = {
                ...filtered_campaigns[index],
                total_spending: campaign_spending,
                total_lead: conversion,
                total_visits: visits,
                total_cv: cv,
                cpl: conversion !== 0 ? Number(campaign_spending / conversion).toFixed(2) : 0
              };
            }
      
            if (campaign_spending === 0 && !data.angle) {
              filtered_campaigns.splice(index, 1);
            }
          } else if (timeRange === "yesterday") {
            const formatDate = substractDay(new Date(formatTime), 1).toISOString().slice(0, 19);
            const report = data.reports.filter(data => data.date === formatDate);
      
            if (report.length) {
              campaign_spending += report[0].spending;
              filtered_campaigns[index].total_spending = campaign_spending || 0;
      
              if (campaign_spending === 0 && !data.angle) {
                filtered_campaigns.splice(index, 1);
              }
      
              report[0].voluum.forEach(conv => {
                conversion += Number(conv.conversions);
                visits += Number(conv.uniqueVisits);
                cv += Number(conv.cv);
              });
      
              filtered_campaigns[index] = {
                ...filtered_campaigns[index],
                total_lead: conversion,
                total_visits: visits,
                total_cv: cv,
                cpl: conversion !== 0 ? Number(campaign_spending / conversion).toFixed(2) : 0
              };
            }
          } else if (timeRange === "3d") {
            let selected_date = [];
            Array.from({ length: 3 }).forEach((_, i) =>
              selected_date.push(substractDay(new Date(formatTime), i + 1).toISOString().slice(0, 19))
            );
            const report_3d = data.reports.filter(report => {
              const info = selected_date.map(date => report.date === date);
              return info.includes(true);
            });
      
            report_3d.forEach(data => {
              campaign_spending += data.spending;
      
              data.voluum.forEach(conv => {
                conversion += Number(conv.conversions);
                visits += Number(conv.uniqueVisits);
                cv += Number(conv.cv);
              });
      
              filtered_campaigns[index] = {
                ...filtered_campaigns[index],
                total_spending: campaign_spending,
                total_lead: conversion,
                total_visits: visits,
                total_cv: cv,
                cpl: conversion !== 0 ? Number(campaign_spending / conversion).toFixed(2) : 0
              };
            });
      
            if (campaign_spending === 0 && !data.angle) {
              filtered_campaigns.splice(index, 1);
            }
          } else if (timeRange === "7d") {
            let selected_date = [];
            Array.from({ length: 7 }).forEach((_, i) =>
              selected_date.push(substractDay(new Date(formatTime), i + 1).toISOString().slice(0, 19))
            );
            const report_7d = data.reports.filter(report => {
              const info = selected_date.map(date => report.date === date);
              return info.includes(true);
            });
      
            report_7d.forEach(data => {
              campaign_spending += data.spending;
      
              data.voluum.forEach(conv => {
                conversion += conv.conversions;
              });
      
              filtered_campaigns[index] = {
                ...filtered_campaigns[index],
                total_spending: campaign_spending,
                total_lead: conversion,
                cpl: conversion !== 0 ? Number(campaign_spending / conversion).toFixed(2) : 0
              };
            });
      
            if (campaign_spending === 0 && !data.angle) {
              filtered_campaigns.splice(index, 1);
            }
          }
        });
      
        setTableProfiles(filtered_campaigns);
    };
      

    useEffect(() => {
        setCurrentTablePage(1)
        filterTable()
    }, [allCampaigns, timeRange])
    

    return (
        <div>
            <div className="mx-5">
                <Pagination 
                    lastPage={lastPage}
                    currentPage={currentTablePage}
                    setCurrentPage={setCurrentTablePage}
                />
            </div>

            <div className="m-3 flex flex-col">
                <header  className="flex w-[95vw] text-gray-700 bg-[#ECF2FF] text-[0.85rem]">
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center justify-center">
                        Profile ID
                    </div>
                    <div className="p-2 text-center font-bold w-[23vw] min-h-[50px] border-[1px] flex items-center justify-center">Description</div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center justify-center">
                        <span className="block">Media Buyer</span>
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] items-center flex justify-center gap-2">
                        <span className="block">Brand</span>
                        <SortButton 
                            columnKey={"brand"}
                            onClick={() => changeSort("brand")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center justify-center gap-2">
                        <span className="block">Geo</span>
                        <SortButton 
                            columnKey={"geo"}
                            onClick={() => changeSort("geo")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[9vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">Code</span>
                        <SortButton 
                            columnKey={"angle"}
                            onClick={() => changeSort("angle")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">Total Spending</span>
                        <SortButton 
                            columnKey={"total_spending"}
                            onClick={() => changeSort("total_spending")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">Unique Visits</span>
                        <SortButton 
                            columnKey={"total_visits"}
                            onClick={() => changeSort("total_visits")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">CV</span>
                        <SortButton 
                            columnKey={"total_cv"}
                            onClick={() => changeSort("total_cv")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">Total Lead</span>
                        <SortButton 
                            columnKey={"total_lead"}
                            onClick={() => changeSort("total_lead")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                    <div className="p-2 text-center font-bold w-[7vw] min-h-[50px] border-[1px] flex items-center gap-2 justify-center">
                        <span className="block">CPL</span>
                        <SortButton 
                            columnKey={"cpl"}
                            onClick={() => changeSort("cpl")}
                            {...{sortOrder, sortKey}}
                        />
                    </div>
                </header>
                
                {sortedData().slice((currentTablePage - 1)*PageSize, currentTablePage*PageSize).map((campaign, index) => 
                    <ProfileTable 
                        key={index}
                        data={campaign}
                    />
                )}
            </div>

            <div className="m-5">
                <Pagination 
                    lastPage={lastPage}
                    currentPage={currentTablePage}
                    setCurrentPage={setCurrentTablePage}
                />
            </div>
        </div>
    )
}

export default AnalyticsTable