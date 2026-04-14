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
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET, 
      { expiresIn: "2h" }
    );

  if (!user.is_active) {
  return res.status(403).json({
    message: "Account is inactive"
  });
}
    return res.status(200).json({
      message: "Authentication successful",
      token
    });
  }catch(error){
    return res.status(500).json({
      message: "Error during authentication",
      error: error.message
    });
  }
} 

async function addUser(req, res) {
  try {
    const { name, email, password, role, confidence_score, is_active, is_authorized } = req.body;

    // Hash password like in signup
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || roles.CITIZEN,
      confidence_score,
      is_active,
      is_authorized
    });

    // Don't return password in response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("[User] Error creating user:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
}

async function showUserInfo(req,res){
  try{
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }
    const user = await User.findByPk(id);
    if(!user){
      return res.status(404).json({
        message : "User not found"
      });
    }
    // Don't return password
    const userResponse = user.toJSON();
    delete userResponse.password;
    res.status(200).json(userResponse);
  } catch(error){
    console.error("[User] Error fetching user info:", error);
    res.status(500).json({
      message : "Error fetching user info",
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
      // Don't return passwords
      const safeUsers = users.map(u => {
        const userObj = u.toJSON();
        delete userObj.password;
        return userObj;
      });
      res.status(200).json(safeUsers);
  } catch(error){
    console.error("[User] Error fetching users:", error);
    res.status(500).json({
      message : "Error fetching users",
      error : error.message
    });
  }
}
async function updateUser(req,res){
  try{
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }
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
    for (const key of Object.keys(req.body)) {
      // Don't allow direct password update through this endpoint
      if (key === "password") {
        continue;
      }
      if (req.body[key] !== undefined) {
        updatedData[key] = req.body[key];
      }
    }
    
    updatedData.updated_at = new Date();
    await user.update(updatedData);
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    return res.status(200).json({
      message: "User updated successfully",
      user: userResponse
    });
  } catch(error){
    console.error("[User] Error updating user:", error);
    res.status(500).json({
      message : "Error updating user",
      error : error.message
    });
  }
}

async function deleteUser(req,res){
  try{
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }
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
  } catch(error){
    console.error("[User] Error deleting user:", error);
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });
  }
}
async function deactivateUser(req,res){
   try{
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }
    const user = await User.findByPk(id);
    if(!user){
      return res.status(404).json({
        message : "User not found"
      });
    }
    if(user.is_active === false){
      return res.status(400).json({
        message : "User is already deactivated"
      });
    }
    await user.update({ is_active: false, updated_at: new Date() });
    res.status(200).json({
      message : "User deactivated successfully"
    });
  } catch(error){
    console.error("[User] Error deactivating user:", error);
    return res.status(500).json({
      message: "Error deactivating user",
      error: error.message
    });
  }
}
  async function activateUser(req,res){
   try{
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    } 
    const user = await User.findByPk(id);
    if(!user){
      return res.status(404).json({
        message : "User not found"
      });
    }
    if(user.is_active === true){
      return res.status(400).json({
        message : "User is already active"
      });
    }
    await user.update({ is_active: true, updated_at: new Date() });
    res.status(200).json({
      message : "User activated successfully"
    });
  } catch(error){
    console.error("[User] Error activating user:", error);
    return res.status(500).json({
      message: "Error activating user",
      error: error.message
    });
  }
}
module.exports = { addUser, showUserInfo, showAllUsers, updateUser, deleteUser, deactivateUser, activateUser, signup, login };