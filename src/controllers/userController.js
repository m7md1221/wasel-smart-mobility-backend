const User = require('../models/userModel');
const roles = require('../constants/roles'); 
async function addUser(req, res) {
  try {
    //signup validation 
    
    // 1- validation for personal info 
    const { name, email, password, role, confidence_score, is_active, is_authorized } = req.body;
    if (!name || !email || !password) { 
      return res.status(400).json({ message: "name, email, and password are required" });
    }
  //2- role validation
    if (role) {
  const ROLE = role.toUpperCase(); // convert input to uppercase
  if (![roles.CITIZEN, roles.MODERATOR].includes(ROLE)) {
    return res.status(400).json({ 
      message: "Invalid role. Allowed values are CITIZEN, MODERATOR" 
    });
  }
}

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      confidence_score: confidence_score || 0,
      is_active: is_active ?? true,
      is_authorized: is_authorized ?? false
    });

    res.status(200).json({
      message: "User created successfully",
      user
    });

  } catch (error) { // error handling for user creation 
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
  const updatedData =  
  { name: req.body.name,
 email: req.body.email,
 password: req.body.password,
  role: req.body.role,
   confidence_score: req.body.confidence_score,
    is_active: req.body.is_active,
     is_authorized: req.body.is_authorized,
    updated_at: new Date() };
  const user = await User.findByPk(id) ; 
  if(!user){
    return res.status(404).json({
      message : "User not found"
    });
  }
  await user.update(updatedData);
  res.status(200).json({
    message : "User updated successfully",
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
  }
}
module.exports = { addUser, showUserInfo, showAllUsers, updateUser, deleteUser };