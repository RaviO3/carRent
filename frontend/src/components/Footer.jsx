import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquareWhatsapp } from "react-icons/fa6";
const Footer=()=>{
    return(
        <div className="footer mt-5 bg-dark text-white p-3">
            <div className="container">
                <div className="row gy-3">
                    <div className="col-lg-3">
                        <h5 className="text-danger">carRent</h5>
                        <p>Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.</p>
                        <div>
                            <FaFacebookSquare className="footer-icons"/>
                            <FaSquareInstagram className="footer-icons"/>
                            <FaSquareXTwitter className="footer-icons"/>
                            <FaSquareWhatsapp className="footer-icons"/>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <h5>Quick Links</h5>
                        <p>Home</p>
                        <p>Browse Cars</p>
                        <p>About Us</p>
                    </div>
                    <div className="col-lg-3">
                        <h5>Resources</h5>
                        <p>Help Center</p>
                        <p>Terms of Services</p>
                        <p>Privacy Policy</p>
                        <p>Insurance</p>
                    </div>
                    <div className="col-lg-3">
                        <h5>Contact</h5>
                        <p>1234, Phase-8</p>
                        <p>Mohali</p>
                        <p>+91-9876543210</p>
                        <p>info@gmail.com</p>
                    </div>
                </div>
            </div>
            <hr />
            <p className="text-center">Copyright 2026 carRent. All rights reserved.</p>
        </div>
    )
}
export default Footer
