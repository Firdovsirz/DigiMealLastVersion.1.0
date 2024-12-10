import './App.css';
import Login from './pages/Login/Login';
import Scanner from "./pages/Scanner/Scanner";
import Header from './components/Header/Header';
import UserQr from './pages/User/UserQr/UserQr';
import LoginError from './pages/Login/LoginError/LoginError';
import UserHistory from './pages/User/UserHistory/UserHistory';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LanguageChanger from './components/LanguageChanger/LanguageChanger';
import BottomNavigation from './components/BottomNavigation/BottomNavigation';
import FacultyAdminAside from './pages/Admin/FacultyAdmin/FacultyAdminAside/FacultyAdminAside';
import About from './components/About/About';
import AdminLogin from './pages/Admin/AdminLogin/AdminLogin';
import FacultyAdminRegister from './pages/Admin/FacultyAdmin/FacultyAdminRegister/FacultyAdminRegister';

function App() {

  return (
    <>
      {/* <LanguageChanger /> */}
      {/* <Login /> */}
      {/* <Header /> */}
      {/* <UserQr /> */}
      {/* <FacultyAdminAside /> */}
      {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-page" element={<UserQr />} />
        <Route path="/user-history" element={<UserHistory />} />
      </Routes> */}
      {/* <AdminLogin /> */}
      {/* <LoginError /> */}
      {/* <Scanner /> */}
      {/* <BottomNavigation /> */}
      {/* <About /> */}
      <FacultyAdminRegister />
      {/* <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/fac-adm-reg' element={<FacultyAdminRegister />} />
      </Routes> */}
    </>
  )
}

export default App;
