
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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
jours = ["Lundi", " Mardi", "Mercredi", "Jeudi", "Vendredi"]

async function getJson(url) {
    const response = await fetch(url);
    const jj = await response.json();
    return jj
}


async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
}

const resetEDT = () => {
    const copy = document.getElementById("EDT2").cloneNode(true);
    document.getElementById("EDT").remove()
    document.getElementById("tocopy").appendChild(copy)
    document.getElementById("EDT2").id = "EDT"

}

const afficheEDT = (table, reset = true) => {
    console.log("affichage", table)
    console.log("Affichage de l'emplois du temps")
    if (reset) resetEDT()

    const joursN = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]

    let eEDT = document.getElementById("EDT")
    let start = 7.75
    let last = [start, start, start, start]
    for (let i = start; i < 19.25; i += 0.25) { // De 8h à 19h
        let tr = document.createElement("tr") // ligne pour toute la semaine

        const heure = document.createElement("td")
        tr.className += "trHeure"
        if (i - Math.floor(i) < 0.01) { // si l'heure est ronde
            heure.className = "heure"
            heure.innerText = i + "h" //colonne de gauche des heures
        } else {
            heure.className = "Fakheure"
            heure.innerText = "\n"
        }
        tr.appendChild(heure)
        for (let jour = 0; jour < 5; jour++) { // pour toutes les journées
            let done = false
            for (let numE = 0; numE < table[jour].length; numE++) { // cherche à partir de tout les cours de la journée
                const element = table[jour][numE];
                // console.log("pour ", nombreToHeure(i), "et", element[3], nombreToHeure(element[2]),"pour",element)
                if (Math.abs(i - element[3]) < 0.125) {
                    // console.log("ajout", element)
                    done = true
                    last[jour] = element[4]
                    const coursMatiere = element[1]
                    const td = document.createElement("td")
                    td.className = "cours " + coursMatiere
                    td.innerText = element[0] + "\n (" + element[2] + ")\n" + nombreToHeure(element[3]) + " - " + nombreToHeure(element[4])
                    const n = Math.round(4 * (element[4] - element[3]))
                    if (n != 1) td.rowSpan = n
                    tr.appendChild(td)
                    break


                }
            }
            if (done == false && last[jour] <= i) {
                // console.log("skip")
                last[jour] += 0.25
                const td = document.createElement("td")
                td.innerText = "\n"
                tr.appendChild(td)
                continue
            }
        }
        eEDT.appendChild(tr)
    }
}
const pushIfNotIn = (arr, el) => {
    let val = JSON.stringify(el)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (JSON.stringify(element) == val) return
    }
    arr.push(el)
}

const isOverlap = (a, b) => {
    if (a[3] == b[3]) return true
    if (a[3] < b[3]) {
        if (a[4] <= b[3]) return false
        else return true
    } else {
        if (b[4] <= a[3]) return false
        else return true
    }
}

const detectOverlap = (arr) => {
    let res = []
    for (let jour = 0; jour < 5; jour++) {
        for (let i = 0; i < arr[jour].length; i++) {
            const element = arr[jour][i];
            for (let j = i + 1; j < arr[jour].length; j++) {
                const element2 = arr[jour][j];
                if (isOverlap(element, element2)) {
                    pushIfNotIn(res, [element, element2, jour])
                }
            }
        }
    }
    return res
}   