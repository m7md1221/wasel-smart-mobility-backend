const express = require('express');
const usersController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");
const authentication = require("../middlewares/auth"); 
const router = express.Router();

//public (no authentication or autherization)
 router.post("/signup",validate(createUserSchema), usersController.signup);
  router.post("/login",usersController.login);

//protected (authentication and autherization)
 router.post("/",authentication.checkAuth,validate(createUserSchema), usersController.addUser);
 router.get("/:id",authentication.checkAuth,usersController.showUserInfo);
 router.get("/",authentication.checkAuth ,usersController.showAllUsers);
 router.put("/:id",authentication.checkAuth, validate(updateUserSchema), usersController.updateUser);
 router.delete("/:id",authentication.checkAuth,usersController.deleteUser);
 module.exports = router;


 


