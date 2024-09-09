const validateTokenController = (req, res)=>{
    console.log("req.user from validateTokenController: ", req.user);
    
    res.status(200).json({message: "token validated successfully"});
}
module.exports = { validateTokenController };
