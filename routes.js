const {regroupeInfo, makeEDT,getNumJours, base} = require("./edt.js")
const {allClasses, allProfs, getEDTX} = require("./altEDT.js")


module.exports = function (app) {
    app.get('/api/v1/base', (req, res) => {

        const params = req.query;
        console.log(params)
        return res.status(200).json(base(Number(req.query.week)))
        return res.status(404).json({ "ok": false, error: 'missing parameters' })
    })

    app.get('/api/v1/all/', (req, res) => {
        // print parameter of request
        const params = req.query;
        console.log(params)
        if (Object.keys(params).includes("week") && Object.keys(params).includes("group")) {
            const rs = regroupeInfo(Number(params.group), Number(params.week))
            res.status(200).json(rs)
            return
        } else {
            res.status(400).json({"ok":false, error: 'missing parameters' })
            return;
        }
        res.status(500).json({"ok":false, error: 'internal error' })
    });
    app.get('/api/v1/sale/', (req, res) => {

        const params = req.query;
        console.log(params)
        if (Object.keys(params).includes("week") && Object.keys(params).includes("sale")) {
            const days = getNumJours(Number(params.week));
            const rs = {
                "ok": true,
                "days": days[1],
                "fullDays": days[0],
                "EDT": getEDTX(params.week,params.sale, 2),
                "membres": getEDTX(params.week,params.sale, 2)
            }
            res.status(200).json(rs)
            return
        } else {
            res.status(400).json({ "ok": false, error: 'missing parameters' })
            return;
        }
        temp["profs"] = allProfs
        return res.status(200).json(temp)
        return res.status(404).json({ "ok": false, error: 'missing parameters' })
    })
    app.get('/api/v1/salesBases/', (req, res) => {

        const params = req.query;
        let temp = base(Number(req.query.week))
        temp["salles"] = allClasses
        return res.status(200).json(temp)
        return res.status(404).json({ "ok": false, error: 'missing parameters' })
    })

    //other routes..
}