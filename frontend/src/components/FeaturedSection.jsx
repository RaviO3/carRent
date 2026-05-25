import {useNavigate} from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../context/appContextObject"
import CarCard from "./CarCard"
import Title from "./Title"

const FeaturedSection=()=>{
    const navigate=useNavigate()
    const {cars} = useContext(AppContext)
    const featuredImages=["car1.jpg","car15.jpg","car3.jpg","car4.jpg","car20.jpg","car23.jpg"]
    const carsWithImages=cars.filter((car)=>car.image)
    const topCars=featuredImages
        .map((fileName)=>carsWithImages.find((car)=>car.image?.includes(fileName)))
        .filter(Boolean)

    if(topCars.length < 6){
        carsWithImages.forEach((car)=>{
            if(topCars.length < 6 && !topCars.some((item)=>item._id===car._id)){
                topCars.push(car)
            }
        })
    }

    return(
        <div className="container mt-5">
            <div>
                <Title title={'Featured Vehicle'} subTitle={'Explore our selection of premium vehicles available for your next adventure'}/>
            </div>
            <div className="row">
                {
                    topCars.map((car)=>(
                        <div key={car._id} className="col-lg-4">
                            <CarCard car={car}/>
                        </div>
                    ))
                }
            </div>
            <div className="mt-3">
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button className="btn btn-primary me-md-2" onClick={()=>navigate('/cars')}>Explore All Cars</button>
                </div>
            </div>
        </div>
    )
}
export default FeaturedSection
