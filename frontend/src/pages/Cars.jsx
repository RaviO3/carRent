import Title from "../components/Title"
import { useContext, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AppContext } from "../context/appContextObject"
import CarCard from "../components/CarCard"

const Cars=()=>{
    const [searchParams]=useSearchParams()
    const initialSearch=searchParams.get("location") || ""
    const [input,setInput]=useState(initialSearch)
    const {cars} = useContext(AppContext)
    const filteredCars=useMemo(()=>cars.filter((car)=>{
        const selectedLocation=searchParams.get("location") || ""
        const text=`${car.brand} ${car.category} ${car.fuel_type} ${car.transmission} ${car.location}`.toLowerCase()
        const matchesText=text.includes(input.toLowerCase())
        const matchesLocation=!selectedLocation || car.location?.toLowerCase().includes(selectedLocation.toLowerCase())
        return matchesText && matchesLocation
    }),[cars,input,searchParams])

    return(
        <div className="container mt-5">
            <Title title='Available Cars' subTitle='Browse our premium section of vehicles available for your next adventure'/>
            <div className="mt-3">
                <form onSubmit={(e)=>e.preventDefault()}>
                    <div className="my-3">
                        <input type="text" className="form-control" placeholder="Search by make, location, fuel, or features" onChange={(e)=>setInput(e.target.value)} value={input} />
                    </div>
                    <div className="my-3">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button className="btn btn-dark">Search</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="mt-5">
                <p>Showing {filteredCars.length} Cars</p>
                {searchParams.get("pickupDate") && searchParams.get("returnDate") && (
                    <p className="text-muted">Selected dates: {searchParams.get("pickupDate")} to {searchParams.get("returnDate")}</p>
                )}
                <div className="row gy-3">
                    {
                        filteredCars.map((car)=>(
                            <div key={car._id} className="col-lg-4">
                                <CarCard car={car}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Cars
