
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        try {
            const user = await User.create({ 
                name, 
                email, 
                password, 
                role: 'donor' 
            });
            res.status(201).json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                token: generateToken(user.id, user.role) 
            });
        } catch (createError) {
            if (createError.name === 'MongoServerError' && createError.code === 11000 && createError.keyPattern?.username) {
                console.log('Handling duplicate username error...');
                
                const userDoc = new User({
                    name,
                    email,
                    password,
                    role: 'donor'
                });
                
                const salt = await bcrypt.genSalt(10);
                userDoc.password = await bcrypt.hash(password, salt);
                
                const db = mongoose.connection.db;
                const result = await db.collection('users').insertOne({
                    name,
                    email,
                    password: userDoc.password,
                    role: 'donor'
                });
                
                const newUser = await User.findOne({ _id: result.insertedId });
                
                res.status(201).json({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    token: generateToken(newUser.id, newUser.role)
                });
            } else {
                throw createError;
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`Login failed: User with email ${email} not found`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        console.log(`User found: ${user.name}, role: ${user.role}, password exists: ${!!user.password}`);
        console.log(`Password from request: ${password}, password length: ${password.length}`);
        
        console.log(`Password hash in database: ${user.password.substring(0, 10)}...`);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result: ${isMatch}`);
        
        if (isMatch) {
            console.log('Password matched successfully');
            
            const token = generateToken(user.id, user.role);
            
            return res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                token: token
            });
        } else {
            console.log('Password comparison failed');
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, university, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({ 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            university: updatedUser.university, 
            address: updatedUser.address, 
            role: updatedUser.role,
            token: generateToken(updatedUser.id, updatedUser.role) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
