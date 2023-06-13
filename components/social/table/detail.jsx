import { useState, useContext } from "react"
import { CreateFacebookContext } from "@/context/facebook/facebook-context"
import Image from "next/image"
import AdsTable from "./ads_table"

const ProfileDetailTable = ({
  setTimeRange,
  timeRange,
  activeAdaccount
}) => {
  // Global State
  const { allReports } = useContext(CreateFacebookContext)
  console.log(allReports, "RE")

  // Local State
  const [tableCategory, setTableCategory] = useState("Campaign")
  const [inputName, setInputName] = useState("")

  return (
    <div>
        <div className='flex gap-2 mb-3'>
          <div className="text-[0.8rem]">
            <select defaultValue={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="p-2 border-2">
                  <option disabled>--- select one ---</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="3d">3 Days Ago</option>
                  <option value="7d">7 Days Ago</option>
            </select>
          </div>

          <div className="text-[0.8rem]">
            <select defaultValue={tableCategory} onChange={(e) => setTableCategory(e.target.value)} className="p-2 border-2">
                  <option disabled>--- select one ---</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Ad Set">Ad Set</option>
                  <option value="Ad">Ad</option>
            </select>
          </div>

          <div className="flex border-2 w-[15%]">
            <input 
              className="text-[0.8rem] px-2 py-1 focus:outline-none w-[100%]"
              placeholder='Search by Name...' 
              onChange={(e) => setInputName(e.target.value)}
              value={inputName}
            />
              {inputName !== "" &&  
                <button
                  onClick={() => setInputName("")}
                >
                  <Image 
                    className="object-contain mx-4"
                    src="/icons/close.png" 
                    width="12" 
                    height="12" 
                    alt="close"
                  />
                </button>
              }
          </div>
        </div>

        <header className="flex w-[100%] text-gray-700 bg-[#ECF2FF] text-[0.8rem]">
            <div className="text-center p-2 font-[500] border-[1px] w-[25%]">{tableCategory}</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Delivery</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Amount Spend</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Budget</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Result</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Cost Per Result</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">Conversion</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">CPC</div>
            <div className="text-center p-2 font-[500] border-[1px] w-[10%]">CTR</div>
        </header>

        {tableCategory === "Campaign" &&
          allReports.campaigns.filter(cp => cp.adaccount === activeAdaccount).sort((a,b) => {
            if(a.status === "ACTIVE") return -3
            if(a.status === "WITH_ISSUES") return -2
            if(a.status < b.status) return -1
            return 0
          }).map((campaign, i) => 
            <AdsTable 
                key={i}
                data={campaign}
                budget={campaign.budget}
                time={timeRange}
                id={campaign.campaign_id}
            />
          )
          
        }

        {tableCategory === "Ad Set" &&
          allReports.adsets.filter(cp => cp.adaccount === activeAdaccount).sort((a,b) => {
            if(a.status === "ACTIVE") return -3
            if(a.status === "WITH_ISSUES") return -2
            if(a.status < b.status) return -1
            return 0
          }).map((adset, i) => 
              <AdsTable 
                key={i}
                data={adset}
                budget={adset.budget}
                time={timeRange}
                id={adset.adset_id}
              />
          )
        }

        {tableCategory === "Ad" &&
          allReports.ads.filter(cp => cp.adaccount === activeAdaccount).sort((a,b) => {
            if(a.status === "ACTIVE") return -3
            if(a.status === "WITH_ISSUES") return -2
            if(a.status < b.status) return -1
            return 0
          }).map((ad, i) => 
              <AdsTable 
                key={i}
                data={ad}
                budget={ad.budget}
                time={timeRange}
                id={ad.ad_id}
              />
          )
        }
        
    </div>
  )
}

export default ProfileDetailTable