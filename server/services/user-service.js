const sendEmail = require("../helper/mailer");
const bcrypt = require("../helper/bcrypt");

const userRepository = require("../db/repositories/user.repository")

const { jwtTokenVerification, createJwtToken } = require("../helper/jwt")
const { VERIFICATION_SECRET_KEY, FRONTENT_URL, LOGIN_SECRET_KEY, RESET_PASSWORD_SECRET_KEY } = process.env

const userRepo = new userRepository();

class UserService {

    async SignUp(body) {
        const { email } = body;
        try {
            const isExist = await userRepo.getSingleUser({ email: email.trim() })
            if (isExist) {
                return { status: 400, message: `User already exist with this ${email}` }
            }
            let verificationToken = createJwtToken(body, VERIFICATION_SECRET_KEY, "10m")

            let mailObject = {
                from: process.env.MAIL_ACCOUNT_EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click to given link below to verify your account!</p>
                <a href='${FRONTENT_URL}/verify/${verificationToken}'>Verify Account Now!<a/>
                `
            }
            await sendEmail(mailObject, "html")
            return { status: 200, message: "Account has been created! Please check email to verify!" }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    };

    async AccountActivation(body) {
        const { verificationToken } = body
        try {
            const decoded = jwtTokenVerification(verificationToken, VERIFICATION_SECRET_KEY);

            if (!decoded) {
                return { status: 400, message: `Token has been expired or Invalid!` }
            }
            const { name, email, password } = decoded;

            let hashedPassword = await bcrypt.hashPassword(password)

            const isUserExist = await userRepo.getSingleUser({ "email": email.trim() })
            if (isUserExist) {
                return { status: 400, message: `Account can not be activate with this ${email}, it's already exist.` }
            }
            await userRepo.createUser({ name, email, password: hashedPassword });
            return { status: 200, message: `Account has been activated successfully!` }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

    async SignIn(body) {
        const { email, password } = body;
        try {
            const isUserExist = await userRepo.getSingleUser({ email: email.trim() });

            if (!isUserExist) {
                return { status: 400, message: `No such user found with ${email}` }
            }
            const isCredentialsValid = await bcrypt.comparePassword(password, isUserExist.password);

            if (!isCredentialsValid) {
                return { status: 400, message: `Invalid email or password, please try again with valid credentials!` }
            }

            const accessToken = createJwtToken({ "email": isUserExist.email }, LOGIN_SECRET_KEY, "7d");

            return {
                status: 200,
                message: `Logged-in successfully!`,
                data: {
                    token: accessToken,
                    user: { email: isUserExist.email, name: isUserExist.name, id: isUserExist._id }
                },
            }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

    async ForgotPassword(body) {
        const { email } = body;
        try {
            const isUserExist = await userRepo.getSingleUser({ email: email.trim() });

            if (!isUserExist) {
                return { status: 404, message: `No such user found with ${email}` }
            }

            const token = createJwtToken({ id: isUserExist._id }, RESET_PASSWORD_SECRET_KEY, "20m");

            let mailObject = {
                from: process.env.MAIL_ACCOUNT_EMAIL,
                to: email,
                subject: 'Reset Password',
                html: `<p>Please click to given link below to reset your password!</p>
                <a href='${process.env.FRONTENT_URL}/reset-password/${token}'>Reset Password!<a/>
                `
            }
            await sendEmail(mailObject, "html")
            return { status: 200, message: `Forgot password request submitted successfuly, Please check your email!` }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

    async ChangePassword(body) {
        const { token, password, confirm_password } = body;

        try {
            const decoded = jwtTokenVerification(token, RESET_PASSWORD_SECRET_KEY);

            if (!decoded) {
                return { status: 400, message: `Token has been expired or Invalid!` }
            }

            if (password != confirm_password) {
                return { status: 400, message: `Password and Confirm Password are not matched, Please try again` }
            }
            const newHashedPassword = await bcrypt.hashPassword(password);

            await userRepo.updateUser(decoded.id, { password: newHashedPassword });
            return { status: 200, message: `Password has been changed successfully!` }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

}

module.exports = UserService