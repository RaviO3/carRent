import { cityList } from "../assets/assets"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Hero=()=>{
    const navigate=useNavigate()
    const[pickupLocation,setPickupLocation]=useState("")
    const[dates,setDates]=useState({
        pickupDate:"",
        returnDate:""
    })

    const handleSearch=(e)=>{
        e.preventDefault()

        const params=new URLSearchParams()
        if(pickupLocation) params.set("location",pickupLocation)
        if(dates.pickupDate) params.set("pickupDate",dates.pickupDate)
        if(dates.returnDate) params.set("returnDate",dates.returnDate)

        navigate(`/cars?${params.toString()}`)
    }

    return(
        <>
        <div className="hero">
            <div className="hero-text">
                <h1>Cars On Rent</h1>
            </div>
            <form className="hero-search row container mt-2" onSubmit={handleSearch}>
                <div className="col-lg-3 col-md-6">
                    <label className="hero-search-label">Pickup Location</label>
                    <select className="form-select" value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
                        <option value="">Pickup Location</option>
                        {
                            cityList.map((city)=> <option key={city} value={city}>{city}</option>)
                        }
                    </select>
                </div>
                <div className="col-lg-3 col-md-6">
                    <label className="hero-search-label" htmlFor="home-pickup-date">Pickup Date</label>
                    <input type="date" id="home-pickup-date" className="form-control" value={dates.pickupDate} onChange={(e)=>setDates({...dates,pickupDate:e.target.value})} />
                </div>
                <div className="col-lg-3 col-md-6">
                    <label className="hero-search-label" htmlFor="home-return-date">Return Date</label>
                    <input type="date" id="home-return-date" className="form-control" value={dates.returnDate} onChange={(e)=>setDates({...dates,returnDate:e.target.value})} />
                </div>
                <div className="col-lg-3 col-md-6 d-flex align-items-end">
                    <button className="btn btn-primary w-100" type="submit">Search Cars</button>
                </div>
            </form>
        </div>
        </>
    )
}
export default Hero
