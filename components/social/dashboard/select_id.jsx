import Image from "next/image"

const SelectId = ({
    singleFbProfile,
    activeId,
    setActiveId,
    setOpenModal,
    openModal
}) => {

    return (
        <div className="flex flex-col w-[100%]">
            <div className="flex flex-1">
                <p className="text-[0.8rem] text-slate-500 flex gap-2">
                    Profile ID -
                    <span>:</span>
                    <span className="italic">{singleFbProfile.profile_id}</span>
                    <button
                        onClick={() => setOpenModal(!openModal)}
                    >
                        {/* Edit Profile */}
                        <Image
                            className='object-contain ml-2'
                            src='/icons/pencil.png'
                            width='10'
                            height='10' 
                            alt='down-arrow'
                        />
                    </button>
                </p>
            </div>

            <div className="flex flex-1 gap-5 text-[0.8rem] my-2 items-center">
                <p className="w-[30%] font-[500]">Business Manager</p>
                <p>:</p>
                <select value={activeId.business} onChange={(e) => setActiveId({business: e.target.value, ad: ""})} className="p-2 w-[70%] border-2 border-slate-300">
                    <option disabled value="">--- select one ---</option>
                    {singleFbProfile.bm_account.map(bm => 
                        <option value={bm.id} key={bm.id}>{bm.name} {`(${bm.id})`}</option>
                    )}
                </select>
            </div>

            <div className="flex flex-1 gap-5 text-[0.8rem] my-2 items-center">
                <p className="w-[30%] font-[500]">Ad Manager</p>
                <p>:</p>
                <select value={activeId.ad} onChange={(e) => setActiveId(prev => ({...prev, ad: e.target.value}))} className="p-2 w-[70%] border-2 border-slate-300">
                    <option value="" disabled>--- select one ---</option>
                    {singleFbProfile.ad_account.map(ad => {
                        if(ad.bm_account_id === activeId.business) {
                            return <option value={ad.id} key={ad.id}>{ad.name} {`(${ad.id})`}</option>
                        }
                    })}
                </select>
            </div>
        </div>
    )
}

export default SelectId