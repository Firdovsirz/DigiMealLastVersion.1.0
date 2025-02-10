import './App.css';
import Login from './pages/Login/Login';
import About from './components/About/About';
import UserQr from './pages/User/UserQr/UserQr';
import PrivateRoute from './pages/User/PrivateRoute';
import AdminLogin from './pages/Admin/AdminLogin/AdminLogin';
import UserHistory from './pages/User/UserHistory/UserHistory';
import UserSettings from './pages/User/UserSettings/UserSettings';
import ScannerHome from './pages/Scanner/ScannerHome/ScannerHome';
import ScannerLogin from './pages/Scanner/ScannerLogin/ScannerLogin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScannerHistory from './pages/Scanner/ScannerHistory/ScannerHistory';
import SuperAdminHome from './pages/Admin/SuperAdmin/SuperAdminHome/SuperAdminHome';
import AdminAdditionalInfo from './components/AdminAdditonalInfo/AdminAdditionalInfo';
import FacultyAdminApproved from "./pages/Admin/FacultyAdmin/FacultyApproved/FacultyApproved";
import SuperAdminApproved from './pages/Admin/SuperAdmin/SuperAdminApproved/SuperAdminApproved';
import FacultyAdminRegister from './pages/Admin/FacultyAdmin/FacultyAdminRegister/FacultyAdminRegister';
import SuperAdminConfirmUser from './pages/Admin/SuperAdmin/SuperAdminConfirmUser/SuperAdminConfirmUser';
import SuperAdminSessionEnded from "./pages/Admin/SuperAdmin/SuperAdminSessionEnded/SuperAdminSessionEnded";
import SuperAdminWaitingApproved from "./pages/Admin/SuperAdmin/SuperAdminWaitingApprove/SuperAdminWaitingApprove";
import FacultyAdminWaitingApproved from './pages/Admin/FacultyAdmin/FacultyAdminNotApproved/FacultyAdminWaitingApproved';
import SuperAdminFacultyApprovedContainer from './pages/Admin/SuperAdmin/SuperAdminFacultyApproved/SuperAdminFacultyApprovedContainer';
import SuperAdminAccount from './pages/Admin/SuperAdmin/SuperAdminAccount/SuperAdminAccount';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-page" element={<PrivateRoute element={UserQr} />} />
        <Route path="/user-page/history" element={<UserHistory />} />
        <Route path="/user-page/settings" element={<UserSettings />} />
        <Route path="/user-page/about" element={<About />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/fac-adm-reg" element={<FacultyAdminRegister />} />
        <Route path="/fac-adm-not-approved" element={<FacultyAdminWaitingApproved />} />
        <Route path="/fac-adm-approved" element={<FacultyAdminApproved />} />
        <Route path="/scanner-login" element={<ScannerLogin />} />
        <Route path="/scanner-home" element={<ScannerHome />} />
        <Route path="/super-admin-home" element={<SuperAdminHome />} />
        <Route path="/super-admin-waiting-approve" element={<SuperAdminWaitingApproved />} />
        <Route path="/super-admin-approved" element={<SuperAdminApproved />} />
        <Route path="/super-admin-session-ended" element={<SuperAdminSessionEnded />} />
        <Route path='/super-admin-account' element={<SuperAdminAccount />} />
        <Route
          path="/"
          element={<PrivateRoute element={<Login />} />}
        />
      </Routes>
    </>
  );
}

export default App;