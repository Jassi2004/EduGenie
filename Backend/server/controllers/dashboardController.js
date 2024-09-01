
const dashboardFunction = async (req, res) => {
    console.log(req.body);
    
    if(req.user.email != req.body.email) res.status(404).json({error: 'enter correct email Id for the token'});
    res.status(200).json({ username: req.user.username });
}

module.exports = {dashboardFunction}