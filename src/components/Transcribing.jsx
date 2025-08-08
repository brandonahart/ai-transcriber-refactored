import React from "react";


export default function Transcribing(props) {
    const { downloading } = props;

    return (
        <div className='flex items-center justify-center flex-col gap-10 md:gap-14 pb-24 p-4 text-center flex-1'>
            <div className='flex flex-col items-center gap-2 sm:gap-4'>

            
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl text-white'><span className='text-green-400 bold'>Transcribing</span> your audio...</h1>
            <p>{!downloading ? 'warming up cylinders' : 'core cylinders engaged'}</p>
            </div>
            <div className='flex flex-col gap-2 sm:gap-4 max-w-[400px] w-full mx-auto'>
                {[0,1,2].map(val => {
                    return (
                        <div key={val} className={'rounded-full h-2 sm:h-3 bg-slate-400 loading ' + `loading${val}`}></div>
                    )
                })}
            </div>
        </div>
    )
}