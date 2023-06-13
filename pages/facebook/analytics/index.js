import { useContext, useEffect, useState } from "react"
import Image from "next/image";
import { CreateFacebookContext } from "@/context/facebook/facebook-context"
import AnalyticsTable from "@/components/social/table/analytics-table";
import SummaryTable from "@/components/social/table/analytics/summaryTable";
import { getSession } from "next-auth/react";

const FacebookReport = () => {
  // Global State
  const { currentPage, inputId, allCampaigns, setAllCampaigns, analyticsReport, setAnalyticsReport } = useContext(CreateFacebookContext)

  // Local State
  const [timeRange, setTimeRange] = useState("today")
  const [toggleTable, setToggleTable] = useState("default")
  const [mediaBuyer, setMediaBuyer] = useState("default")
  const [mediaBuyerArray, setMediaBuyerArray] = useState([])
  const [mediaBuyerGeo, setMediaBuyerGeo] = useState([])
  const [mediaBuyerBrand, setMediaBuyerBrand] = useState([])
  const [country, setCountry] = useState("default")
  const [countryArray, setCountryArray] = useState([])
  const [brand, setBrand] = useState("default")
  const [brandArray, setBrandArray] = useState([])
  const [searchID, setSearchID] = useState("")
  const [date, setDate] = useState('');

  const formatTime = `${new Date().toISOString().slice(0, 10)}`

  const substractDay = (date, days) => {
    date.setDate(date.getDate() - days);
    return date;
  }

  const computeDay = async (days) => {
    const response_analytic = await fetch(`/api/facebook/analytics/get-analytics`)
    const result_analytic = await response_analytic.json()

    console.log(result_analytic, "result")

    let selected_date = [], countries = [], brands = [], reports = [], angles = [], media_buyer = []
      let summary = { 
        total_spend: 0, 
        total_lead: 0,
        geo_based: [],
        brand_based: [],
        angle_based: [],
        mb_based: []
      }

      setAnalyticsReport(summary)

      Array.from({length: days}).map((_, i) => selected_date.push(substractDay(new Date(formatTime), i+1).toISOString().slice(0,19)))

      selected_date.map(date => {
        result_analytic.analytics.map(analytic => {
          if(analytic.date === date) {
            reports.push(analytic)
          }
        })
      })

      // console.log(reports, "report")

      reports.map(data => {
        summary.total_spend += Number(data.total_spend)
        summary.total_lead += Number(data.total_lead)

        data.geo_based.map(geo => {
          // console.log(countries, geo)
          const exist = countries.filter(item => item === geo.country)
          if(!exist.length) {
            countries.push(geo.country)
          }
        })


        data.brand_based.map(brand => {
          // console.log(brands, brand)
          const exist = brands.filter(item => item === brand.brand)
          if(!exist.length) {
            brands.push(brand.brand)
          }
        })

        data.mb_based?.map(mb => {
          // console.log(mb, "mb")
          const exist = media_buyer.filter(item => item === mb.mb)
          if(!exist.length) {
            media_buyer.push(mb.mb)
          }
        })

        data.angle_based.map(angle => {
          // console.log(angle.angle)
          const exist = angles.filter(item => item === angle.angle)
          if(!exist.length) {
            angles.push(angle.angle)
          }
        })
        // data.brand_based.map(data => brands.push(data.brand))
        // data.angle_based.map(data => angles.push(data.angle))

        // console.log(data.brand_based)
      })

      // console.log(media_buyer, "mb")

      countries.map(country => {
        let country_spend = 0, country_lead = 0

        reports.map(data => {
          const filter = data.geo_based.filter(spend => spend.country === country)

          // console.log(filter, "filter")
 
          if(filter.length) {
            country_spend += Number(filter[0].total_geo_spending)
            country_lead += Number(filter[0].total_geo_lead)
          }
        })

        summary.geo_based.push({ country, total_geo_spending: country_spend, total_geo_lead: country_lead })
      })

      brands.map(brand => {
        let brand_spend = 0, brand_lead = 0

        reports.map(data => {
          const filter = data.brand_based.filter(spend => spend.brand === brand)
      
          if(filter.length) {
            brand_spend += Number(filter[0].total_brand_spending)
            brand_lead += Number(filter[0].total_brand_lead)
          }
        })

        summary.brand_based.push({ brand, total_brand_spending: brand_spend, total_brand_lead: brand_lead })
      })

      angles.map(angle => {
        let angle_spend = 0, angle_lead = 0

        reports.map(data => {
          const filter = data.angle_based.filter(item => item.angle === angle)

          if(filter.length) {
            angle_spend += Number(filter[0].total_angle_spending)
            angle_lead += Number(filter[0].total_angle_lead)
          }
        })

        summary.angle_based.push({ angle, total_angle_spending: angle_spend, total_angle_lead: angle_lead, angle_cpl: angle_lead === 0 ? 0 : (angle_spend / angle_lead).toFixed(2)  })
      })

      media_buyer.map(mb => {
        let mb_spend = 0, mb_lead = 0

        reports.map(data => {
          const filter = data.mb_based?.filter(item => item.mb === mb)

          if(filter?.length) {
            mb_spend += Number(filter[0].total_mb_spending)
            mb_lead += Number(filter[0].total_mb_lead)
          }
        })

        summary.mb_based.push({ mb, total_mb_spending: mb_spend, total_mb_lead: mb_lead, mb_cpl: mb_lead === 0 ? 0 : (mb_spend / mb_lead).toFixed(2) })
      })
      console.log(summary, "sum")
      setAnalyticsReport(summary)
  }

  const computeToday = (result) => {
    let countries = [], brands = [], angles = [], media_buyer = []
    let summary = {
      total_spend: 0, 
      total_lead: 0,
      geo_based: [],
      brand_based: [],
      angle_based: [],
      mb_based: []
    }

    setAnalyticsReport(summary)
    
    const formatDate = new Date(formatTime).toISOString().slice(0, 19)

      result.campaigns.map((data) => {
        const report = data.reports.filter(data => data.date === formatDate)
        
        if (report.length) {
          summary.total_spend += Number(report[0].spending)
          // console.log(report[0], "rp")
          report.map(rp => {
            if(rp.voluum?.length) {
              rp.voluum.map(vol => {
                summary.total_lead += vol.conversions
              })
            }
          })
        }

        if(!countries.includes(data.geo) && data.geo) {
          countries.push(data.geo)
        }

        if(!brands.includes(data.brand) && data.geo) {
          brands.push(data.brand)
        }

        if(!media_buyer.includes(data.media_buyer) && data.media_buyer) {
          media_buyer.push(data.media_buyer)
        }

        if(data.angle) {
          data.angle.map(item => {
            if(!angles.includes(item)) {
                angles.push(item)
            }
          })
        }
      })

      // console.log(angles, "angles")

      angles.map(angle => {
        let total_spend = 0, total_lead = 0
        result.campaigns.map(data => {
          const report = data.reports.filter(data => data.date === formatDate)
          if(data.angle) {
            data.angle.map(item => {
              if(angle === item) {
                total_spend += Number(report[0]?.spending)

                report.map(rp => {
                  if(rp.voluum?.length) {
                    rp.voluum.map(vol => {
                      total_lead += vol.conversions
                    })
                  }
                })
              }
            })
          }
        })

        summary.angle_based.push({angle, total_angle_spending: total_spend.toFixed(2), total_angle_lead: total_lead.toFixed(), angle_cpl: total_lead === 0 ? 0 : (total_spend / total_lead).toFixed(2) })
      })

      countries.map(country => {
        let total_spend = 0, total_lead = 0 
        result.campaigns.map(data => {
          const report = data.reports.filter(data => data.date === formatDate)
          if(data.geo === country && report.length) {
            total_spend += Number(report[0].spending)

            report.map(rp => {
              if(rp.voluum?.length) {
                rp.voluum.map(vol => {
                  total_lead += vol.conversions
                })
              }
            })
          }
        })
        summary.geo_based.push({ country, total_geo_spending: total_spend.toFixed(2), total_geo_lead: total_lead.toFixed()})
      })

      brands.map(brand => {
        let total_spend = 0, total_lead = 0 
        result.campaigns.map(data => {
          const report = data.reports.filter(data => data.date === formatDate)
          if(data.brand === brand && report.length) {
            total_spend += Number(report[0].spending)

            report.map(rp => {
              if(rp.voluum?.length) {
                rp.voluum.map(vol => {
                  total_lead += vol.conversions
                })
              }
            })
          }
        })
        summary.brand_based.push({ brand, total_brand_spending: total_spend.toFixed(2), total_brand_lead: total_lead.toFixed()})
      })

      media_buyer.map(mb => {
        let total_spend = 0, total_lead = 0 
        result.campaigns.map(data => {
          const report = data.reports.filter(data => data.date === formatDate)
          if(data.media_buyer === mb && report.length) {
            total_spend += Number(report[0].spending)

            report.map(rp => {
              if(rp.voluum?.length) {
                rp.voluum.map(vol => {
                  total_lead += vol.conversions
                })
              }
            })
          }
        })
        summary.mb_based.push({ mb, total_mb_spending: total_spend.toFixed(2), total_mb_lead: total_lead.toFixed(), mb_cpl: total_lead === 0 ? 0 : (total_spend / total_lead).toFixed(2)})
      })

      // console.log(summary, "today")
      setAnalyticsReport(summary)
  }

  const fetchCampaigns = async () => {
    const response = await fetch(`/api/facebook/analytics/get-campaigns?active_md=${mediaBuyer}`)
    const result = await response.json()

    // console.log(result.campaigns, "fb/analytics")

    if (timeRange === "today") {
      computeToday(result)
    } else if (timeRange === "yesterday") {
      computeDay(1)
    } else if (timeRange === "3d") {
      computeDay(3)
    } else if (timeRange === "7d") {
      computeDay(7)
    }

    setAllCampaigns(result.campaigns) 
    setMediaBuyerArray(result.mb_arr) 
  }

  const filterMediaBuyer = async () => {
    const response = await fetch(`/api/facebook/analytics/get-campaigns?active_md=${mediaBuyer}`)
    const result = await response.json()

    // console.log(result)

    if (timeRange === "today") {
      computeToday(result)
    } else if (timeRange === "yesterday") {
      computeDay(1)
    } else if (timeRange === "3d") {
      computeDay(3)
    } else if (timeRange === "7d") {
      computeDay(7)
    }

    if(mediaBuyer !== "default" || country !== "default" || brand !== "default") {
      const filter_mb = result.campaigns.filter(cp => cp.media_buyer === mediaBuyer || mediaBuyer === "default")
      const filter_country = filter_mb.filter(item => item.geo === country || country === "default")
      const filter_brand = filter_country.filter(item => item.brand === brand || brand === "default")
      setAllCampaigns(filter_brand)
    } else {
      fetchCampaigns()
    }
  }

  const computeDateArray = (days) => {
    let selected_date = []
    if (days === 0) {
      selected_date.push(new Date(formatTime).toISOString().slice(0,19))
    } else {
      Array.from({length: days}).map((_, i) => selected_date.push(substractDay(new Date(formatTime), i+1).toISOString().slice(0,19)))
    }
    
    return selected_date
  }

  const computeMediaBuyer = async () => {
    let mediaBuyerCampaigns, dates_array

    const response = await fetch(`/api/facebook/analytics/get-campaigns?active_md=${mediaBuyer}`)
    const result = await response.json()
    
    if(mediaBuyer !== "default") {
      mediaBuyerCampaigns = result.campaigns.filter(item => item.media_buyer === mediaBuyer)
    } else {
      mediaBuyerCampaigns = result.campaigns
    }

    if(timeRange === "today") {
      dates_array = computeDateArray(0)
    } else if (timeRange === "yesterday") {
      dates_array = computeDateArray(1)
    } else if (timeRange === "3d") {
      dates_array = computeDateArray(3)
    } else if (timeRange === "7d") {
      dates_array = computeDateArray(7)
    } else {
      dates_array = computeDateArray(0)
    }

    let mb_geo = [], mb_brand = [], countries = [], brands = []

      mediaBuyerCampaigns.map(campaign => {
        if(!countries.includes(campaign.geo) && campaign.geo !== ""){
          countries.push(campaign.geo)
        }

        if(!brands.includes(campaign.brand) && campaign.brand !== "") {
          brands.push(campaign.brand)
        }
      })

      countries.map(country => {
        let summary = {
          country,
          total_spending: 0,
          total_lead: 0
        }
        const filtered_campaign = mediaBuyerCampaigns.filter(item => item.geo === country)
        filtered_campaign.map(campaign => {
          dates_array.map(date => {
            if(campaign.geo === country) {
              campaign.reports.map(item => {
                // console.log(item.date, date)
                if(item.date === date) {
                  summary.total_spending += item.spending
                  // console.log(item, "item")
                  if(item.voluum?.length) {
                    item.voluum.map(vol => {
                      summary.total_lead += vol.conversions
                    })
                  }
                  // item.conversions.map(conv => {
                  //   summary.total_lead += conv.conversions
                  // })
                }
              })
            }
          })
        })
        mb_geo.push(summary)
      })

      brands.map(brand => {
        let summary = {
          brand,
          total_spending: 0,
          total_lead: 0
        }
        const filtered_campaign = mediaBuyerCampaigns.filter(item => item.brand === brand)
        filtered_campaign.map(campaign => {
          dates_array.map(date => {
            if(campaign.brand === brand) {
              campaign.reports.map(item => {
                // console.log(item.date, date)
                if(item.date === date) {
                  summary.total_spending += item.spending
                  if(item.voluum?.length) {
                    item.voluum.map(vol => {
                      summary.total_lead += vol.conversions
                    })
                  }
                }
              })
            }
          })
        })
        mb_brand.push(summary)
      })

      setCountryArray(countries)
      setBrandArray(brands)
      setMediaBuyerGeo(mb_geo)
      setMediaBuyerBrand(mb_brand)
      // console.log(mb_geo, "mb geo today")
  }

  const selectMediaBuyer = (e) => {
    setCountry("default")
    setBrand("default")
    setMediaBuyer(e.target.value)
  }

  const selectGroup = (group) => {
    setMediaBuyer("default")
    setCountry("default")
    setBrand("default")
    setToggleTable(group)
  }

  useEffect(() => {
    filterMediaBuyer()
    computeMediaBuyer()
  }, [mediaBuyer, timeRange, country, brand])
  
	useEffect(() => {
		// Suggestion to check if Valid Array before parsing ? otherwise we can default to Skip execution ?
		fetchCampaigns()
    // fetchAnalytics()
		// eslint-disable-next-line
	}, [currentPage, inputId, toggleTable]);

  return (
    <div className="mx-5 min-h-[80vh]">
      <div className="mx-5">
        <div className="my-5 border-2 py-3 px-5 rounded-md border-gray-600 flex flex-col gap-5">
          <div>
            <div className="flex mb-3 justify-between">
              <p className="text-xl font-[500]">Summary Report</p>
              <button className="bg-sky-300 border-2 border-sky-800 text-sky-800 font-[500] rounded-md p-2 text-sm hover:bg-transparent">Export CSV</button>
            </div>
            <div className="flex gap-5 flex-wrap">
              <div className="border-2 p-3 border-indigo-800 rounded-md">
                <div className="font-[600] text-gray-600 text-lg uppercase">
                  <span className="text-indigo-700 text-sm block mt-1">
                    Total Spending: 
                  </span>
                  <span className="text-indigo-700 block mt-1">$ 
                    {mediaBuyer !== "default" ? analyticsReport && analyticsReport.mb_based.map(mb => {
                      if(mediaBuyer === mb.mb) {
                        return mb.total_mb_spending
                      }
                    }) : 
                      analyticsReport ? Number(analyticsReport.total_spend).toFixed(2) : "0.00"
                    }
                  </span>
                </div>

                <div className="font-[600] text-gray-600 text-lg uppercase">
                  <span className="text-indigo-700 text-sm block mt-1">Lead: </span>
                  <span className="text-indigo-700 block mt-1">
                    {mediaBuyer !== "default" ? analyticsReport && analyticsReport.mb_based.map(mb => {
                      if(mediaBuyer === mb.mb) {
                        return mb.total_mb_lead
                      }
                    }) : 
                      analyticsReport ? analyticsReport.total_lead.toFixed() : "0.00"
                    }
                  </span>
                </div>
              </div>

              <div className="flex-1 p-3 rounded-md border-2 border-emerald-800 min-w-[360px]">
                <p className="font-[600] text-emerald-800 text-lg uppercase mb-2">Geo</p> 
                <div className="flex gap-5 flex-wrap">
                  {mediaBuyerGeo?.sort((a,b) => ((a.total_spending / a.total_lead) - (b.total_spending / b.total_lead))).map((row, index) => 
                    <div key={index} className={`text-sm text-green-600`}>
                          <p className="font-bold">{row.country}</p>
                          <p>Spending: $ {Number(row?.total_spending).toFixed(2)}</p>
                          <p>Lead: {row.total_lead}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-3 rounded-md border-2 border-blue-800 min-w-[360px]">
                <p className="font-[600] text-blue-800 text-lg uppercase mb-2">Brand</p> 
                <div className="flex gap-5 flex-wrap">
                  {mediaBuyerBrand.sort((a,b) => ((a.total_spending / a.total_lead) - (b.total_spending / b.total_lead))).map((row, index) => 
                    <div key={index} className="text-sm text-sky-600">
                      {/* {index === 0 && <p className="uppercase text-sm underline text-center">Top</p>} */}
                      <p className="font-bold">{row.brand}</p>
                      <p>Spending: $ {Number(row?.total_spending).toFixed(2)}</p>
                      <p>Lead: {row.total_lead}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mx-5 mb-3 gap-3">
        {timeRange === "custom" &&
          <input type="date" 
            className="p-2 border-2 border-slate-300 rounded-md" 
            onChange={(e) => setDate(e.target.value)}
          />
        }
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="p-2 w-[15vw] border-2 border-slate-300 text-[0.8rem] rounded-md">
          <option disabled>--- select one ---</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="3d">3 Days Ago</option>
          <option value="7d">7 Days Ago</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div className="mb-5 mx-5 flex justify-end gap-3 flex-wrap">
        <div className="lg:w-[70%] flex gap-1 justify-end flex-wrap">
            <div className="flex border-2 w-[250px] rounded-md border-slate-300">
              <input value={searchID} onChange={(e) => setSearchID(e.target.value)} placeholder="Search Profile ID" className="text-[0.8rem] p-2 focus:outline-none w-[100%]" />
              <button
                disabled={searchID === "" ? true : false} 
                onClick={() => setSearchID("")}
                className={`${searchID === "" && "opacity-0"} transition-all duration-500`}
              >
                <Image 
                  className="object-contain mr-5"
                  src="/icons/close.png" 
                  width="12" 
                  height="12" 
                  alt="close"
                />
              </button>
              <button 
                disabled={searchID === "" ? true : false} 
                className={`${searchID === "" && "opacity-0 translate-x-[2rem]"} bg-[#7CB9E8] hover:bg-[#7CB9E890] px-3 rounded-r-sm transition-all duration-500`}
                onClick={() => {}}
              >
                Find
              </button>
            </div>
            <select value={mediaBuyer} onChange={selectMediaBuyer} className="p-1 lg:w-[20%] border-2 border-slate-300 text-[0.8rem] rounded-md">
              <option value="default">--- All Media Buyers ---</option>
              {mediaBuyerArray.map(item => 
                <option key={item} value={item}>{item}</option>  
              )}
            </select>

            <select value={country} onChange={(e) => setCountry(e.target.value)} className="p-1 lg:w-[20%] border-2 border-slate-300 text-[0.8rem] rounded-md">
              <option value="default">--- All Countries ---</option>
              {countryArray.map(item => 
                <option key={item} value={item}>{item}</option>  
              )}
            </select>

            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="p-1 lg:w-[15%] border-2 border-slate-300 text-[0.8rem] rounded-md">
              <option value="default">--- All Brands ---</option>
              {brandArray.map(item => 
                <option key={item} value={item}>{item}</option>  
              )}
            </select>
        </div>
        <button className="bg-gray-200 p-2 rounded-md text-gray-700 border-2 border-gray-700 hover:bg-white"
          onClick={() => selectGroup("default")}
        >
          General
        </button>

        <button className="bg-violet-200 p-2 rounded-md text-violet-700 border-2 border-violet-700 hover:bg-white"
          onClick={() => selectGroup("Code")}
        >
          Group by Code
        </button>

        <button className="bg-orange-200 p-2 rounded-md text-orange-700 border-2 border-orange-700 hover:bg-white"
          onClick={() => selectGroup("Media Buyer")}
        >
          Group by Media Buyer
        </button>
      </div>
           
      {(toggleTable !== "default" && analyticsReport) &&
        <SummaryTable 
          analytics={analyticsReport}
          type={toggleTable}
          timeRange={timeRange}
        />
      }
     
      {/* Default Table */}
      {(toggleTable === "default" && allCampaigns) && 
        <AnalyticsTable 
          allCampaigns={allCampaigns}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      }
    </div>
  )
}

export default FacebookReport

export async function getServerSideProps({ req }){
	const session = await getSession({ req })

	if(!session){
		return {
		redirect : {
			destination: '/login',
			permanent: false
		}
		}
	}

	return {
		props: { session }
	}
}