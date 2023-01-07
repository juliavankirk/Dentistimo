import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Unavailable = () => {
    return (
        <>
        <div>
            <Navbar />
        </div>
        <div className="d-flex align-items-center justify-content-center vh-100">
        
            <div className="text-center">
                
                <h1 className="display-1 fw-bold">This resource is unavailable</h1>
                {/* <p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p> */}
                <p className="lead">
                    The page you’re trying to acces is temporarily down. Please try again later! 
                  </p>
                <Link to={'/'}>Go Home</Link>
            </div>
        </div>        
        </>
    )
}

export default Unavailable
