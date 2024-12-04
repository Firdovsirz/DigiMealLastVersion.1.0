import './App.css';
import Login from './pages/Login/Login';
import Scanner from "./pages/Scanner/Scanner";
import Header from './components/Header/Header';
import UserQr from './pages/User/UserQr/UserQr';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LanguageChanger from './components/LanguageChanger/LanguageChanger';
import FacultyAdminAside from './pages/Admin/FacultyAdmin/FacultyAdminAside/FacultyAdminAside';
import LoginError from './pages/Login/LoginError/LoginError';
import BottomNavigation from './components/BottomNavigation/BottomNavigation';

function App() {

  return (
    <>
      {/* <LanguageChanger /> */}
      {/* <Login /> */}
      {/* <Header /> */}
      {/* <UserQr /> */}
      {/* <FacultyAdminAside /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-page" element={<UserQr />} />
      </Routes>
      {/* <LoginError /> */}
      {/* <Scanner /> */}
      {/* <BottomNavigation /> */}
    </>
  )
}

export default App
