const express = require("express")
const cors = require("cors")
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv")
const ProfileRoute = require("./routes/ProfileRoute.js")
const ProjectRoute = require("./routes/ProjectRoute.js")
const ContentRoute = require("./routes/ContentRoute.js")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload());
app.use(express.static("public"))
app.use(ProfileRoute)
app.use(ProjectRoute)
app.use(ContentRoute)

app.listen(process.env.APP_PORT, () => {
    console.log(`The server runs on... http://localhost:${process.env.APP_PORT}`);
})