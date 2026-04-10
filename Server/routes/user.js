const { Router } = require("express")
const { authenticationMiddleware } = require("../middleware/midauth")
const { getiam } = require("../services/userservice")
const User = require("../models/User");
const router = Router()

router.get("/iam",authenticationMiddleware, async(req, res)=>{
    // extract the user info from the token and make a DB call to fetch the details.
    const iamResponse = await getiam(req.user)
    if(!iamResponse){
        return res
        .status(500)
        .json({message: "Failed to fetch user information"})
    }
    res.status(200).json(iamResponse)
})


module.exports = router