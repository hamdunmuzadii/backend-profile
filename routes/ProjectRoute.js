const express = require("express")
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, createProjectAndPrototype } = require("../controllers/ProjectController.js")

const router = express.Router()

router.get("/project", getAllProjects)
router.get("/project/:id", getProjectById)
router.post("/project", createProject)
router.patch("/project/:id", updateProject)
router.delete("/project/:id", deleteProject)

module.exports = router