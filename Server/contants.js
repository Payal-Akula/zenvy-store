const CITIZEN_ROUTES = [
    {
        path: "citizen/profile",
        title: " My Profile"
    },
    {
        path:"citizen/complaint/new",
        title:"Create new complaint"
    },
    {
        path: "citizen/mycomplaints",
        title : "My Complaints"
    },
]

const ADMIN_ROUTES = [
    {
        path: "admin/complaints/dashboard",
        title: "Complaints Dashboards",
    }
]

const USER_ROLES = {
    ADMIN: "ADMIN",
    CITIZEN: "CITIZEN"
};

module.exports = {CITIZEN_ROUTES, ADMIN_ROUTES, USER_ROLES}