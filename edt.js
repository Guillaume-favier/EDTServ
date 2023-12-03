const fs = require("fs")
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

const heureToNombre = (n) => {
    if (typeof n == typeof 2) return n
    if (n.indexOf("h") > -1) {
	let nn = n.split("h")
	return Number(nn[0]) + (Number(nn[1]) / 60)
    } return Number(n)
}

const nombreToHeure = (n) => {
    let reste = n - Math.floor(n)
    if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60)
    return Math.floor(n).toString() + "h"
}

const ajusteDate = (n) => {
    return n < 10 ? "0" + n : n
}
const getText = (path) => fs.readFileSync(path.substring(1, path.length), "utf8")

const getJson = (path) => JSON.parse(getText(path))

const db = getJson("/EDT/kholes.json")            // document qui répertorie les khôlles
const ds = getJson("/EDT/DS.json")                // document qui répertorie les DS
const info = getText("/EDT/info.txt")             // document qui répertorie la matrice pour les groupes d'informatique
const orgEDT = getJson("/EDT/EDT.json")           // document qui répertorie les les cours communs
const semaineNom = getJson("/EDT/semaine.json")   // document qui répertorie les dates des lundis de chaques semaines
const groupesPers = getJson("/EDT/groupes.json")  // document qui répertorie le nom des memebres de chaques groupes
const hotfix = getJson("/EDT/newHotFix.json")        // document qui répertorie les hotfixs
let EDT = clone(orgEDT) // variable qui stocke tout l'EDTA qui sera à consulter
let tableauInfo = []

// Traitement des groupes d'infos dans un tableau
info.split("\n").forEach(lign => {
    tableauInfo.push(lign.split(" "))
})

const getNumJours = (semaine) => {
	const base = semaineNom[semaine - 2].split("/");

	let n = (new Date(Number("20" + base[2]), Number(base[1]) - 1, Number(base[0]))).getTime()
	const j = [];
	const jj = [];
	for (let i = 0; i < 5; i++) {
		const now = new Date(n)
		jj.push([now.getDate(), now.getMonth() + 1])
		j.push(jours[i] + " " + ajusteDate(now.getDate()) + "/" + ajusteDate(now.getMonth() + 1))
		n += 24 * 3600 * 1000
	}
	return [j,jj]
}

const majPrem = (s) => s[0].toUpperCase() + s.substring(1)


const trueHeure = (n) => {
	if (typeof n == typeof 2) {
		return n
	}
	return heureToNombre(n)
}


const khollesToEDT = (kh,ma) => {
	// ["Aufranc", 2, 15, "20"] -> ["Khôlle Maths","maths","20",15,16,"Aufranc"]
	// console.log(kh)
	return [
		"Khôlle " +majPrem(ma),
		ma,
		kh[3],
		trueHeure(kh[2]),
		trueHeure(kh[2])+1,
		kh[0]
	]
}

const getC = (k, s) => {
	let c = (16+ Number(k) - Number(s) -1) % 16 +1
	return c
}

// cette fonction rassemble toute les kholles en respectant le règles spécifiques
const getKholes = (k, s) => {
	// console.log(k,s)
	s -= 3
	let c = getC(k, s)
	// console.log(c)
	let all = []
	for (let i = 0; i < 5; i++) {
		all.push([])
	}
	const maths = db["maths"][c - 1]
	all[maths[1] - 1].push(khollesToEDT(maths, "maths"))

    if (c % 2 == 1) {
		const physique = db["physique"][c - 1]
		all[physique[1] - 1].push(khollesToEDT(physique, "physique"))
	} else {
		const anglais = db["anglais"][c - 1]
		all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"))
    }
    if (c == 1 || c == 10) {

		const info = db["info"][c - 1]
		all[info[1] - 1].push(khollesToEDT(info, "anglais"))
    }
    if ((s % 2 == 0 && (c == 2 || c == 5)) || (s % 2 == 1 && (c == 9 || c == 14))) {

		const francais = db["francais"][c - 1]
		all[francais[1] - 1].push(khollesToEDT(francais, "français"))
    }
    return all
}


const testparams = () => {
    return groupeK != 0
}


const makeEDT = (k, semaine) => {
    groupeI = tableauInfo[k - 1][semaine - 3]
    EDT = []
    EDT = clone(orgEDT)
	kholes = []
	for (let i = 0; i < 16; i++) {
		kholes.push([])
	}
    let mettreSemaine = [[], [], [], [], []]
    // on ajoute sans ordre précis les cours kholles et TD à ajouter à l'EDT pour on les remmettra bien dans l'EDT plus tard
    const n1 = () => {
		mettreSemaine[0].push(["Anglais", "33", 13, 14])
		mettreSemaine[0].push(["TD Physique", "20", 14, 16, "Physique"])
		mettreSemaine[4].push(["TD Maths", "20", heureToNombre("7h50"), heureToNombre("9h50"), "Maths"])
		mettreSemaine[4].push(["TP Physique", "B214", heureToNombre("9h50"), heureToNombre("11h50"), "Physique"])
	}

	const n2 = () => {
		mettreSemaine[0].push(["Anglais", "33", 14, 15])
		mettreSemaine[0].push(["TD Physique", "20", 12, 14, "Physique"])
		mettreSemaine[4].push(["TD Maths", "20", heureToNombre("9h50"), heureToNombre("11h50"), "Maths"])
		mettreSemaine[4].push(["TP Physique", "B214", heureToNombre("7h50"), heureToNombre("9h50"), "Physique"])
	}

	for (let i = 0; i < 16; i++) {
		kholes[i] = (16 - i + Number(k) - 1) % 16 + 1;
	}

	const semaineC = kholes[semaine - 3]
	if (semaine % 2 == 1) {
		if (k % 2 == 1) {
			if (semaineC == 5) {
				mettreSemaine[0].push(["TD SI", "20", 10, 11, "SI"])
			}
			else mettreSemaine[0].push(["TD SI", "20", 9, 10, "SI"])
				n1()
		} else {
			if (semaineC == 6) {
				mettreSemaine[0].push(["TD SI", "20", 9, 10, "SI"])
			}
			else mettreSemaine[0].push(["TD SI", "20", 10, 11, "SI"])
			n2()
		}
	} else {
		if (k % 2 == 1) {
			if (semaineC == 6) {
				mettreSemaine[0].push(["TD SI", "20", 9, 10, "SI"])
			}
			else mettreSemaine[0].push(["TD SI", "20", 10, 11, "SI"])
			n2()
		} else {
			if (semaineC == 5) {
			mettreSemaine[0].push(["TD SI", "20", 10, 11, "SI"])
			}
			else mettreSemaine[0].push(["TD SI", "20", 9, 10, "SI"])
			n1()
		}
	}

	// Groupes d'info 
	if (groupeI == 1 || groupeI == "S") {
		mettreSemaine[1].push(["TP Info", "37", 15, 17, "Info"])
	} if (groupeI == 2 || groupeI == "S") {
		mettreSemaine[1].push(["TP Info", "37", 17, 19, "Info"])
	} if (groupeI == 3 || groupeI == "S") {
		mettreSemaine[2].push(["TP Info", "37", 16, 18, "Info"])
	}
	// if (groupeI == "S") alert("Il faut se répartir les groupes d'info !")


	// goupes de LV2
	if ([1, 6, 14, 15, 16].includes(k)) {
		mettreSemaine[3].push(["LV2", "🤷‍♂️", 17, 19, "LV2"])
	}

	// ajout de tout les cours dans l'EDT au bon endroit
	for (let jourDeSemaine = 0; jourDeSemaine < 5; jourDeSemaine++) {
		mettreSemaine[jourDeSemaine].forEach(cou => {
		    let bon = false;
		    EDT[jourDeSemaine].forEach((e, i) => {
				if (bon) return
				if (e[3] > cou[3]) {
					EDT[jourDeSemaine].splice(i, 0, cou);
					bon = true
				}
		    });
		    if (bon == false) {
				EDT[jourDeSemaine].push(cou)
		    }
		})
	}

	// ajout de toutes les kholles dans l'EDT
	const matiere = getKholes(k, semaine);
	// console.log(matiere)
	for (let jour = 0; jour < matiere.length; jour++) {
		const element = matiere[jour];
		
		matiere[jour].forEach(kh => {
			// console.log("kh",kh)
			let bon = false;
			EDT[jour].forEach((e, i) => {
				if (bon) return
				// console.log("ici",e,kh)
				if (e[3] > Math.round(heureToNombre(kh[3]))) {
					EDT[jour].splice(i, 0, kh);
					bon = true
				}
			})
			if (bon == false) {
				EDT[jour].push(kh)
			}
		});
	}

	    // hot fix:
	Object.keys(hotfix).forEach(jourId => {
		const s = jourId.split("/")
		if (Number(s[0]) == semaine) {
		    console.log("Semaine de HOTFIX ! jour : " + jours[s[1]-1])
		    let done = false
		    for (let i = 0; i < hotfix[jourId].length && !done; i++) {
				const poss = hotfix[jourId][i];
				if (poss[0] == "e") {
			    	console.log("validée : tout le monde !")
			    	EDT[s[1]] = poss[1]
			    	// console.log(EDT)
			    	done = true
				}
				if (poss[0] == "p" && k % 2 == 0) {
			    	console.log("validée : groupe pair")
			    	EDT[s[1]] = poss[1]
			    	done = true
				} else if (poss[0] == "i" && k % 2 == 1) {
			    	console.log("validée : groupe impair")
			    	EDT[s[1]] = poss[1]
			    	done = true
				} else if (Number(poss[0]) == k) {
			    	console.log("validée : groupe " + k)
			    	EDT[s[1]] = poss[1]
			    	done = true
				}
			}
		}
	})
	return EDT
}

const regroupeInfo = (k, s) => {
	const days = getNumJours(s);
	let res = {
		"ok":true,
		"days": days[1],
		"fullDays": days[0],
		"EDT": makeEDT(k, s),
		"kholles": getKholes(k, s),
	}
	return res
}

module.exports = {
	regroupeInfo,
	makeEDT,
	getNumJours
}