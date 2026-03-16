 const express = require('express');
 const usersController = require("../controllers/userController");
 const router = express.Router();
 router.post("/",usersController.addUser);
 router.get("/:id",usersController.showUserInfo);
 router.get("/",usersController.showAllUsers);
 module.exports = router;
