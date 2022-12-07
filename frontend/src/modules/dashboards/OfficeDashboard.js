import { useState } from "react";
import OfficeTabs from "../../components/OfficeTabs";

const OfficeDashboard = (props) => {
    const [state1, setState1] = useState('test value');
    

    return (
        <OfficeTabs/>
    )
}

export default OfficeDashboard