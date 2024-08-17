const fs = require("fs");
const { log } = require("../../../logger.js");
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const getText = (path) =>
    fs.readFileSync(path.substring(1, path.length), "utf8");

const getJson = (path) => JSON.parse(getText(path));

const heureToNombre = (n) => {
    if (typeof n == typeof 2) return n;
    if (n.indexOf("h") > -1) {
        let nn = n.split("h");
        return Number(nn[0]) + Number(nn[1]) / 60;
    }
    return Number(n);
};

const nombreToHeure = (n) => {
    let reste = n - Math.floor(n);
    if (reste > 0)
        return Math.floor(n).toString() + "h" + Math.round(reste * 60);
    return Math.floor(n).toString() + "h";
};

const presGroupes = (ng) => {
    // console.log(ng)
    let pers = groupesPers[ng - 1];
    // console.log(pers)
    let res = pers[0][1] + " " + pers[0][0] + ".";
    for (let i = 1; i < pers.length; i++) {
        const element = pers[i];
        res += " ; " + element[1] + " " + element[0] + ".";
    }
    return res;
};

const db = getJson("/EDT/MP2I/s2/kholles.json"); // document qui répertorie les khôlles
const info = getText("/EDT/MP2I/s2/info.txt"); // document qui répertorie la matrice pour les groupes d'informatique
const orgEDT = getJson("/EDT/MP2I/s2/EDT.json"); // document qui répertorie les les cours communs pour ceux qui ne font pas SI
const orgEDTsi = getJson("/EDT/MP2I/s2/EDTsi.json"); // document qui répertorie les les cours communs pour ceux qui font SI
const groupesPers = getJson("/EDT/MP2I/s2/groupes.json"); // document qui répertorie le nom des memebres de chaques groupes
const hotfix = getJson("/EDT/MP2I/s2/hotfix.json"); // document qui répertorie les hotfixs
let EDT = clone(orgEDT); // variable qui stocke tout l'EDT
let tableauInfo = [];

// Traitement des groupes d'infos dans un tableau
info.split("\n").forEach((lign) => {
    tableauInfo.push(lign.split(" "));
});

const majPrem = (s) => s[0].toUpperCase() + s.substring(1);

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

const trueHeure = (n) => {
    if (typeof n == typeof 2) {
        return n;
    }
    return heureToNombre(n);
};

const khollesToEDT = (kh, ma) => {
    // ["Aufranc", 2, 15, "20"] -> ["Khôlle Maths","maths","20",15,16,"Aufranc"]
    // console.log(kh)
    return [
        "Khôlle " + majPrem(ma),
        ma,
        kh[3],
        trueHeure(kh[2]),
        trueHeure(kh[2]) + 1,
        kh[0],
    ];
};

const getC = (k, s) => {
    k = Number(k);
    s = Number(s);
    if (s > 28) {
        // car les semaines 28 et 29 sont unies donc on traitera la 29 et les suivant comme ayant une semaine de moins
        s -= 1;
    }
    s -= 3;
    return ((32 + k - s - 1) % 16) + 1;
};

const getKfromC = (c, s) => {
    c -= 1;
    if (s > 28) {
        // car les semaines 28 et 29 sont unies donc on traitera la 29 et les suivant comme ayant une semaine de moins
        s -= 1;
    }
    s -= 19;
    return ((32 + c + s) % 16) + 1;
};

// cette fonction rassemble toute les kholles en respectant le règles spécifiques
const getKholes = (k, s) => {
    if (s > 33) return [[], ""];
    let message = "";
    // console.log(k,s)
    let c = getC(k, s);

    let all = [];
    for (let i = 0; i < 5; i++) {
        all.push([]);
    }
    if (s <= 24 && k <= 3) {
        if (c == 4) {
            message =
                "Permutation de la khôlle de maths avec le groupe en C12 : le groupe " +
                getKfromC(12, s) +
                " (" +
                presGroupes(getKfromC(12, s)) +
                ")";
            const maths = db["maths"][12 - 1];
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
        } else {
            const maths = db["maths"][c - 1];
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
        }

        if (c == 2) {
            message =
                "Permutation de la khôlle d'anglais avec le groupe en C6 : le groupe " +
                getKfromC(6, s) +
                " (" +
                presGroupes(getKfromC(6, s)) +
                ")";
            const anglais = db["anglais"][6 - 1];
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
        } else if (c % 2 == 0) {
            const anglais = db["anglais"][c - 1];
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
        }

        if (c == 9) {
            message =
                "Permutation de la khôlle de physique avec le groupe en C13 : le groupe " +
                getKfromC(13, s) +
                " (" +
                presGroupes(getKfromC(13, s)) +
                ")";
            const physique = db["physique"][13 - 1];
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
        } else if (c % 2 == 1) {
            const physique = db["physique"][c - 1];
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
        }
    } else if (k <= 3) {
        //semaines 25 à 35 ou 34 jsp
        const toInvMaths = [2, 7, 8, 9, 11, 13, 14, 16];
        const getInvMaths = [5, 3, 5, 6, 3, 5, 3, 5];
        if (toInvMaths.includes(c)) {
            let final = getInvMaths[toInvMaths.indexOf(c)];
            message =
                "Permutation de la khôlle de maths avec le groupe en C" +
                final +
                " : le groupe " +
                getKfromC(final, s) +
                " (" +
                presGroupes(getKfromC(final, s)) +
                ")";
            const maths = db["maths"][final - 1];
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
        } else {
            const maths = db["maths"][c - 1];
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
        }
        const toInvPhys = [1, 15];
        const getInvPhys = [9, 5];
        if (toInvPhys.includes(c) && s <= 30) {
            let final = getInvPhys[toInvPhys.indexOf(c)];
            message =
                "Permutation de la khôlle de physique avec le groupe en C" +
                final +
                " : le groupe " +
                getKfromC(final, s) +
                " (" +
                presGroupes(getKfromC(final, s)) +
                ")";
            const maths = db["maths"][final - 1];
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
        } else if (c % 2 == 1) {
            const physique = db["physique"][c - 1];
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
        }
        if (c == 4) {
            message =
                "Permutation de la khôlle d'Anglais avec le groupe en C" +
                10 +
                " : le groupe " +
                getKfromC(10, s) +
                "(" +
                presGroupes(getKfromC(10, s)) +
                ")";
            const anglais = db["anglais"][10 - 1];
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
        } else if (c % 2 == 0) {
            const anglais = db["anglais"][c - 1];
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
        }
    } else {
        if (s <= 24) {
            if (c == 12 && getKfromC(4, s) <= 3) {
                message =
                    "Permutation de la khôlle de maths avec le groupe en C4 : le groupe " +
                    getKfromC(4, s) +
                    " (" +
                    presGroupes(getKfromC(4, s)) +
                    ")";
                const maths = db["maths"][4 - 1];
                all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
            } else {
                const maths = db["maths"][c - 1];
                all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
            }

            if (c == 13 && getKfromC(9, s) <= 3 && s <= 30) {
                message =
                    "Permutation de la khôlle de physique avec le groupe en C9 : le groupe " +
                    getKfromC(9, s) +
                    " (" +
                    presGroupes(getKfromC(9, s)) +
                    ")";
                const physique = db["physique"][9 - 1];
                all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
            } else if (c % 2 == 1) {
                const physique = db["physique"][c - 1];
                all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
            }

            if (c == 6 && getKfromC(2, s) <= 3) {
                message =
                    "Permutation de la khôlle d'anglais avec le groupe en C2 : le groupe " +
                    getKfromC(2, s) +
                    " (" +
                    presGroupes(getKfromC(2, s)) +
                    ")";
                const anglais = db["anglais"][2 - 1];
                all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
            } else if (c % 2 == 0) {
                const anglais = db["anglais"][c - 1];
                all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
            }
        } else {
            // inversion des khôlles de maths
            let isInvMaths = false;
            const toInvMaths = [2, 7, 8, 9, 11, 13, 14, 16];
            const getInvMaths = [5, 3, 5, 6, 3, 5, 3, 5];
            for (let i = 0; i < getInvMaths.length; i++) {
                if (c == getInvMaths[i] && getKfromC(toInvMaths[i], s) <= 3) {
                    isInvMaths = true;
                    let siGroup = getKfromC(toInvMaths[i], s);
                    message =
                        "Permutation de la khôlle de maths avec le groupe en C" +
                        toInvMaths[i] +
                        " : le groupe " +
                        siGroup +
                        " (" +
                        presGroupes(siGroup) +
                        ")";
                    const maths = db["maths"][toInvMaths[i] - 1];
                    all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
                }
            }
            if (!isInvMaths) {
                const maths = db["maths"][c - 1];
                all[maths[1] - 1].push(khollesToEDT(maths, "maths"));
            }

            // inversion des khôlles de physique

            let isInvPhys = false;
            const toInvPhys = [1, 15];
            const getInvPhys = [9, 5];
            for (let i = 0; i < getInvPhys.length; i++) {
                if (c == getInvPhys[i] && getKfromC(toInvPhys[i], s) <= 3 && s<=30) {
                    isInvPhys = true;
                    let siGroup = getKfromC(toInvPhys[i], s);
                    message =
                        "Permutation de la khôlle de physique avec le groupe en C" +
                        toInvPhys[i] +
                        " : le groupe " +
                        siGroup +
                        " (" +
                        presGroupes(siGroup) +
                        ")";
                    const physique = db["physique"][toInvPhys[i] - 1];
                    all[physique[1] - 1].push(
                        khollesToEDT(physique, "physique"),
                    );
                }
            }
            if (!isInvPhys && c % 2 == 1 && s <= 30) {
                const physique = db["physique"][c - 1];
                all[physique[1] - 1].push(khollesToEDT(physique, "physique"));
            }

            if (c == 10 && getKfromC(4, s) <= 3) {
                const final = getKfromC(4, s);
                message =
                    "Permutation de la khôlle d'anglais avec le groupe en C4 : le groupe " +
                    final +
                    " (" +
                    presGroupes(final) +
                    ")";
                const anglais = db["anglais"][4 - 1];
                all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
            } else if (c % 2 == 0) {
                const anglais = db["anglais"][c - 1];
                all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"));
            }
        }
    }

    if (k > 3 && (c == 2 || c == 10) && s<27) {
        const info = db["info"][c - 1];
        all[info[1] - 1].push(khollesToEDT(info, "info"));
    }
    if (
        s % 2 == 0 &&
        (((c == 9 || c == 14) && s <= 26) || ((c == 7 || c == 12) && s >= 30))
    ) {
        const francais = db["francais"][c - 1];
        all[francais[1] - 1].push(khollesToEDT(francais, "français"));
    }
    return [all, message];
};

const makeEDT = (k, semaine, info = null) => {
    if (info == null) groupeI = tableauInfo[k - 1][semaine - 16 - 3];
    else {
        groupeI = info;
    }
    const semaineC = getC(k, semaine); // kholes[semaine - 3]
    EDT = [];
    EDT = k == 2 || k == 3 ? clone(orgEDTsi) : clone(orgEDT);
    kholes = [];
    for (let i = 0; i < 15; i++) {
        kholes.push([]);
    }
    let mettreSemaine = [[], [], [], [], []];
    // on ajoute sans ordre précis les cours kholles et TD à ajouter à l'EDT pour on les remmettra bien dans l'EDT plus tard
    const n1 = () => {
        mettreSemaine[0].push([
            "Anglais",
            "anglais",
            "33",
            13,
            14,
            "Bocquillon",
        ]);
        mettreSemaine[0].push([
            "TD Physique",
            "physique",
            "20",
            14,
            15,
            "Bouchet",
        ]);
        mettreSemaine[4].push([
            "TD Maths",
            "maths",
            "20",
            heureToNombre("7h50"),
            heureToNombre("9h50"),
            "Aufranc",
        ]);
        mettreSemaine[4].push([
            "TP Physique",
            "physique",
            "Labo de physique",
            heureToNombre("9h50"),
            heureToNombre("11h50"),
            "Bouchet",
        ]);
    };

    const n2 = () => {
        mettreSemaine[0].push([
            "Anglais",
            "anglais",
            "33",
            14,
            15,
            "Bocquillon",
        ]);
        mettreSemaine[0].push([
            "TD Physique",
            "physique",
            "20",
            13,
            14,
            "Bouchet",
        ]);
        mettreSemaine[4].push([
            "TD Maths",
            "maths",
            "20",
            heureToNombre("9h50"),
            heureToNombre("11h50"),
            "Aufranc",
        ]);
        mettreSemaine[4].push([
            "TP Physique",
            "physique",
            "Labo de physique",
            heureToNombre("7h50"),
            heureToNombre("9h50"),
            "Bouchet",
        ]);
    };

    if (semaine % 2 == 1) {
        if (k % 2 == 1) {
            n1();
        } else {
            n2();
        }
    } else {
        if (k % 2 == 1) {
            n2();
        } else {
            n1();
        }
    }

    // Groupes d'info
    if (groupeI == 1) {
        mettreSemaine[3].push(["TP Info", "info", "26", 11, 13, "Rozsavolgyi"]);
    }
    if (groupeI == 2) {
        mettreSemaine[3].push(["TP Info", "info", "26", 14, 16, "Rozsavolgyi"]);
    }
    if (groupeI == 3) {
        mettreSemaine[3].push(["TP Info", "info", "26", 16, 18, "Rozsavolgyi"]);
    }

    // Python pour si
    if (k <= 3) {
        if (semaine <= 24) {
            mettreSemaine[1].push([
                "Python",
                "info",
                "?",
                16,
                18,
                "Rozsavolgyi",
            ]);
        } else {
            mettreSemaine[2].push([
                "Python",
                "info",
                "?",
                17,
                19,
                "Rozsavolgyi",
            ]);
        }
    }

    // goupes de LV2
    if (k == 4) {
        mettreSemaine[1].push(["Espagnol", "lv2", "?", 17, 19, "LV2"]);
    } else if ([2, 6, 14, 15, 16].includes(k)) {
        mettreSemaine[3].push(["LV2", "lv2", "?", 17, 19, "LV2"]);
    }

    // ajout de tout les cours dans l'EDT au bon endroit
    for (let jourDeSemaine = 0; jourDeSemaine < 5; jourDeSemaine++) {
        mettreSemaine[jourDeSemaine].forEach((cou) => {
            let bon = false;
            EDT[jourDeSemaine].forEach((e, i) => {
                if (bon) return;
                if (e[3] > cou[3]) {
                    EDT[jourDeSemaine].splice(i, 0, cou);
                    bon = true;
                }
            });
            if (bon == false) {
                EDT[jourDeSemaine].push(cou);
            }
        });
    }

    // ajout de toutes les kholles dans l'EDT
    let [matiere, mess] = getKholes(k, semaine);
    // console.log(matiere)
    for (let jour = 0; jour < matiere.length; jour++) {
        matiere[jour].forEach((kh) => {
            let bon = false;
            EDT[jour].forEach((e, i) => {
                if (bon) return;
                if (e[3] > Math.round(heureToNombre(kh[3]))) {
                    EDT[jour].splice(i, 0, kh);
                    bon = true;
                }
            });
            if (bon == false) {
                EDT[jour].push(kh);
            }
        });
    }

    // hot fix:
    Object.keys(hotfix).forEach((jourId) => {
        const s = jourId.split("/");
        if (Number(s[0]) == semaine) {
            // log(0, "Semaine de HOTFIX ! jour : " + jours[s[1]-1])
            let done = false;
            for (let i = 0; i < hotfix[jourId].length && !done; i++) {
                const poss = hotfix[jourId][i];
                if (poss[0] == "e") {
                    // log(0, "validée : tout le monde !")
                    EDT[s[1]] = poss[1];
                    done = true;
                }
                if (poss[0] == "p" && k % 2 == 0) {
                    // log(0, "validée : groupe pair")
                    EDT[s[1]] = poss[1];
                    done = true;
                } else if (poss[0] == "i" && k % 2 == 1) {
                    // log(0, "validée : groupe impair")
                    EDT[s[1]] = poss[1];
                    done = true;
                } else if (Number(poss[0]) == k) {
                    // log(0, "validée : groupe " + k)
                    EDT[s[1]] = poss[1];
                    done = true;
                }
                if (done) {
                    mess = poss[2];
                }
            }
        }
    });
    return [EDT, mess];
};

module.exports = {
    getKholes,
    makeEDT,
    groupesPers,
};
