import { useState, useEffect } from 'react'
import './App.css'
import {Routes, Route, useLocation} from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
import { AppContainer } from './styled';
import { ToastContainer } from 'react-toastify'; // Make sure this is imported
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    // Check if there's anything after the initial slash
    setShowNavigation(location.pathname !== '/');
  }, [location.pathname]);
  return (
    <AppContainer>
      {showNavigation && <Navigation />}
     <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/tasks" element={<TaskManagement/>} />
        <Route path="/users" element={<UserManagement/>} />
        <Route path="*" element={<NotFound/>} />
     </Routes>
     <ToastContainer />
    </AppContainer>
  )
}

export default App
