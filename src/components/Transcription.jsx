import React from "react";
export default function Transcription(props) {
    const { transcription } = props;
    return (
        <div className="text-white">
            {transcription ? (
                <p className="whitespace-pre-wrap">{transcription}</p>
            ) : (
                <p className="text-gray-400">No transcription available</p>
            )}
        </div>
    )
}