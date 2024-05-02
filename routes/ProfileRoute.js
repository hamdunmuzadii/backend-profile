const express = require("express")
const { getProfile, getProfileById, createProfile, updateProfile, deleteProfile } = require("../controllers/ProfileController.js")

const router = express.Router()

router.get("/profile", getProfile)
router.get("/profile/:id", getProfileById)
router.post("/profile", createProfile)
router.patch("/profile/:id", updateProfile)
router.delete("/profile/:id", deleteProfile)

module.exports = router