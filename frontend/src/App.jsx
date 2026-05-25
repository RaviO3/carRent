import {Routes,Route} from 'react-router-dom'
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import MessageToast from './components/MessageToast';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';

const App=()=>{
  return(
    <div>
      <MessageToast/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/car-detail/:id' element={<CarDetails/>} />
        <Route path='/cars' element={<Cars/>} />
        <Route path='/my-bookings' element={<ProtectedRoute><MyBookings/></ProtectedRoute>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/owner/dashboard' element={<ProtectedRoute role="owner"><Dashboard/></ProtectedRoute>} />
        <Route path='/owner/addcar' element={<ProtectedRoute role="owner"><AddCar/></ProtectedRoute>} />
        <Route path='/owner/managecar' element={<ProtectedRoute role="owner"><ManageCars/></ProtectedRoute>} />
        <Route path='/owner/managebookings' element={<ProtectedRoute role="owner"><ManageBookings/></ProtectedRoute>} />
      </Routes>
      <Footer/>
    </div>
  )
}
export default App
