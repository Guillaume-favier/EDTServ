const fs = require("fs");
const { log } = require("../../../logger.js");
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const getText = (path) => fs.readFileSync(path.substring(1, path.length), "utf8");

const getJson = (path) => JSON.parse(getText(path));

const heureToNombre = (n) => { // "7h50" -> 7.833333333333333
	if (typeof n == typeof 2) return n;
	if (n.indexOf("h") > -1) {
		let nn = n.split("h");
		return Number(nn[0]) + Number(nn[1]) / 60;
	}
	return Number(n);
};

const nombreToHeure = (n) => { // 7.833333333333333 -> "7h50"
	let reste = n - Math.floor(n);
	if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60);
	return Math.floor(n).toString() + "h";
};

const tableauKholle = getText("/EDT/MPI/s1/tableDeKholles.txt"); // document qui répertorie quels groupes khôllent en fonction des semaines
const refKholle = getJson("/EDT/MPI/s1/referenceKholle.json"); // document qui répertorie les khôlles et les khôlleur en fonction de l'index dans le tableau de kholle
const orgEDT = getJson("/EDT/MPI/s1/EDT.json"); // document qui répertorie les les cours communs
const groupes = getJson("/EDT/MPI/groupes.json")
const groupesSpeciaux = getJson("/EDT/MPI/s1/petitsGroupes.json"); // document qui répertorie le nom des memebres de chaques groupes
const hotfix = getJson("/EDT/MPI/s1/hotfix.json"); // document qui répertorie les hotfixs
let EDT = clone(orgEDT); // variable qui stocke tout l'EDTA qui sera à consulter
let tableauInfo = [];

const majPrem = (s) => s[0].toUpperCase() + s.substring(1);

function clone(a) { // Je sais que c'est une horreur mais je n'ai pas trouvé d'autre solution
	return JSON.parse(JSON.stringify(a));
}

const trueHeure = (n) => {
	if (typeof n == typeof 2) {
		return n;
	}
	return heureToNombre(n);
};


// construction du tableau de kholle

const vraiNumeroGroupe = (g) => {
	if (["a","b","c"].includes(g[g.length-1])) return [false, Number(g.slice(0,-1))]
	else return [true, Number(g)]
}

const vraiColloneSemaine = (s) => {
	const r = [0,0,0,0,1,2,3,0,4,5,6,7,8,9,0,10,11,12,13,14,0,15,16,17,18][s]
	return r-1
}

const tabl = [];
tableauKholle.split("\n").forEach(ligne => {
	tabl.push(ligne.split(" "));
});



const getKholles = (k, s, pers) => {
	let numeroDansLeGroupe = 0;
	for (let i = (3 * (k - 1) < 0 ? 0 : 3 * (k - 1)); i < Object.keys(groupes).length; i++) {
		if (groupes[Object.keys(groupes)[i]] == k) numeroDansLeGroupe++
		if (Object.keys(groupes)[i] == pers) break;
	}
	let all = [];
	for (let i = 0; i < 5; i++) {
		all.push([]);
	}
	const vs = vraiColloneSemaine(s)
	// console.log(vs)
	if (vs == -1) return all
	for (let ligneIndex = 0; ligneIndex < tabl.length; ligneIndex++) {
		const ligne = tabl[ligneIndex];
		// console.log(ligneIndex)
		const groupe = vraiNumeroGroupe(ligne[vs]);
		// console.log(groupe, k, numeroDansLeGroupe, ligne[vs])
		if (groupe[1] == k && (groupe[0] || ["a", "b", "c"][numeroDansLeGroupe - 1] == ligne[vs][ligne[vs].length - 1])) {
			const kh = refKholle[ligneIndex];
			all[kh[1] - 1].push(kh[0]);
		}
	}
	// console.log(all, numeroDansLeGroupe, s)



	return all;
}

// getKholles(9,4,1)

const testparams = () => {
	return groupeK != 0;
};

const makeEDT = (pers, semaine) => {
	const k = groupes[pers]

	EDT = []
	EDT = clone(orgEDT);
	let kholles = [];
	for (let i = 0; i < 16; i++) {
		kholles.push([]);
	}
	let mettreSemaine = [[], [], [], [], []];
	// on ajoute sans ordre précis les cours kholles et TD à ajouter à l'EDT pour on les remmettra bien dans l'EDT plus tard
	const g1 = () => { // étoilés
		mettreSemaine[0].push(["TD Physique", "physique", "34", 16, 17, "Boqueho"]);
		mettreSemaine[2].push(["TD Anglais", "anglais", "25", 8, 9, "Calvin"]);
		mettreSemaine[2].push(["TD Maths", "maths", "25", 9, 10, "Broizat"]);
		mettreSemaine[2].push(["TP Info", "info", "37", 13, 15, "Camponovo"]);
		mettreSemaine[2].push(["TD Maths", "maths", "34", 15, 17, "Broizat"]);
	};
	// TODO : les groupes d'anglais 1 et 2
/*
	LV1AGLG1	Etudiants LV1 Anglais du groupe G1 (MPI*)	1/3 classe environ
	LV1AGLG2	Etudiants LV1 Anglais du groupe G2 (MPI)	2/3 classe environ
	LV2AGLG1	Etudiants LV2 Anglais du groupe G1 (MPI*)	Très peu
	LV2AGLG2	Etudiants LV2 Anglais du groupe G2 (MPI)	Très peu
*/

	const g2 = () => { // non étoilés
		mettreSemaine[0].push(["TD Physique", "physique", "34", 15, 16, "Boqueho"]);
		mettreSemaine[2].push(["TD Maths", "maths", "34", 8, 9, "Broizat"]);
		mettreSemaine[2].push(["TD Anglais", "anglais", "34", 9, 10, "Calvin"]); //  certains ne font pas anglais LV2
		mettreSemaine[2].push(["TD Maths", "maths", "34", 13, 15, "Broizat"]);
	}

	const premierTPinfo = () => mettreSemaine[2].push(["TP Info", "info", "37", 15, 17, "Camponovo"]);
	const deuxiemeTPinfo = () => mettreSemaine[2].push(["TP Info", "info", "37", 17, 19, "Camponovo"]);

	const tpa = () => mettreSemaine[3].push(["TP Physique", "physique", "labo", 13, 15, "Boqueho"]);
	const tpb = () => mettreSemaine[3].push(["TP Physique", "physique", "labo", 15, 17, "Boqueho"]);

	const spe = groupesSpeciaux[pers]

	const listTPInfo = [7,8,9,10,10,1,2,3,4,5,6,6,7,8,9,10,1,1,2,3,4]
	//                  7 8 9    10 1 2 3 4 5 6   7 8 9 10   1 2 3 4

	if (spe[0] == "G1") g1()
	else if (semaine <= 3 ) {
		if (spe[0] == "G2A") {
			g2()
			if (semaine % 2 == 0)  deuxiemeTPinfo()
			else premierTPinfo()
		}
		else if (spe[0] == "G2B") {
			g2()
			if (semaine % 2 == 0) premierTPinfo()
			else deuxiemeTPinfo()
		}
	}else {
		g2()
		if (listTPInfo[semaine-4]%2 == k%2) premierTPinfo()
		else deuxiemeTPinfo()
	}

	// tableau d'alternance des TP de physique 0 groupe pair en TPA, 1 groupe impair en TPA et inversement
	const listPhys = [0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1];

	if (semaine <= 2) { // ancien système de TP de physique avec alternance en fonction de l'ordre alphabetique
		if (spe[1] == "TPA") {
			if (semaine % 2 == 1) tpa()
			else tpb()
		} else {
			if (semaine % 2 == 0) tpa()
			else tpb()
		}
	}

	else if (k[0]%2==listPhys[semaine-3]) tpa() // mise en place du nouveau système d'alternance
	else if (k[0] % 2 != listPhys[semaine - 3]) tpb()
	
	if (semaine % 2 == 0) mettreSemaine[4].push(["TIPE Physique", "tipe", "Labo Physique", heureToNombre("9h50"), heureToNombre("11h50"), "Boqueho"]);
	else mettreSemaine[4].push(["TIPE Info", "tipe", "37", heureToNombre("9h50"), heureToNombre("11h50"), "Camponovo"]);


	// TODO : goupes de LV2
	if ([].includes(k)) {
		mettreSemaine[3].push(["LV2", "lv2", "lv2", 17, 19, "LV2"]);
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
	const matiere = getKholles(k[0], semaine, pers);
	for (let jour = 0; jour < matiere.length; jour++) { // ajoute des l'ordre des cours
		matiere[jour].forEach((kh) => {
			let bon = false;
			EDT[jour].forEach((e, i) => {
				if (bon) return;
				if (e[3] > kh[3]) {
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
				} else if (poss[0] == pers) {
					// log(0, "validée : perseonne " + pers)
					EDT[s[1]] = poss[1];
					done = true;
				}
			}
		}
	});
	return EDT;
};
module.exports = {
	getKholles,
	makeEDT,
};
