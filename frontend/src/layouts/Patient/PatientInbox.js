import React from "react"
import ReceivedMessages from "./ReceivedMessages"

export default function PatientInbox(props) {
    return props.msgs.map((msgs) => (
        <div>
        <ReceivedMessages key={msgs.id} msg={msgs}/>
        </div>
    ))
}