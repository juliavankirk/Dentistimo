import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import HomePage from './layouts/HomePage';
import OfficeDashboard from './layouts/OfficeDashboard';
import UserDashboard from './layouts/UserDashboard';
import DentistDashboard from './layouts/Dentist/DentistDashboard';
import MainLayout from './layouts/MainLayout/MainLayout';
import Register from './layouts/Register';
import NotFound from './layouts/NotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>      
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
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
