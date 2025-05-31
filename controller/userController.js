import validator from "validator";
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Somthing is missing"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email"
            })
        }

        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        let pwd = await bcrypt.genSalt(10);
        let hashpwd = await bcrypt.hash(password, pwd)

        let newUser = await new userModel({
            name: name,
            email: email,
            password: hashpwd
        });
        newUser.save();
        const userWithOutpwd = await userModel.findById(newUser._id).select("-password")
        return res.status(200).json({
            success: true,
            message: "User Sign in successfully",
            userWithOutpwd
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a vaild email'
            })
        }

        const exist = await userModel.findOne({ email });
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        const matchPwd = await bcrypt.compare(password, exist.password);
        if (!matchPwd) {
            return res.status(400).json({
                success: false,
                message: 'Password Incorrect'
            })
        }

        const token = createToken(exist._id);
        const userWithoutPassword = await userModel.findById(exist._id).select('-password');

        return res.status(200).json({
            success: true,
            userWithoutPassword,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        })

    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const AdminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.status(200).json({
                success : true,
                message : "Login successfully",
                token
            });
        } else {
            return res.status(400).json({
                success : false,
                message : "Invalid credential",
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export { Register, Login, AdminLogin }