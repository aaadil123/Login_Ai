import React, {useState, useContext} from 'react'
import './Login.css'
import { GiHumanTarget } from "react-icons/gi";
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext'

const Login = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();
  const[data, setData] = useState({
    email: '',
    image: ''
  })

  function changeHandler(e){
    e.preventDefault();
    const {name, value} = e.target;
    setData( (prevData) => {
      return{
        ...prevData,
        [name]: value
      }
    })
  }

  async function submitHandler(e){
    e.preventDefault();
    const {email, image} = data;
    try{
      // const {data} = await axios.post('http://localhost:4000/login', {
      const {data} = await axios.post(`${window.location.origin}/login`, {
        email, image
      });
      console.log(data)
      if(data.error){
        toast.error(data.error);
      }
      else{
        setData({});
        setIsLoggedIn(true);
        toast.success("Login Successful");
        navigate('/dashboard');
      }
    }catch(err){
      console.log(err);
    }
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setData((prevData) => {
        return{
          ...prevData, image: imageSrc
        }
      })
    },[webcamRef]
  );

  return (
    <div className='bg-[#292A2C] h-screen overflow-hidden flex mx-auto'>
        <div className='w-80% h-90% flex flex-wrap mx-auto p-16'>
            {/* Login */}
            <form onSubmit={submitHandler}>
              <div className='bg-[#1F1F1F] w-96 h-[70vh] flex flex-col justify-center items-center rounded-l-2xl gap-6'>
                  <h1 className='text-white text-4xl mb-6'>Log In</h1>
                  <Link to='/signup'>                  
                    <p className='text-white'>New user? <span className='text-blue-400'>Create an account</span></p>
                  </Link>
                  <input className='px-4 py-1 bg-[#272728] rounded-sm'
                  type="email"
                  placeholder='Email'
                  name="email"
                  onChange={changeHandler}
                  />
                  
                  {
                    data.image === '' ?
                    <Webcam className='w-64'
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    videoConstraints={videoConstraints}
                    />
                    :
                    <img src={data.image} />
                  }
                  
                  <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all' onClick={(e) => {
                        e.preventDefault();
                        capture()}}>
                          Capture Image
                  </button>
                  <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all'>Signin</button>
              </div>
            </form>

            {/* Hello friends */}
            <div className='right-card flex flex-col justify-center items-center w-96 h-[70vh] rounded-r-2xl gap-3'>
                <GiHumanTarget className='text-white h-16 w-16' />
                <h1 className='text-3xl text-white'>Hello</h1>
            </div>
        </div>
    </div>
  )
}

export default Login