const express = require('express');
const usersController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");
const authentication = require("../middlewares/auth"); 
const authorization = require("../middlewares/rolesAuthorize");
const router = express.Router();
//public (no authentication or autherization)
 router.post("/signup",validate(createUserSchema), usersController.signup);
  router.post("/login",usersController.login);
//authenticated users
router.get("/myprofile",authentication.checkAuth,usersController.showProfile); 
//protected (authentication and autherization)
 router.put("/:id",authentication.checkAuth, authorization.authorizeRole("ADMIN","CITIZIN"),validate(updateUserSchema), usersController.updateUser);
 
//admin only 
 router.post("/",authentication.checkAuth,authorization.authorizeRole("ADMIN"),validate(createUserSchema), usersController.addUser);
 router.delete("/:id",authentication.checkAuth,authorization.authorizeRole("ADMIN"),usersController.deleteUser);
router.post("/deactivate/:id",authentication.checkAuth,authorization.authorizeRole("ADMIN"),usersController.deactivateUser);
router.post("/activate/:id",authentication.checkAuth,authorization.authorizeRole("ADMIN"),usersController.activateUser);
//admin and moderator 
 router.get("/:id",authentication.checkAuth,authorization.authorizeRole("ADMIN","MODERATOR"),usersController.showUserInfo);
 router.get("/",authentication.checkAuth,authorization.authorizeRole("ADMIN","MODERATOR"),usersController.showAllUsers);

 module.exports = router;


 















