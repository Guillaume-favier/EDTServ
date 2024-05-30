const graphToHeatmap = (tograph) => {
    let heatmap = []
    let s2 = true
    tograph.forEach(element => { // chaque élément de la liste représente un jour composé d'une liste avec toutes les heures
        jour = (new Date(element.time)).setHours(0, 0, 0, 0)
        if (s2 || heatmap[heatmap.length - 1].jour != jour) {
            s2 = false
            let tempdata = []
            for (let i = 0; i < 24; i++) {
                tempdata.push(0)
            }
            heatmap.push({
                jour: jour,
                data: tempdata
            })
        }
        heatmap[heatmap.length - 1].data[(new Date(element.time)).getHours()] += element.conn
    });
    return heatmap
}

module.exports = graphToHeatmap