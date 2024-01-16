const {regroupeInfo, makeEDT,getNumJours, base} = require("./edt.js")
const {allClasses, allProfs, getEDTX} = require("./altEDT.js")
const { log } = require("./logger.js")

const checkweek = (week) => week > 2 && week < 19

module.exports = function (app) {
    app.get('/api/v1/base/', (req, res) => {
        const params = req.query;
        if (req.query.week) {
            if (!checkweek(Number(req.query.week))) {
                log(2, "GET /api/v1/base/ with the ip : " + req.ip + " wrong week : " + req.query.week + " returning 400")
                return res.status(400).json({ "ok": false, error: 'week out of range' })
            }
            log(1, "GET /api/v1/base/ with the ip : " + req.ip +(req.query.week ? " and for a specific week : "+req.query.week : ""));
            return res.status(200).json(base(Number(req.query.week)))
        }
        return res.status(200).json(base(Number(req.query.week)))
        return res.status(500).json({ "ok": false, error: 'server error' })
    })

    app.get('/api/v1/all/', (req, res) => {
        // print parameter of request
        const params = req.query;
        if (Object.keys(params).includes("week") && Object.keys(params).includes("group")) {
            if (!checkweek(Number(params.week))) {
                log(2,"GET /api/v1/all/ with the ip : " + req.ip + " wrong week : " + params.week + " returning 400")
                return res.status(400).json({ "ok": false, error: 'week out of range' })
            }
            log(1, "GET /api/v1/all/ with the ip : " + req.ip + " group : " + params.group + " week : " + params.week);
            const rs = regroupeInfo(Number(params.group), Number(params.week))
            res.status(200).json(rs)
            return
        } else {
            log(2, "GET /api/v1/all/ with the ip : "+ req.ip + " missing parameters, returning 400" + JSON.stringify(params));
            res.status(400).json({"ok":false, error: 'missing parameters' })
            return;
        }
        res.status(500).json({"ok":false, error: 'internal error' })
    });
    app.get('/api/v1/sale/', (req, res) => {

        const params = req.query;
        if (Object.keys(params).includes("week") && Object.keys(params).includes("sale")) {
            log(1, "GET /api/v1/sale/ with the ip : " + req.ip + " sale : " + params.sale + " week : " + params.week);
            const days = getNumJours(Number(params.week));
            const rs = {
                "ok": true,
                "days": days[1],
                "fullDays": days[0],
                "EDT": getEDTX(params.week,params.sale, 2)
            }
            res.status(200).json(rs)
            return
        } else {
            log(2, "GET /api/v1/sale/ with the ip : " + req.ip + " missing parameters, returning 400" + JSON.stringify(params));
            res.status(400).json({ "ok": false, error: 'missing parameters' })
            return;
        }
        return res.status(500).json({ "ok": false, error: 'server error' })
    })
    app.get('/api/v1/salesBases/', (req, res) => {

        const params = req.query;
        log(1, "GET /api/v1/salesBases/ with the ip : " + req.ip + (req.query.week ? " and for a specific week : " + req.query.week : ""));
        let temp = base(Number(req.query.week))
        temp["salles"] = allClasses
        return res.status(200).json(temp)
        return res.status(500).json({ "ok": false, error: 'server error' })
    })
    app.get('/api/v1/prof/', (req, res) => {
        const params = req.query;
        if (Object.keys(params).includes("week") && Object.keys(params).includes("prof")) {
            log(1, "GET /api/v1/prof/ with the ip : " + req.ip + "sale : " + params.prof + " week : " + params.week);
            const days = getNumJours(Number(params.week));
            const rs = {
                "ok": true,
                "days": days[1],
                "fullDays": days[0],
                "EDT": getEDTX(params.week, params.prof, 5)
            }
            res.status(200).json(rs)
            return
        } else {
            log(1, "GET /api/v1/prof/ with the ip : " + req.ip + " missing parameters, returning 400" + JSON.stringify(params));
            res.status(400).json({ "ok": false, error: 'missing parameters' })
            return;
        }
        return res.status(500).json({ "ok": false, error: 'server error' })
    })
    app.get('/api/v1/profsBases/', (req, res) => {

        const params = req.query;
        log(1, "GET /api/v1/profsBases/ with the ip : " + req.ip + (req.query.week ? " and for a specific week : " + req.query.week : ""));
        let temp = req.query.week ? base(Number(req.query.week)) : base()
        temp["profs"] = allProfs
        return res.status(200).json(temp)
        return res.status(500).json({ "ok": false, error: 'server error' })
    })

    //other routes..
}