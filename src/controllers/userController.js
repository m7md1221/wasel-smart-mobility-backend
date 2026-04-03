const User = require('../models/userModel');
const roles = require('../constants/roles'); 
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function signup(req,res){
  const userEmail = await User.findOne({ where: { email: req.body.email } });
  if (userEmail) {
    return res.status(400).json({
      message: "User with this email already exists"
    });
  }
  try {
    const {
      name,
      email,
      password,
      role,
      confidence_score,
      is_active,
      is_authorized
    } = req.body;
     const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

const user = await User.create({
      name,
      email,
      password: hashedPassword, 
      role,
      confidence_score,
      is_active,
      is_authorized
    });

    return res.status(201).json({
      message: "User created successfully"
    });

}catch(error){
  res.status(500).json({
     message: "Error creating user",
      error: error.message,
      stack: error.stack
  })

}
  }

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check if account is active FIRST
    if (!user.is_active) {
      return res.status(403).json({
        message: "Account is inactive"
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured in environment variables");
      return res.status(500).json({
        message: "Server configuration error",
        error: "JWT_SECRET not configured"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }catch(error){
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Error during authentication",
      error: error.message
    });
  }
} 

async function addUser(req, res) {
  try {
    //signup validation 

    const { name, email, password, role, confidence_score, is_active, is_authorized } = req.body;
 


    const user = await User.create({
      name,
      email,
      password,
      role: role || roles.CITIZEN,
      confidence_score,
      is_active,
      is_authorized
    });

    res.status(200).json({
     message: "User created successfully",
      user
    });

  }
   catch (error) { // error handling for user creation 
    console.error(error); 
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      stack: error.stack
    });
  }
}

async function showUserInfo(req,res){
  try{
  const id = parseInt(req.params.id);
  const user = await User.findByPk(id);
  if(!user){
    return res.status(404).json({
      message : "User not found"
    });
  }
  res.status(200).json(user);
}
catch(error){
  res.status(500).json({
    message : "something went wrong while fetching user info",
    error : error.message
  });
}
}
async function showAllUsers(req,res){
  try{
      const users = await User.findAll();
      if(users.length === 0){
        return res.status(404).json({
          message : "No users found"
        });
      }
      res.status(200).json(users);
  }catch(error){
    res.status(500).json({
    message : "something went wrong while fetching users info",
    error : error.message
  });
  }
}
async function updateUser(req,res){
  try{
  const id = parseInt(req.params.id);
   if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No data provided for update"
      });
    }
const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

   const updatedData = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        updatedData[key] = req.body[key];
      }
    });
    updatedData.updated_at = new Date();
    await user.update(updatedData);
    return res.status(200).json({
      message: "User updated successfully",
      user
    });
}
  
catch(error){
    res.status(500).json({
      message : "something went wrong while updating user info",
      error : error.message
    });
  }
}

async function deleteUser(req,res){
  try{
  const id = parseInt(req.params.id);
  const user = await User.findByPk(id);
  if(!user){
    return res.status(404).json({
      message : "User not found"
    });
  }
  await user.destroy();
  res.status(200).json({
    message : "User deleted successfully"
  });

  }catch(error){
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });
  }
}
module.exports = { addUser, showUserInfo, showAllUsers, updateUser, deleteUser,signup,login };