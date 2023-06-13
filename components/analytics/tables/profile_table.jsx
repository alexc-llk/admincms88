import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"

const ProfileTable = ({
    data
}) => {
    const [profileObjectId, setProfileObjectId] = useState()

    const getProfileId = async () => {
        // console.log(data, "analytics component profile table")
		const response = await axios(`/api/facebook/find-profile?search=${data.profile_id}`)
		const result = response.data.data[0]
		setProfileObjectId(result._id)
	}

    // console.log(data, "data")

    // const renderPage = () => {
    //     let selected_date = [];
    //     let conversion = 0;
    //     let spending = 0;
    
    //     switch (timeRange) {
    //       case "today":
    //         const formatDate = new Date(formatTime).toISOString().slice(0, 19);
    //         const reportToday = data.reports.find(report => report.date === formatDate);
    //         if (reportToday) {
    //           setTotalSpending(reportToday.spending);
    //           reportToday.conversions.forEach(conv => {
    //             conversion += conv.conversions;
    //           });
    //           setTotalConversion(conversion);
    //         }
    //         break;
    
    //       case "yesterday":
    //         const formatDateYesterday = substractDay(new Date(formatTime), 1).toISOString().slice(0, 19);
    //         const reportYesterday = data.reports.find(report => report.date === formatDateYesterday);
    //         if (reportYesterday) {
    //           setTotalSpending(reportYesterday.spending);
    //           reportYesterday.conversions.forEach(conv => {
    //             conversion += conv.conversions;
    //           });
    //           setTotalConversion(conversion);
    //         }
    //         break;
    
    //       case "3d":
    //         Array.from({ length: 3 }).forEach((_, i) => {
    //           selected_date.push(substractDay(new Date(formatTime), i + 1).toISOString().slice(0, 19));
    //         });
    //         const report3d = data.reports.filter(report => selected_date.includes(report.date));
    //         if (report3d.length) {
    //           report3d.forEach(data => {
    //             spending += data.spending;
    //             data.conversions.forEach(conv => {
    //               conversion += conv.conversions;
    //             });
    //           });
    //           setTotalSpending(spending);
    //           setTotalConversion(conversion);
    //         }
    //         break;
    
    //       case "7d":
    //         Array.from({ length: 7 }).forEach((_, i) => {
    //           selected_date.push(substractDay(new Date(formatTime), i + 1).toISOString().slice(0, 19));
    //         });
    //         const report7d = data.reports.filter(report => selected_date.includes(report.date));
    //         if (report7d.length) {
    //           report7d.forEach(data => {
    //             spending += data.spending;
    //             data.conversions.forEach(conv => {
    //               conversion += conv.conversions;
    //             });
    //           });
    //           setTotalSpending(spending);
    //           setTotalConversion(conversion);
    //         }
    //         break;
    
    //       default:
    //         break;
    //     }
    // };

    useEffect(() => {
      getProfileId()
    }, [])  

    return (
        
        <section className="flex text-[0.75rem] w-[95vw]">
            <div className="p-2 w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center hover:text-blue-600">
                <Link href={`/facebook/profile/${profileObjectId}`}>
                    {data.profile_id}
                </Link>
            </div>
            <div className="p-2 w-[23vw] min-h-[50px] border-[1px] flex flex-col justify-center">{data.description}</div>
            <div className="p-2 w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">{data.media_buyer}</div>
            <div className="p-2 w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">{data.brand}</div>
            <div className="p-2 w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">{data.geo}</div>
            <div className="w-[9vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((angle, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        {angle}
                    </div>)
                }
            </div>
            <div className="w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((_, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        $ { !data.total_spending ? "0.00" : Number(data.total_spending).toFixed(2) }
                    </div>)
                }
            </div>
            <div className="w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((_, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        { !data.total_visits ? "0" : Number(data.total_visits) }
                    </div>)
                }
            </div>
            <div className="w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((_, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        { !data.total_cv ? "0.00" : Number(data.total_cv).toFixed(2) }
                    </div>)
                }
            </div>
            <div className="w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((_, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        { !data.total_lead ? "0" : data.total_lead }
                    </div>)
                }
            </div>
            <div className="w-[7vw] min-h-[50px] border-[1px] flex flex-col justify-center">
                {data.angle && data.angle.map((_, index) => 
                    <div key={index} className={`p-2 ${index + 1 !== data.angle.length && "border-b-2"}`}>
                        $ { data.total_lead === 0 ? "0.00" : Number(data.cpl).toFixed(2) }
                    </div>)
                }
            </div>
        </section>    
        
    )
    }

export default ProfileTable