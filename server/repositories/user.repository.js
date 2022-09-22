const userModel = require("../models/user.model")

class UserRepository {

    async getDocumentByColumns(params) {
        const data = await userModel.findOne(params);
        if (!data) {
            return { status: false, message: "No record found", data }
        }
        return { status: false, message: "Record found", data }
    }

}

module.exports = UserRepository