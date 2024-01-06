const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const validateAuthToken = require("../middlewares/validateAuthToken");

router.get("/active-users-count", validateAuthToken, userController.activeUsersCount);
router.get("/top-users", validateAuthToken, userController.topUsersByUsageTime);
router.get("/users-activity", validateAuthToken, userController.getUserActivity);
router.get("/all", validateAuthToken, userController.fetchAllUsers);
router.post("/filterUsers", validateAuthToken, userController.filterUsers)

module.exports = router;