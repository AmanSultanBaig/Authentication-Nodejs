const userModel = require("../models/user.model")

class UserRepository {

    async getSingleUser(params) {
        try {
            const data = await userModel.findOne(params);
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            return error
        }
    }

    async getAllUsers() {
        try {
            const data = await userModel.find();
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            return error
        }
    }

    async createUser(params) {
        try {
            const data = await userModel.save(params);
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            return error
        }
    }

    async updateUser(id, params) {
        try {
            const data = await userModel.findByIdAndUpdate(id, params);
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            return error
        }
    }

    async removeUser(id) {
        try {
            const data = await userModel.findByIdAndDelete(id);
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            return error
        }
    }

}

module.exports = UserRepository