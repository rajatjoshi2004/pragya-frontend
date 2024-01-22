import FamilyDetails from "./Pages/FormDetails";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminServices from "./Pages/adminService";
import MemberLists from "./Pages/memberLists";
import AdminList from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import PrivateRoute from "./helpers/PrivateRoute";

function App() {
  return (
   
    <BrowserRouter basename="/Jaipur">
      <Toaster />
      <Routes>
        <Route path="/" element={<FamilyDetails />} />
        <Route path="/Services" element={<AdminServices />} />
        <Route path="/Memberlist" element={<MemberLists />} />
        <Route path="/Admin" element={<Admin/>} />
        <Route path="/Admin/Dashboard" element={<PrivateRoute component ={<AdminList/>}/>} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
