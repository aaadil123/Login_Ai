const User = require('../models/schema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const {faceDetect} = require('./Faceapi') ;
const faceapi = require('face-api.js');

// test
const test = (req, res) => {
    res.json('test is working')
}

// register user
const register = async (req, res) => {
    try{
        const {name, email, password, image} = req.body;
        // validation
        if(!name){
            return res.json({
                error: 'Name is required'
            })
        }
        if(!password || password.length < 7){
            return res.json({
                error: "Password is required and should be atleast 7 characters long"
            })
        }
        if(!image){
            return res.json({
                error: "Image is required"
            })
        }
        const exist = await User.findOne({email});
        if(exist){
            res.json({
                error: 'Email already registered'
            })
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing"
            })
        }

        const user = await User.create(
            { name, email, password: hashedPassword, image }
        )
        return res.status(200).json({
            success: true,
            message: "User created successfully"
        })
    }catch(err){
        console.log(err);
    }
}

// login
const login = async (req, res) => {
    try{
        const {email, image} = req.body;
        if(!email || !image){
            return res.json({
                error: 'Enter all details'
            })
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "User doesn't exist"
            })
        }
        

        const loadModels = async () => {
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('./models')
            ])
        }
        
        const faceDetect = async (img1, img2) => {
            let refImg1 = await faceapi.detectSingleFace(img1)
            let refImg2 = await faceapi.detectSingleFace(img2)
        
            // const canvas = 
            let faceMatcher = new faceapi.faceMatcher(refImg1)
            refImg2 = faceapi.resizeResults(refImg2, img2)
            
            const {detection, descriptor} = refImg2
            let label = faceMatcher.findBestMatch(descriptor).toString();
            return label;
        }

        const label = faceDetect(image, user.image)
        console.log("label->", label);

        payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        }
        if(label){
            let token = jwt.sign(payload, process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            },
            (err, token) => {
                if(err) throw err;
            })
            
            res.cookie('tokenCookie', token).json(user);
            
        }
        else{
            return res.json({
                error: "Wrong Password"
            })
        }
    }catch(err){}
}

const getProfile = () => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user);
        })
    } else{
        res.json(null)
    }
}

module.exports = {
    test,
    register,
    login,
    getProfile
}