const express = require("express")
const { getContent, getContentById, createContent, updateContent, deleteContent } = require("../controllers/ContentController.js")

const router = express.Router()

router.get("/content", getContent)
router.get("/content/:id", getContentById)
router.post("/content", createContent)
router.patch("/content/:id", updateContent)
router.delete("/content/:id", deleteContent)

module.exports = router