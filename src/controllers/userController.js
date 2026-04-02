const User = require('../models/userModel');
const roles = require('../constants/roles'); 
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
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
      role: role || roles.ADMIN, // ✅ أهم تعديل
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

  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
}
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
      { expiresIn: "1h" }
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
    //signup validation 

    const { name, email, password, role, confidence_score, is_active, is_authorized } = req.body;
 


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      password,
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
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }
    if (Object.keys(req.body).length === 0) {
  const id = parseInt(req.params.id);
   if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No data provided for update"
      });
    }
    const user = await User.findByPk(id);
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