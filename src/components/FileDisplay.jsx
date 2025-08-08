import React from "react";

export default function FileDisplay(props) {
    const { handleAudioReset, file, audio, handleFormSubmission } = props;

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center pb-20 items-center text-center w-[400px] max-w-full mx-auto'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl text-white'>Your <span className='text-green-400 bold'>File</span></h1>
            <div className='flex flex-col text-left my-4 text-white border-white border p-2 rounded-lg w-[300px] gap-1'>
                <h3 className='font-semibold'>Name</h3>
                <p>{file ? file?.name : "Custom audio"}</p>
            </div>
            <div className='flex items-center gap-4 justify-between w-[300px]'>
                <button onClick={handleAudioReset} className='specialBtn2 rounded-lg hover:text-green-200 duration-200 px-4 py-2 text-green-400'>
                    Reset
                </button>
                <button onClick={handleFormSubmission} className='specialBtn p-2 rounded-lg text-green-400 flex items-center gap-2 font-medium'>
                    <p>Transcribe</p>
                    <i className="fa-solid fa-pen-nib"></i>
                </button>
            </div>
        </main>
    )
}