import { useState } from "react"

const ContentEditor = () => {
    const [element, setElement] = useState({})
    const [sectionContent, setSectionContent] = useState([{ header: "Test", textSize: "text-[30px]" }, { paragraph: "Test a description", textSize: "text-[20px]" }])

    const addElement = () => {
        
    }
    
    return (
        <div className="px-[5%]">
            <h3 className="text-[1.2rem] font-[500] py-5">Content Editor</h3>
            <form>
                <section className="border-2 p-3">
                    <div className="flex gap-2">
                        <select defaultValue="defaultValue" className="border-slate-700 border-2 h-8 px-2" name="" id="">
                            <option disabled value="defaultValue">--Select an option--</option>
                            <option value="header">Heading</option>
                            <option value="paragraph">Paragraph</option>
                        </select>
                        <button 
                            onClick={() => {}}
                            className="bg-blue-800 text-white font-[500] h-8 w-20 rounded-sm"
                        >
                            Insert
                        </button>
                    </div>

                    <div className="border-2 border-sky-300 mt-3 p-3">
                        {sectionContent.map((data) => 
                            Object.keys(data).map((key, i) => 
                                <div key={i}>
                                    {key === "header" && <h3 className={`${data.textSize} font-[500] hover:border-2`}>{data[key]}</h3>}
                                    {key === "paragraph" && <p className={`${data.textSize} font-[300] hover:border-2`}>{data[key]}</p>}
                                </div>
                            )
                        )}
                    </div>
                </section>

                
            </form>
        </div>
    )
}

export default ContentEditor