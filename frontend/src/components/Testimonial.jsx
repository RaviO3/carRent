import { testimonials } from "../assets/assets";
const Testimonial=()=>{
    return(
        <div className="mt-5 container testimonial-section">
            <h2 className="text-center">What Our Customers Say</h2>
            <div className="container mt-5">
                <div className="row gy-4">
                    {
                        testimonials.map((data)=>{
                            return(
                                <div className="col-lg-3" key={data._id}>
                                    <div className="card-test h-100 text-center">
                                        <img src={data.image} alt={data.name} className="image-testimonial" />
                                        <div className="testimonial-content">
                                            <h5>{data.name}</h5>
                                            <p>{data.comment}</p>
                                        </div>
                                        <div className="testimonial-rating">Rating: {data.rating}/5</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default Testimonial
