import React from "react";
export default function ReceivedMessages(props) {
  return (
    <div style={backgroundStyle}><p>{props.msg.sender}</p>
      <p style={{ marginLeft: 'auto', marginRight: '50%'}}>{props.msg.title} </p>
     </div>
);

}
const backgroundStyle = {
  padding: "10px",
  borderBottom: ".1px #000000 dotted",
  display: "flex"
};
