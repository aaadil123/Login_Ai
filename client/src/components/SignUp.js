import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios'
import {toast} from 'react-hot-toast'


const SignUp = () => {
  const navigate = useNavigate();
  const[data, setData] = useState({
    name: '',
    email: '',
    password: '',
    image: ''
  })
    
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
    // console.log(data)
    const {name, email, password, image} = data;
    try{
        // const {data} = await axios.post('http://localhost:4000/signup', {name, email, password, image})
        const {data} = await axios.post(`${window.location.origin}/signup`, {name, email, password, image})
        if(data.error){
          toast.error(data.error)
        }
        else{
          setData({})
          toast.success(data.message)
          navigate('/login')
        }
    }catch(err){
        console.log(err);
    }
  }

  return (
    <div>
      <div className='bg-[#292A2C] h-screen pt-16'>
        <form onSubmit={submitHandler}>
          <div className='bg-[#1F1F1F] w-7/12 h-5/6 mx-auto rounded-lg flex flex-col items-center justify-center py-8 gap-4'>
            <h1 className='text-white text-4xl mb-6'>New User</h1>
            <div>                
                {
                    data.image === '' ?
                    <Webcam className='w-96'
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    videoConstraints={videoConstraints}
                    />:
                    <img src={data.image} name="image" value={data.image} />
                }
            </div>
            <div>
                {/* {
                    data.image === '' ?
                    <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all' onClick={(e) => {
                        e.preventDefault();
                        capture()}}>Capture Image</button>:
                    <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all'onClick={(e) => {
                        e.preventDefault();
                        setData(() => data.image = '');
                    }}>Retake Image</button>
                } */}
                <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all' onClick={(e) => {
                        e.preventDefault();
                        capture()}}>Capture Image</button>
            </div>
            <input className='px-4 py-1 bg-[#272728] rounded-sm mt-8'
            type="text"
            placeholder='Name'
            name="name"
            onChange={changeHandler}
            />
            <input className='px-4 py-1 bg-[#272728] rounded-sm'
            type="email"
            placeholder='Email'
            name="email"
            onChange={changeHandler}
            />
            <input className='px-4 py-1 bg-[#272728] rounded-sm'
            type="password"
            placeholder='Password'
            name="password"
            onChange={changeHandler}
            />
            <button className='px-4 py-1 bg-[#6a1c78] rounded-md text-gray-400 hover:bg-[#9526A9] hover:text-gray-300 transition-all mt-3' >Create Account</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp