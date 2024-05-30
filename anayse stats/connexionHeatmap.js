const graphToHeatmap = (tograph) => {
    let heatmap = []
    let s2 = true
    tograph.forEach(element => { // chaque élément de la liste représente un jour composé d'une liste avec toutes les heures
        jour = (new Date(element.time)).setHours(0, 0, 0, 0)
        if (s2 || heatmap[heatmap.length - 1].jour != jour) {
            s2 = false
            let temp = {
            }
            for (let i = 0; i < 24; i++) {
                temp[i+"h"] = 0
            }

            temp["jour"] = (new Date(jour)).toISOString()
            heatmap.push(temp)
        }
        heatmap[heatmap.length - 1][(new Date(element.time)).getHours()+"h"] += element.conn
    });
    return heatmap
}

module.exports = graphToHeatmap