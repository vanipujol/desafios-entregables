import userModel from "../dao/models/users.model.js";

class UsersController {

    static addDocuments = async(req,res)=> {

        const uid = req.params.uid;
        const filename = req.file.filename
        const user = await userModel.findOne({_id: uid});



        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(!filename) {
            return res.status(400).send({status:"error", error:"The document could not be loaded"})
        }

        const document = {
            name: filename,
            reference: `http://localhost:8080/files/documents/${filename}`
        }

        user.documents.push(document)

        const result = await userModel.updateOne({_id: uid}, {$set: user});

        return res.status(200).json({ message: 'Document uploaded successfully', result });

    }

    static async changeRole(req, res) {
        const {uid} = req.params;

        if (!uid) return res.status(400).send({
            status: "error",
            message: "Incorrect data"
        });

        const user = await userModel.findOne({_id: uid});
        if (!user) return res.status(400).send({
            status: "error",
            message: "Nonexistent user"
        });

        // Check if the user has uploaded at least 3 documents
        if (user.documents.length < 3 && user.role !== "premium") {
            return res.status(400).send({
                status: "error",
                message: "User must upload at least 3 documents to upgrade to premium role"
            });
        }

        // Check if the user has uploaded all required documents before upgrading to premium
        if (user.role === "user" && user.documents.length < 3) {
            return res.status(400).send({
                status: "error",
                message: "User has not finished processing their documentation"
            });
        }

        let newRole
        if (user.role === "user"){
            newRole = "premium";
        }else {
            newRole = "user"
        }

        const response = await userModel.updateOne({_id: user._id}, {$set: {role: newRole}});

        res.send({
            status: "success",
            message: "Modified role",
            response
        });
    }
}


export {UsersController}