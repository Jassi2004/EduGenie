
const dashboardFunction = async (req, res) => {
    res.status(200).json({ username: req.username });
}

module.exports = {dashboardFunction}