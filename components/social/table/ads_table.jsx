import { useState, useEffect } from "react"


const AdsTable = ({ 
  data,
  budget,
  time,
  id
}) => {
    const [report, setReport] = useState(data)

    const formatTime = `${new Date().toISOString().slice(0, 10)}`

    const substractDay = (date, days) => {
      date.setDate(date.getDate() - days);
      return date;
    }

    const computeReport = () => {
      if(time === "today") {
        const today_report = data.reports.filter(report => report.date === new Date(formatTime).toISOString().slice(0,19))
        if(today_report.length > 0) {
          setReport(today_report[0])
          // console.log(report, "today")
        }
      } else if(time === "yesterday") {
        const ytd_report = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0,19))
        if(ytd_report.length > 0) {
          setReport(ytd_report[0])
        }
      } else if (time === "3d") {
        let selected_date = [], report = {spend: 0, clicks: 0, cpc: 0, ctr: 0}
        Array.from({length: 3}).map((_, i) => selected_date.push(substractDay(new Date(formatTime), i+1).toISOString().slice(0,19)))
        
        const report_3d = data.reports.filter(report => {
          const info = selected_date.map(date => report.date === date)
          return info.includes(true)
        })

        report_3d.map(data => {
          report.spend += data.spend
          report.clicks += data.clicks
          report.cpc += data.cpc
          report.ctr += data.ctr
        })

        // console.log(selected_date, "REPORT")

        setReport(report)
      } else if (time === "7d") {
        let selected_date = [], report = {spend: 0, clicks: 0, cpc: 0, ctr: 0}
        Array.from({length: 7}).map((_, i) => selected_date.push(substractDay(new Date(formatTime), i+1).toISOString().slice(0,19)))

        const report_7d = data.reports.filter(report => {
          const info = selected_date.map(date => report.date === date)
          return info.includes(true)
        })

        report_7d.map(data => {
          report.spend += data.spend
          report.clicks += data.clicks
          report.cpc += data.cpc
          report.ctr += data.ctr
        })

        // console.log(selected_date, "REPORT")
        setReport(report)
      }

      // console.log(report, "REPORT")
    } 

    useEffect(() => {
      computeReport()
    }, [time])
    
    

    // console.log(report, new Date().toLocaleDateString(), "DATA")

    return (
        <>
          {report ? 
            <section className="flex w-[100%] text-[0.75rem]">
              <div className="flex items-center p-2 border-[1px] w-[25%]">
                {data.name} {`(${id})`}
              </div>
              <div className="flex items-center justify-center p-2 border-[1px] w-[10%]">
                {data.status}
              </div>
              <div className="flex items-center py-2 px-4 border-[1px] w-[10%]">$ {report.spend ? Number(report.spend).toFixed(2) : Number(0).toFixed(2)}</div>
              <div className="flex items-center py-2 px-4 border-[1px] w-[10%]">$ {(Number(budget)/100).toFixed(2)}</div>
              <div className="flex items-center p-2 border-[1px] w-[10%]">
                  <p className="px-2">
                    { report.clicks || "-" } <br />
                    <span className="italic mt-[1px] block">total clicks</span>
                  </p>
              </div>
              <div className="flex items-center p-2 border-[1px] w-[10%]">
                <p className="px-2">
                  $ {report.spend ? (report.spend / report.clicks).toFixed(2) : "-"} <br />
                  <span className="italic mt-[1px] block">cost per click</span>
                </p>
              </div>
              <div className="flex items-center justify-center p-2 border-[1px] w-[10%]">{`-`}</div>
              <div className="flex items-center justify-center p-2 border-[1px] w-[10%]">{report.cpc ? report.cpc.toFixed(2) : "-"}</div>
              <div className="flex items-center justify-center p-2 border-[1px] w-[10%]">{report.ctr ? report.ctr.toFixed(2) : "-"}</div>
            </section> 
            :
            <></>
          }
          
        </>
      )
  
}

export default AdsTable