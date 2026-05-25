import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Title from "../../components/owner/Title"
import API from "../../api"
import { AppContext } from "../../context/appContextObject"

const AddCar=()=>{
    const navigate=useNavigate()
    const {showMessage}=useContext(AppContext)
    const [imagePreview,setImagePreview]=useState("")
    const [car,setCar]=useState({
        brand:"",
        model:"",
        image:"",
        year:"",
        pricePerDay:"",
        category:"",
        transmission:"",
        fuel_type:"",
        seating_capacity:"",
        location:"",
        description:""
    })

    const handleImageChange=(e)=>{
        const file=e.target.files?.[0]
        if(!file) return
        if(file.size > 5 * 1024 * 1024){
            showMessage("Image must be smaller than 5MB","error")
            e.target.value=""
            return
        }
        const reader=new FileReader()
        reader.onload=()=>{
            const imageData=reader.result
            setImagePreview(imageData)
            setCar((prev)=>({...prev,image:"",imageData}))
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const payload={
                ...car,
                brand:car.model ? `${car.brand} ${car.model}`.trim() : car.brand,
                year:Number(car.year),
                pricePerDay:Number(car.pricePerDay),
                seating_capacity:Number(car.seating_capacity)
            }
            const res=await API.post("/cars/add", payload)
            showMessage(res.data.message,res.data.success ? "success" : "error")
            if(res.data.success){
                navigate("/owner/managecar")
            }
        }
        catch(error){
            showMessage(error.response?.data?.message || error.message,"error")
        }
    }

    return(
        <>
            <div className="owner-page-title">Add Car Details</div>
            <div className="container mt-5">
                <Title title='Add New Car' subTitle='Fill in details to list a new car for booking, including price, availability and specifications.'/>
                <form onSubmit={handleSubmit} className="form-panel">
                    <div className="my-3">
                        <label>Upload Car Image</label>
                        <input type="file" className="form-control" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
                    </div>
                    <div className="my-3">
                        <label>Or Car Image URL</label>
                        <input type="url" className="form-control" placeholder="https://example.com/car.jpg" value={car.image} onChange={e=>setCar({...car,image:e.target.value,imageData:""})} required={!car.imageData} />
                    </div>
                    {(imagePreview || car.image) && (
                        <div className="my-3">
                            <img src={imagePreview || car.image} alt="Car preview" className="img-fluid rounded" style={{maxHeight:"240px",objectFit:"cover"}} />
                        </div>
                    )}
                    <div className="my-3">
                        <div className="row">
                            <div className="col-lg-6">
                                <label>Brand</label>
                                <input type="text" className="form-control" placeholder="e.g. BMW,Audi..." value={car.brand} onChange={e=>setCar({...car,brand:e.target.value})} required />
                            </div>
                            <div className="col-lg-6">
                                <label>Model</label>
                                <input type="text" className="form-control" placeholder="e.g. X5,E-Class..." value={car.model} onChange={e=>setCar({...car,model:e.target.value})} />
                            </div>
                        </div>
                    </div>
                    <div className="my-3">
                        <div className="row">
                            <div className="col-lg-4">
                                <label>Year</label>
                                <input type="number" className="form-control" placeholder="2026" value={car.year} onChange={e=>setCar({...car,year:e.target.value})} required />
                            </div>
                            <div className="col-lg-4">
                                <label>Daily Price</label>
                                <input type="number" className="form-control" placeholder="2000" value={car.pricePerDay} onChange={e=>setCar({...car,pricePerDay:e.target.value})} required min="1" />
                            </div>
                            <div className="col-lg-4">
                                <label>Category</label>
                                <select className="form-select" onChange={e=>setCar({...car,category:e.target.value})} value={car.category} required>
                                    <option value="">Select Category</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="my-3">
                        <div className="row">
                            <div className="col-lg-4">
                                <label>Transmission</label>
                                <select className="form-select" onChange={e=>setCar({...car,transmission:e.target.value})} value={car.transmission} required>
                                    <option value="">Select a transmission</option>
                                    <option value="automatic">Automatic</option>
                                    <option value="manual">Manual</option>
                                    <option value="semi-automatic">Semi-Automatic</option>
                                </select>
                            </div>
                            <div className="col-lg-4">
                                <label>Fuel Type</label>
                                <select className="form-select" onChange={e=>setCar({...car,fuel_type:e.target.value})} value={car.fuel_type} required>
                                    <option value="">Select a fuel type</option>
                                    <option value="gas">Gas</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="col-lg-4">
                                <label>Seating Capacity</label>
                                <input type="number" className="form-control" placeholder="2" value={car.seating_capacity} onChange={e=>setCar({...car,seating_capacity:e.target.value})} required min="1" />
                            </div>
                        </div>
                    </div>
                    <div className="my-3">
                        <div className="row">
                            <div className="col-lg-12">
                                <label>Location</label>
                                <select className="form-select" onChange={e=>setCar({...car,location:e.target.value})} value={car.location} required>
                                    <option value="">Select a location</option>
                                    <option value="mohali">Mohali</option>
                                    <option value="chandigarh">Chandigarh</option>
                                    <option value="panchkula">Panchkula</option>
                                </select>
                            </div>
                        </div>
                    </div> 
                    <div className="my-3">
                        <div className="row">
                            <div className="col-lg-12">
                                <label>Description</label>
                                <textarea className="form-control" placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." value={car.description} onChange={e=>setCar({...car,description:e.target.value})}></textarea>
                            </div>
                        </div>              
                    </div> 
                    <div className="my-3">
                        <button type="submit" className="btn btn-success px-4">List Your Car</button> 
                    </div>    
                </form>
            </div>
        </>
    )
}
export default AddCar
