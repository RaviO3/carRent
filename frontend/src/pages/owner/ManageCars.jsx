import {useContext, useEffect, useState } from "react"
import Title from "../../components/owner/Title"
import { MdDelete } from "react-icons/md"
import API from "../../api"
import { AppContext } from "../../context/appContextObject"
import { getImageUrl } from "../../utils/imageUrl"

const ManageCars=()=>{
    const [cars,setCars]=useState([])
    const [error,setError]=useState("")
    const {backendUrl,showMessage}=useContext(AppContext)

    useEffect(()=>{
        let ignore=false
        const fetchOwnerCars=async()=>{
            try{
                const res=await API.get("/cars/owner-cars")
                if(!ignore && res.data.success){
                    setError("")
                    setCars(res.data.cars)
                }
                else if(!ignore){
                    setError(res.data.message || "Cars could not be loaded")
                }
            }
            catch(error){
                console.log(error)
                if(!ignore){
                    setError(error.response?.data?.message || error.message)
                }
            }
        }
        fetchOwnerCars()
        return ()=>{ignore=true}
    },[])

    const deleteCar=async(id)=>{
        if(!confirm("Delete this car?")) return
        try{
            const res=await API.delete(`/cars/${id}`)
            showMessage(res.data.message,res.data.success ? "success" : "error")
            if(res.data.success){
                setCars((prev)=>prev.filter((car)=>car._id !== id))
            }
        }
        catch(error){
            showMessage(error.response?.data?.message || error.message,"error")
        }
    }

    return(
        <>
            <div className="owner-page-title">Manage Car Details</div>
            <div className="container mt-5">
                <Title title='Manage Cars' subTitle='View all listed cars, update details, or remove old records from the platform.'/>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-panel table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cars.map((car)=>(
                                    <tr key={car._id}>
                                        <td>
                                            <img src={getImageUrl(car.image, backendUrl)} alt={car.brand} className="image-car-dashboard" />
                                            <div>
                                                <p>{car.brand}</p>
                                            </div>
                                        </td>
                                        <td>
                                            {car.category}
                                        </td>
                                        <td>
                                            {
                                                car.pricePerDay
                                            }
                                        </td>
                                        <td>
                                            {car.isAvailable?<span className="status-pill success">Available</span>:<span className="status-pill danger">Booked</span>}
                                        </td>
                                        <td>
                                            <MdDelete style={{cursor:"pointer",color:"red"}} onClick={()=>deleteCar(car._id)}/>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>    
        </>
    )
}
export default ManageCars
