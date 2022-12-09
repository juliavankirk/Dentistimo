import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import HomePage from './modules/HomePage';
import OfficeDashboard from './modules/dashboards/OfficeDashboard';
import UserDashboard from './modules/dashboards/UserDashboard';
import DentistDashboard from './modules/dashboards/DentistDashboard';
import MainLayout from './layouts/MainLayout/MainLayout';
import Register from './modules/auth/Register';
import RegisterClinic from './modules/auth/RegisterClinic';
import RegisterDoctor from './modules/auth/RegisterDoctor';

import Login from './modules/auth/Login';
import NotFound from './modules/NotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>      
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/register-clinic' element={<RegisterClinic />} />
            <Route path='/register-doctor' element={<RegisterDoctor />} />
            <Route path='/login' element={<Login />} />
            <Route path='/office-dashboard' element={<OfficeDashboard />} />
            <Route path='/user-dashboard' element={<UserDashboard />} />
            <Route path='/dentist-dashboard' element={<DentistDashboard />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
