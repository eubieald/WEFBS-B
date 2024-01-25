const express = require("express");
const router = express.Router();

const userController = require("../controllers/firebase-user-controller");
const isAuthenticated = userController.isAuthenticated;

// Define routes here 
router.post("/login", userController.login_post);
router.get("/dashboard", isAuthenticated, userController.dashboard_get); // added a middleware named isAuthenticated when declaring a route.
router.post("/logout", userController.logout_post);

module.exports = router;
