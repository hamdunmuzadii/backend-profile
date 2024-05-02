const response = require("../response")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient

exports.getContent = async (req, res) => {
    try {
        const data = await prisma.content.findMany();
        response(200, data, 'Get All Data', res);
    } catch (error) {
        response(500, error, 'Data Not Found', res);
    }
};

exports.getContentById = async (req, res) => {
    try {
        const data = await prisma.content.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        response(200, data, 'Get Data By Id', res);
    } catch (error) {
        response(500, error, 'Data Not Found', res);
    }
};

exports.createContent = async (req, res) => {
    try {
        const { devTitle, devtools, projectTitle, project } = req.body

        const dataExist = await prisma.content.findFirst();

        if (dataExist) {
            return response(400, null, 'Content already exists', res);
        } else {
            const data = await prisma.content.create({
                data: {
                    devTitle: devTitle,
                    devtools: devtools,
                    projectTitle: projectTitle,
                    project: project
                }
            })
            response(200, data, 'Create Succesfully', res);
        }
    } catch (error) {
        response(500, error, 'Data Not Found', res);
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { devTitle, devtools, projectTitle, project } = req.body;
        const updatedContent = await prisma.content.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                devTitle: devTitle,
                devtools: devtools,
                projectTitle: projectTitle,
                project: project
            }
        });
        response(200, updatedContent, 'Update Successfully', res);
    } catch (error) {
        response(500, error, 'Error Updating Data', res);
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const data = await prisma.content.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        response(200, data, 'Delete Succesfully', res);
    } catch (error) {
        response(500, error, 'Data Not Found', res);
    }
};