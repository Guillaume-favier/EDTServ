const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, "..", "logs")
const dir = fs.readdirSync(root);
let pers = JSON.parse(fs.readFileSync(path.join(__dirname, "all.json")))


// import of the tools
const { listDateToHours, moyenne, medianne, floatHours, dispfloatHours, ApproxHour } = require(path.join(__dirname, "tools.js"))
const mergedToGraph = require(path.join(__dirname, "connexionGraph.js"))
const graphToHeatmap = require(path.join(__dirname, "connexionHeatmap.js"))
const mergedToMinutesGraph = require(path.join(__dirname, "minute.js"))



let data = []
let names = []
let filtered = []
// let merged = []

const getMerged = () => {
    pers = JSON.parse(fs.readFileSync(path.join(__dirname, "all.json")))
    dir.forEach(element => {
        if (element.startsWith("connections ")) {
            names.push(element.split(" ")[1].split(".")[0])
            data.push(JSON.parse(fs.readFileSync(path.join(root, element), 'utf8')))
        }
    }); // ajout de tout les fichiers dans la liste data
    filtered = data.map((el) => {
        return el.filter((el2) => { // on filtre les données pour ne garder que les connexions à l'api de l'edt
            return el2[1] == "/api/v1/all/"
        })
    })

    return filtered.flat() // on merge tout les tableaux
}

// const update = () => {

    
//     let nb = 0
//     let moyHeures = []
//     for (let i = 0; i < 24; i++) moyHeures.push(0)
//     for (let i = 0; i < merged.length; i++) moyHeures[new Date(merged[i][0]).getHours()]++;


//     let personnesFull = {}
//     pers.forEach((p) => {
//         personnesFull[p] = []
//     })

//     for (let i = 0; i < merged.length; i++) {
//         const conn = merged[i];
//         personnesFull[conn[5]["name"]].push(conn[0])
//     }
// }

// update()

const graph = () => {
    // update()
    return mergedToGraph(getMerged())
}
const heatmap = () => {
    // update()
    return graphToHeatmap(graph())
}

const minute = (start) => mergedToMinutesGraph(getMerged(), start)

fs.writeFileSync("heatmap.json", JSON.stringify(heatmap()))
module.exports = { graph, heatmap, minute }