const response = require("../response");
const { PrismaClient } = require("@prisma/client");
const path = require("path")
const fs = require('fs');

const prisma = new PrismaClient();

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        response(200, projects, 'Get All Projects', res);
    } catch (error) {
        response(500, error, 'Failed to get projects', res);
    }
}

exports.getProjectById = async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!project) {
            response(404, null, 'Project Not Found', res);
            return;
        }
        response(200, project, 'Get Project by ID', res);
    } catch (error) {
        response(500, error, 'Failed to get project', res);
    }
}

exports.createProject = async (req, res) => {
    try {

        if (!req.files || !req.files.file) {
            return response(400, null, 'No File uploaded', res);
        }

        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileMd = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/${fileMd}`;
        const allowedType = ['.jpg', '.jpeg', '.png'];

        if (!allowedType.includes(ext.toLocaleLowerCase())) {
            return response(422, null, 'Invalid Images', res);
        }

        if (fileSize > 5000000) {
            return response(422, null, 'Image Must Be Less Than 5MB', res);
        }

        file.mv(`./public/images/${fileMd}`, async (err) => {
            if (err) {
                return response(500, null, err.message, res);
            }
            try {
                const { title, description, link } = req.body;
                const project = await prisma.project.create({
                    data: {
                        title: title,
                        description: description,
                        image: fileMd,
                        url_image: url,
                        link: link
                    }
                });
                response(201, project, 'Project created successfully', res);
            } catch (error) {
                console.log(error.message);
                response(500, null, 'Internal Server Error', res);
            }
        })
    } catch (error) {
        console.log(error.message);
        response(500, null, 'Internal Server Error', res);
    }
}

exports.updateProject = async (req, res) => {
    const { title, description, link } = req.body;
    try {
        const project = await prisma.project.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title : title,
                description : description,
                link : link
            }
        });
        response(200, project, 'Project updated successfully', res);
    } catch (error) {
        response(400, error, 'Failed to update project', res);
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const project = await prisma.project.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        const imagePath = `./public/images/${project.image}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
        response(200, project, 'Project deleted successfully', res);
    } catch (error) {
        response(400, error, 'Failed to delete project', res);
    }
}




