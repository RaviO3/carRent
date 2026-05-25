import {FaIndianRupeeSign} from "react-icons/fa6"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/appContextObject"
import { getImageUrl } from "../utils/imageUrl"

const CarCard=({car})=>{
    const navigate=useNavigate()
    const {backendUrl}=useContext(AppContext)
    return(
        <div className="card mt-4">
            <img src={getImageUrl(car.image, backendUrl)} className="card-img-top car-card-image" alt={car.brand} onClick={()=>navigate(`/car-detail/${car._id}`)}/>
            <div className="card-body">
                <h5 className="card-title"></h5>
                {car.isAvailable ? (
                    <p className="card-text bg-success text-white text-center py-1">Available Now</p>
                ) : (
                    <p className="card-text bg-danger text-white text-center py-1">Unavailable</p>
                )}
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item list-group-item-secondary"><FaIndianRupeeSign className="text-success"/>{car.pricePerDay} <span> / day</span></li>
                <li className="list-group-item list-group-item-secondary">{car.brand}</li>
                <li className="list-group-item list-group-item-secondary">Seating Capacity : {car.seating_capacity}</li>
                <li className="list-group-item list-group-item-secondary">Fuel : {car.fuel_type}</li>
                <li className="list-group-item list-group-item-secondary">Transmission : {car.transmission}</li>
            </ul>
        </div>
    )
}
export default CarCard
