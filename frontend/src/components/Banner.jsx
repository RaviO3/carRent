import { useNavigate } from "react-router-dom"

const Banner=()=>{
    const navigate=useNavigate()

    const handleBrowseCars=()=>{
        navigate("/cars")
    }

    return(
        <div className="banner mt-5 text-center text-white">
            <div className="banner-text mt-5">
                <h2>Need A Car For Your Next Trip?</h2>
                <p className="mt-5">Choose from verified cars for city rides, family travel, business trips, and weekend plans.</p>
                <p>Simple booking, clear pricing, and secure checkout in just a few clicks.</p>
                <button className="btn btn-primary mt-5" onClick={handleBrowseCars}>Book a Car</button>
            </div>
        </div>
    )
}
export default Banner
