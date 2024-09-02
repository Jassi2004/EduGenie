const validateTokenController = (req, res)=>{
    res.status(200).json({message: "token validated successfully"});
}
module.exports = { validateTokenController };
