const response = require("../response")
const { PrismaClient } = require("@prisma/client")
const path = require("path")
const fs = require('fs');

const prisma = new PrismaClient

exports.getProfile = async (req, res) => {
    try {
        const data = await prisma.profile.findMany();
        response(200, data, 'Get All Data', res);
    } catch (error) {
        response(500, error, 'Data Not Found', res);
    }
};

exports.getProfileById = async (req, res) => {
    try {
        const Data = await prisma.profile.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        response(200, Data, 'Get Data By Id', res)
    } catch (error) {
        response(404, error, 'Data Not Found', res)
    }
}

exports.createProfile = async (req, res) => {
    try {
        const existingDataProfile = await prisma.profile.findFirst();
        if (existingDataProfile) {
            return response(400, null, 'Profile already exists', res);
        }

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
                const { username, name, status, bio, instagram, github, linkedin } = req.body;
                const Data = await prisma.profile.create({
                    data: {
                        image_profil: fileMd,
                        image_profil_url: url,
                        username: username,
                        name: name,
                        bio: bio,
                        status: status,
                        instagram: instagram,
                        github: github,
                        linkedin: linkedin,
                    }
                });
                response(201, Data, 'Profile Created Successfully', res);
            } catch (error) {
                console.log(error.message);
                response(500, null, 'Internal Server Error', res);
            }
        });
    } catch (error) {
        console.log(error.message);
        response(500, null, 'Internal Server Error', res);
    }
};

exports.updateProfile = async (req, res) => {

}

exports.deleteProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!profile) {
            return response(404, null, 'Profile Not Found', res);
        }

        const imagePath = `./public/images/${profile.image_profil}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await prisma.profile.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        return response(200, null, 'Deleted successfully', res);
    } catch (error) {
        console.error(error);
        return response(500, error, 'Failed to delete', res);
    }
}