const {regroupeInfo, makeEDT,getNumJours} = require("./edt.js")

module.exports = function (app) {

    app.get('/api/v1/all/', (req, res) => {
        // print parameter of request
        const params = req.query;
        console.log(params)
        if (Object.keys(params).includes("week") && Object.keys(params).includes("group")) {
            const rs = regroupeInfo(params.group, params.week)
            res.status(200).json(rs)
            return
        } else {
            res.status(400).json({"ok":false, error: 'missing parameters' })
            return;
        }
        res.status(500).json({"ok":false, error: 'internal error' })
    });

    //other routes..
}