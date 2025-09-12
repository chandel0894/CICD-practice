const authModel = require("../models/authModel")
const {v4: uuidV4} = require('uuid')
const brcypt = require('bcrypt')

const createNewUser = async (req, res) => {
    try {
        const {username, email, password, phone, user_type} = req.body

        // Validations
        if(!username){
            return res.status(400).json({message: 'Username is required'})
        }
        if(!email){
            return res.status(400).json({message: 'Email is required'})
        }
        if(!password){
            return res.status(400).json({message: 'Password is required'})
        }
        if(!phone){
            return res.status(400).json({message: 'Phone is required'})
        }
        if(!user_type){
            return res.status(400).json({message: 'User Type is required'})
        }

        // Check if user already exists
        const existingUser = await authModel.findOne({ email })
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        }

        const user_id = uuidV4()
        const hashedPassword = await brcypt.hash(password, 5)

        // Create new user
        const newUser = new authModel({
            user_id,
            username,
            email,
            password: hashedPassword,
            phone,
            user_type
        })

        await newUser.save()
        res.status(200).json({message: 'User created successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Signin user
const signinUser = async (req, res ) => {
    try {
        const {email, password} = req.body

        // Validations
        if(!email){
            return res.status(400).json({message: 'Email is required'})
        }
        if(!password){
            return res.status(400).json({message: 'Password is required'})
        }

        // Check if user exists
        const existingUser = await authModel.findOne({ email })
        if(!existingUser){
            return res.status(400).json({message: 'User does not exist'})
        }

        // Check if password is correct
        const isPasswordCorrect = await brcypt.compare(password, existingUser.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        res.status(200).json({ existingUser, message: 'User signed in successfully'})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = { createNewUser, signinUser }