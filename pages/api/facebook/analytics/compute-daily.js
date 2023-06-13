import { connectDatabase } from "@/helpers/db-utils";

export default async function getCampaignsReport(req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase()
        const campaignReport = client.db().collection("campaigns")
        const analyticsSummary = client.db().collection("facebook-summary")
        const profilesCollection = client.db().collection("profiles")

        const formatTime = `${new Date().toISOString().slice(0, 10)}`

        const substractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        let report = {
            date: substractDay(new Date(formatTime), 1).toISOString().slice(0, 19),
            total_spend: 0,
            total_lead: 0,
            total_cv: 0,
            total_visits: 0,
            geo_based: [],
            brand_based: [],
            angle_based: [],
            mb_based: []
        }

        // Retrive campaigns from profileHistory
        const campaigns = await campaignReport.find({}).toArray();
        const profiles = await profilesCollection.find({}).project({ profile_id: 1, media_buyer: 1 }).toArray();

        let countries = [], brands = [], angles = [], media_buyer = []

        campaigns.map((data) => {
            const info = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))
            const profile = profiles.filter(item => item.profile_id === data.profile_id)[0]

            // console.log(info, profile, "MB")

            // Compute total spending
            report.total_spend += (info[0] && info[0].spending) || 0;

            // console.log(report.total_spend, "test")
            
            // Compute total conversions
            if(info[0]?.voluum.length) {
                info[0].voluum.map(data => {
                    report.total_lead += data.conversions
                    report.total_cv += data.cv
                    report.total_visits += data.uniqueVisits
                })
                // console.log(info[0].voluum, "conversion")
            }

            // Generate Countries 
            if (!countries.includes(data.geo) && data.geo) {
                countries.push(data.geo)
            }

            // Generate Brands 
            if (!brands.includes(data.brand) && data.brand) {
                brands.push(data.brand)
            }

            // Generate Media Buyers
            if (!media_buyer.includes(profile.media_buyer) && profile.media_buyer) {
                media_buyer.push(profile.media_buyer)
            }

            // Generate Angle
            if(data.angle) {
                data.angle.map(item => {
                    if(!angles.includes(item)) {
                        angles.push(item)
                    }
                })
            }
        })

        // console.log(countries, "report")

        // Compute Angles
        angles.map(angle => {
            let total_angle_spending = 0, total_angle_lead = 0, total_angle_cv = 0, total_angle_visits = 0

            campaigns.map(data => {
                if(data.angle) {
                    data.angle.map(item => {
                        if(angle === item) {
                            const info = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))
                            total_angle_spending += (info[0] && info[0].spending)  || 0
                            
                            if(info[0]?.voluum.length) {
                                info[0].voluum.map(data => {
                                    total_angle_lead += data.conversions
                                    total_angle_cv += data.cv
                                    total_angle_visits += data.uniqueVisits
                                })
                            }
                        }
                    })
                }
            })

            report.angle_based.push({angle, total_angle_spending: total_angle_spending.toFixed(2), total_angle_lead: total_angle_lead.toFixed(), total_angle_cv: total_angle_cv.toFixed(2), total_angle_visits: total_angle_visits.toFixed()})
        })

        // Compute Countries
        countries.map(country => {
            let total_geo_spending = 0, total_geo_lead = 0, total_geo_cv = 0, total_geo_visits = 0

            campaigns.map(data => {
                if(data.geo === country) {
                    const info = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))

                    // Total Spending By Geo
                    total_geo_spending += (info[0] && info[0].spending) || 0

                    // Total Lead By Geo
                    if(info[0]?.voluum.length) {
                        info[0].voluum.map(data => {
                            total_geo_lead += data.conversions
                            total_geo_cv += data.cv
                            total_geo_visits += data.uniqueVisits
                        })
                    }

                    // console.log(info, data.geo, "geo")
                }
            })

            report.geo_based.push({ country, total_geo_spending: total_geo_spending.toFixed(2), total_geo_lead: total_geo_lead.toFixed(), total_geo_cv: total_geo_cv.toFixed(2), total_geo_visits: total_geo_visits.toFixed() })
        })

        // Compute Brand
        brands.map(brand => {
            let total_brand_spending = 0, total_brand_lead = 0, total_brand_cv = 0, total_brand_visits = 0

            campaigns.map(data => {
                if(data.brand === brand) {
                    const info = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))

                    // Total Spending By Geo
                    total_brand_spending += (info[0] && info[0].spending) || 0

                    // Total Lead By Geo
                    if(info[0]?.voluum.length) {
                        info[0].voluum.map(data => {
                            total_brand_lead += data.conversions
                            total_brand_cv += data.cv
                            total_brand_visits += data.uniqueVisits
                        })
                    }

                    // console.log(info, data.geo, "geo")
                }
            })

            report.brand_based.push({ brand, total_brand_spending: total_brand_spending.toFixed(2), total_brand_lead: total_brand_lead.toFixed(), total_brand_cv: total_brand_cv.toFixed(2), total_brand_visits: total_brand_visits.toFixed() })
        })

        // Compute Media Buyer
        media_buyer.map(mb => {
            let total_mb_spending = 0, total_mb_lead = 0, total_mb_cv = 0, total_mb_visits = 0

            campaigns.map(data => {
                const profile = profiles.filter(item => item.profile_id === data.profile_id)[0]

                if(profile.media_buyer === mb) {
                    const info = data.reports.filter(report => report.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))

                    // Total Spending By Geo
                    total_mb_spending += (info[0] && info[0].spending) || 0

                    // Total Lead By Geo
                    if(info[0]?.voluum.length) {
                        info[0].voluum.map(data => {
                            total_mb_lead += data.conversions
                            total_mb_cv += data.cv
                            total_mb_visits += data.uniqueVisits
                        })
                    }

                    // console.log(info, data.geo, "geo")
                }
            })

            report.mb_based.push({ mb, total_mb_spending: total_mb_spending.toFixed(2), total_mb_lead: total_mb_lead.toFixed(), total_mb_cv: total_mb_cv.toFixed(2), total_mb_visits: total_mb_visits.toFixed() })
        })

        // console.log(report, "report")


        report.total_spend = report.total_spend.toFixed(2)
        report.total_lead = report.total_lead.toFixed()
        report.total_cv = report.total_cv.toFixed(2)
        report.total_visits = report.total_visits.toFixed()

        // Update MongoDB Database
        let result

        const analytics = await analyticsSummary.find({}).toArray()
        const check_date = analytics.filter(data => data.date === substractDay(new Date(formatTime), 1).toISOString().slice(0, 19))

        if (!check_date.length) {
            result = await analyticsSummary.insertOne(report)
        } else {
            result = "Date already exist"
        }

        // Close Connection to Database
        client.close();

        res.json({ success: true, message: "Update analytics successful" });
    } catch (error) {
        res.json({ message: error, success: false })
    }
}