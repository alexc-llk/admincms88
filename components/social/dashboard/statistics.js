import { useContext, useState, useEffect } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"

const Statistics = ({
  singleFbProfile,
  activeId,
  timeRange
}) => {
  // Global State
  const { allReports } = useContext(CreateFacebookContext)

  // Local State
  const [spent, setSpent] = useState(0)

  const formatTime = `${new Date().toISOString().slice(0, 10)}`

  const substractDay = (date, days) => {
    date.setDate(date.getDate() - days);
    return date;
  }

  const computeTotalSpent = () => {
    // console.log(allReports)

    if(timeRange === "today") {
      let totalSpending = 0
      const formatDate = new Date(formatTime).toISOString().slice(0, 19)

      allReports.campaigns.map(camp => {
        const camp_spending = camp.reports.filter(report => report.date === formatDate)
        if (camp_spending.length > 0) {
          totalSpending += camp_spending[0].spend
        }
      })
      setSpent(totalSpending)
    } else if (timeRange === "yesterday") {
      let totalSpending = 0
      const formatDate = substractDay(new Date(formatTime), 1).toISOString().slice(0, 19)

      allReports.campaigns.map(camp => {
        const camp_spending = camp.reports.filter(report => report.date === formatDate)
        if (camp_spending.length > 0) {
          totalSpending += camp_spending[0].spend
        }
      })
      setSpent(totalSpending)
    } else if (timeRange === "3d") {
      let totalSpending = 0

      allReports.campaigns.map(camp => {
        Array.from({length: 3}).map((_, i) => {
          const campaign_spending = camp.reports.filter(report => report.date === substractDay(new Date(formatTime), i+1).toISOString().slice(0,19))
          if (campaign_spending.length !== 0) {
            totalSpending += campaign_spending[0].spend
          }
        })
      })
      setSpent(totalSpending)
    } else if (timeRange === "7d") {
      let totalSpending = 0

      allReports.campaigns.map(camp => {
        Array.from({length: 7}).map((_, i) => {
          const campaign_spending = camp.reports.filter(report => report.date === substractDay(new Date(formatTime), i+1).toISOString().slice(0,19))
          if (campaign_spending.length !== 0) {
            totalSpending += campaign_spending[0].spend
          }
        })
      })
      setSpent(totalSpending)
    }
  }

  useEffect(() => {
    computeTotalSpent()
  }, [timeRange, allReports])
  

  

  return (
    <div className='flex flex-col h-full justify-between'>
        <div>
          <h1 className='text-[0.8rem] font-bold text-gray-500'>Overview - Result from {allReports.campaigns ? allReports.campaigns.length : 0} campaigns {`(${timeRange})`}</h1>
        
            <div className="my-3">
                <h2 className='text-slate-400 font-[500] text-[0.9rem]'>Total Spent</h2>
                <p className='text-[#823df2] font-bold lg:text-[1.4rem]'>$ {Number(spent).toFixed(2)}</p>
            </div>
        
        </div>
        
          <div className={`text-[0.85rem]`}>
              {singleFbProfile.ad_account.map(ad => {
                  if(ad.id === activeId.ad) {
                      return <p className="font-[500] text-gray-400" key={ad.id}>
                          Timezone : 
                          <span key={ad.id}> {ad.timezone_name}</span>
                      </p>
                  }
              })}
          </div>
    </div>
  )
}

export default Statistics

const data = [
  {title: "Total Spent", amount: "10000"},
]