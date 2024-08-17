const { regroupeInfo, makeEDT, CgetNumJours, base, Cnoms, Classes, CsemaineNom, CgetCurrentWeek, CallEdt, CGroupe } = require("./edt.js");
const { allSalles, allProfs, getEDTX } = require("./altEDT.js");
const textColisions = require("./script test/testCollisions");
const { log, connection } = require("./logger.js");
const getLogs = require("./stats.js")
const { graph, heatmap, minute } = require("./anayse stats/analyse.js")
const path = require("path")


// check for valid parameters in requests
const checkWeek = (addr, req ,res) => {
    const params = req.query;
    if (Object.keys(params).includes("week")){
        const week = params.week
        if (week > 0 && week <= CsemaineNom[Object.keys(CallEdt)[0]].length) {
            connection(addr, req, 200);
            return true
        }else {
            connection(addr, req, 400);
            return res.status(400).json({ ok: false, error: "week out of range" })
        };
    } else {
        connection(addr, req, 400);
        return res.status(400).json({ ok: false, error: "week parameter required" });
    }
}

const checkNom = (addr, req, res) => {
    let noms = []
    Object.keys(Cnoms).forEach(classe => noms = noms.concat(Cnoms[classe]))
    const params = req.query;
    if (Object.keys(params).includes("pers")) {
        const pers = params.pers
        // console.log(noms, pers)
        if (noms.includes(pers))  {
            connection(addr, req, 200);
            return true
        } else {
            connection(addr, req, 400);
            return res.status(400).json({ ok: false, error: "unknown pers : \""+pers.toString()+"\"" })
        };
    } else {
        connection(addr, req, 400);
        return res.status(400).json({ ok: false, error: "\"pers\" parameter required" });
    }
}

const checkSalle = (addr, req, res) => {
    const params = req.query;
    if (Object.keys(params).includes("salle")) {
        const salle = params.salle
        if (allSalles.includes(salle)) {
            connection(addr, req, 200);
            return true
        }
        else {
            connection(addr, req, 400);
            return res.status(400).json({ ok: false, error: "unknown salle : \"" + salle.toString() + "\"" });
        }
    } else {
        connection(addr, req, 400);
        return res.status(400).json({ ok: false, error: "\"pers\" parameter required" });
    }
}

const checkProf = (addr, req, res) => {
    const params = req.query;
    if (Object.keys(params).includes("prof")) {
        const prof = params.prof
        if (allProfs.includes(prof)) {
            connection(addr, req, 200);
            return true
        }
        else {
            connection(addr, req, 400);
            return res.status(400).json({ ok: false, error: "unknown prof : \"" + prof.toString() + "\"" });
        }
    } else {
        connection(addr, req, 400);
        return res.status(400).json({ ok: false, error: "\"prof\" parameter required" });
    }
}


// api connexions
module.exports = function (app) {
    app.get("/api/v2/pages/", (req, res) => {
        // 
        connection("/api/v2/pages/", req, 200);
        return res.status(200).json(      );
    });

    app.get("/api/v2/classe/:classe", (req, res) => {
        if (req.params.classe && Classes.includes(req.params.classe)){
            connection("/api/v2/classe/:classe", req, 400);
            return res.status(200).json(base(req.params.classe));
        } else{
            connection("/api/v2/classe/:classe", req, 400);
            return res.status(400).json({ok: false, error: "valid \"pers\" parameter required"});
        }
    });

    app.get("/api/v2/classe/:classe/EDT", (req, res) => {
        const params = req.query;
        if (req.params.classe && Classes.includes(req.params.classe)) {
            const cN = checkNom("/api/v2/classe/:classe/EDT",req,res)
            if (cN !== true) return cN
            const cW = checkWeek("/api/v2/classe/:classe/EDT", req, res)
            if (cW !== true) return cW
            // console.log(CGroupe, CGroupe[req.params.classe], params.pers)
            if (!(Cnoms[req.params.classe].includes(params.pers))) return res.status(400).json({ok:false,error:"pers : \""+params.pers+"\" exist but isn't in this class"})
            connection("/api/v2/classe/:classe/EDT", req, 200);
            return res.status(200).json(regroupeInfo(req.params.classe, params.pers, params.week));
        } else {
            connection("/api/v2/classe/:classe/EDT", req, 400);
            return res.status(400).json({ ok: false, error: "valid \"pers\" parameter required" });
        }
    });

    app.get("/api/v2/salle/", (req, res) => {
        const params = req.query;

        const testWeek = checkWeek("/api/v2/salle/", req, res)
        if (testWeek!==true) return testWeek
        const testSalle = checkSalle("/api/v2/salle/", req, res)
        if (testSalle !== true) return testSalle
        
        const days = CgetNumJours[Object.keys(CgetNumJours)[0]](Number(params.week));
        const rs = {
            ok: true,
            days: days[1],
            fullDays: days[0],
            EDT: getEDTX(params.week, params.salle, 2),
        };
        if (rs && days) {
            connection("/api/v2/salle/", req, 200);
            return res.status(200).json(rs);
        } else {
            connection("/api/v2/salle/", req, 500);
            return res
                .status(500)
                .json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v2/sallesBases/", (req, res) => {
        const premiereClasse = Object.keys(CallEdt)[0]
        let temp = {
            "weeks": CsemaineNom[premiereClasse],
            "currentWeek": CgetCurrentWeek[premiereClasse](),
            "salles": allSalles
        }
        if (temp) {
            connection("/api/v2/sallesBases/", req, 200);
            return res.status(200).json(temp);
        } else {
            connection("/api/v2/sallesBases/", req, 500);
            return res.status(500).json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v2/prof/", (req, res) => {
        const params = req.query;

        const testWeek = checkWeek("/api/v2/prof/", req, res)
        if (testWeek !== true) return testWeek
        const testProf = checkProf("/api/v2/prof/", req, res)
        if (testProf !== true) return testProf


        const days = CgetNumJours[Object.keys(CgetNumJours)[0]](Number(params.week));
        const important = getEDTX(params.week, params.prof, 5)
        const rs = {
            ok: true,
            days: days[1],
            fullDays: days[0],
            EDT: important,
        };
        if (rs && days && important) {
            connection("/api/v2/prof/", req, 200);
            return res.status(200).json(rs);
        } else {
            connection("/api/v2/prof/", req, 500);
            return res
                .status(500)
                .json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v2/profsBases/", (req, res) => {
        const premiereClasse = Object.keys(CallEdt)[0]
        let temp = base(premiereClasse);
        temp["profs"] = allProfs;
        if (temp) {
            connection("/api/v2/profsBases/", req, 200);
            return res.status(200).json(temp);
        } else {
            connection("/api/v2/profsBases/", req, 500);
            return res.status(500).json({ ok: false, error: "server error" });
        }
    });

    app.get("/api/v2/colisions/", (req, res) => {
        connection("/api/v2/colisions/", req, 200);
        return res.status(200).send(textColisions);
    });

    // Statistiques :

    app.get("/api/v2/gitVers/", (req, res) => {
        connection("/api/v2/gitVers/", req, 200);
        return res.status(200).sendFile(path.join(__dirname, ".git", "refs", "heads","main"));
    });

    app.get("/api/v2/stats/", (req, res) => {
        connection("/api/v2/stats/", req, 200);
        return res.status(200).json(getLogs());
    });

    app.get("/api/v2/connGraph/", (req, res) => {
        connection("/api/v2/connGraph/", req, 200);
        return res.status(200).json(graph());
    });

    app.get("/api/v2/connHeatmap/", (req, res) => {
        connection("/api/v2/connHeatmap/", req, 200);
        return res.status(200).json(heatmap());
    });

    app.get("/api/v2/connMin/", (req, res) => {
        if (req.id.start && Number(req.id.start) > 0) {
            connection("/api/v2/connMin/", req, 200);
            return res.status(200).json(minute(Number(req.id.start)));
        }
    });

    //other routes..
};
