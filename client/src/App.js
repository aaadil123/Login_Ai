import "./App.css";
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import PrivateRoute from "./components/PrivateRoute";
import axios from 'axios';
import {Toaster} from 'react-hot-toast'


function App() {
  return (
    <div className="app">
      <Navbar/>
      <Toaster position="bottom-right" toastOptions={{duration: 2000}}/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/dashboard' element=
          {            
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>            
          }
        />
      </Routes>
    </div>
  );
}

export default App;
