const { USER_ROLES, CITIZEN_ROUTES, ADMIN_ROUTES } = require("../contants")
const User = require("../models/User")

const getUserInfo = (userModel) => {
    const fullName = userModel.fullName ?? (
        userModel.email ? userModel.email.split("@")[0] : "User"
    )

    const location = null

    return {
        fullName,
        location
    }
}

const getEnableRoutes = (user) => {
    if (user.role === USER_ROLES.CITIZEN) {
        return CITIZEN_ROUTES
    }
    else if (user.role === USER_ROLES.ADMIN) {
        return ADMIN_ROUTES
    }
    return []
}

const getiam = async ({ id, role }) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            throw new Error("User is not Found")
        }
        return {
            userInfo: getUserInfo(user),
            enableToutes: getEnableRoutes(user),
            maxComplaintsExceeded: false,
        }
    } catch (error) {
        console.log("Failed to fetch iam info for user id: ", id, "Role: ", role, "Error: ", error.message)
    }
}
module.exports = { getiam }