const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const validateAuthToken = require("../middlewares/validateAuthToken");
const upload = require("../middlewares/uploadFile");

router.get("/active-users-count", validateAuthToken, userController.activeUsersCount);
router.get("/top-users", validateAuthToken, userController.topUsersByUsageTime);
router.get("/users-activity", validateAuthToken, userController.getUserActivity);
router.get("/all", validateAuthToken, userController.fetchAllUsers);
router.post("/filterUsers", validateAuthToken, userController.filterUsers);
router.post("/uploadData", validateAuthToken, upload.single("file"), userController.uploadUsers);
router.post("/filter-top-users", validateAuthToken, userController.filterTopUsers);

module.exports = router;