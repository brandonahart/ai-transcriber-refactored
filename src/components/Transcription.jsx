import React from "react";
export default function Transcription(props) {
    const { textElement } = props;
    return (
        <div className="text-white">
            {textElement ? (
                <p className="whitespace-pre-wrap">{textElement}</p>
            ) : (
                <p className="">No transcription available</p>
            )}
        </div>
    )
}