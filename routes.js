const { regroupeInfo, makeEDT, getNumJours, base, noms } = require("./edt.js");
const { allClasses, allProfs, getEDTX } = require("./altEDT.js");
const textColisions = require("./testCOllisions.js");
const { log, connection } = require("./logger.js");

const checkweek = (week) => week > 2 && week < 36;
const checkNom = (nom) => noms.includes(nom);

module.exports = function (app) {
    app.get("/api/v1/base/", (req, res) => {
        const params = req.query;
        if (req.query.week) {
            if (!checkweek(Number(req.query.week))) {
                connection("/api/v1/base/", req, 400);
                return res
                    .status(400)
                    .json({ ok: false, error: "week out of range" });
            }
            connection("/api/v1/base/", req, 200);
            return res.status(200).json(base(Number(req.query.week)));
        }

        const temp = base(Number(req.query.week));
        if (temp) {
            connection("/api/v1/base/", req, 400);
            return res.status(200).json(temp);
        } else {
            return res.status(500).json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v1/all/", (req, res) => {
        // print parameter of request
        const params = req.query;
        if (
            Object.keys(params).includes("week") &&
            Object.keys(params).includes("name")
        ) {
            if (!checkweek(Number(params.week))) {
                connection("/api/v1/all/", req, 400);
                return res
                    .status(400)
                    .json({ ok: false, error: "week out of range" });
            }
            if (!checkNom(params.name)) {
                connection("/api/v1/all/", req, 400);
                return res
                    .status(400)
                    .json({ ok: false, error: "week out of range" });
            }

            const rs = regroupeInfo(params.name, Number(params.week));
            if (rs) {
                connection("/api/v1/all/", req, 200);
                return res.status(200).json(rs);
            } else {
                connection("/api/v1/all/", req, 500);
                return res
                    .status(500)
                    .json({ ok: false, error: "server error" });
            }
        } else {
            connection("/api/v1/all/", req, 400);
            return res
                .status(400)
                .json({ ok: false, error: "missing parameters" });
        }
    });

    app.get("/api/v1/salle/", (req, res) => {
        const params = req.query;
        if (
            Object.keys(params).includes("week") &&
            Object.keys(params).includes("salle")
        ) {
            if (!checkweek(Number(params.week))) {
                connection("/api/v1/salle/", req, 400);
                return res
                    .status(400)
                    .json({ ok: false, error: "week out of range" });
            }

            const days = getNumJours(Number(params.week));
            const rs = {
                ok: true,
                days: days[1],
                fullDays: days[0],
                EDT: getEDTX(params.week, params.salle, 2),
            };
            if (rs && days) {
                connection("/api/v1/salle/", req, 200);
                return res.status(200).json(rs);
            } else {
                connection("/api/v1/salle/", req, 500);
                return res
                    .status(500)
                    .json({ ok: false, error: "server error" });
            }
        } else {
            connection("/api/v1/salle/", req, 400);
            res.status(400).json({ ok: false, error: "missing parameters" });
            return;
        }
    });

    app.get("/api/v1/sallesBases/", (req, res) => {
        const params = req.query;
        let temp = base(Number(req.query.week));
        temp["salles"] = allClasses;
        if (temp) {
            connection("/api/v1/sallesBases/", req, 200);
            return res.status(200).json(temp);
        } else {
            connection("/api/v1/sallesBases/", req, 500);
            return res.status(500).json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v1/prof/", (req, res) => {
        const params = req.query;
        if (
            Object.keys(params).includes("week") &&
            Object.keys(params).includes("prof")
        ) {
            const days = getNumJours(Number(params.week));
            const rs = {
                ok: true,
                days: days[1],
                fullDays: days[0],
                EDT: getEDTX(params.week, params.prof, 5),
            };
            if (rs && days) {
                connection("/api/v1/prof/", req, 200);
                return res.status(200).json(rs);
            } else {
                connection("/api/v1/prof/", req, 500);
                return res
                    .status(500)
                    .json({ ok: false, error: "server error" });
            }
        } else {
            connection("/api/v1/prof/", req, 400);
            return res
                .status(400)
                .json({ ok: false, error: "missing parameters" });
        }
    });

    app.get("/api/v1/profsBases/", (req, res) => {
        const params = req.query;
        let temp = req.query.week ? base(Number(req.query.week)) : base();
        temp["profs"] = allProfs;
        if (temp) {
            connection("/api/v1/profsBases/", req, 200);
            return res.status(200).json(temp);
        } else {
            connection("/api/v1/profsBases/", req, 500);
            return res.status(500).json({ ok: false, error: "server error" });
        }
    });
    app.get("/api/v1/colisions/", (req, res) => {
        connection("/api/v1/colisions/", req, 200);
        return res.status(200).send(textColisions);
    });

    //other routes..
};
