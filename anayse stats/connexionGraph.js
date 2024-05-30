
const mergedToGraph = (merged) => {
    let tograph = []
    let start = true;
    merged.forEach((el) => { // la liste est composée de toutes les connexions par heure
        let t = new Date(el[0]).setMinutes(0, 0, 0)
        if (start || tograph[tograph.length - 1].time != t) {
            if (start == false && t - tograph[tograph.length - 1].time > 3600000) {
                tograph.push({
                    time: tograph[tograph.length - 1].time + 3600000,
                    conn: 0
                })
            }
            if (start == false && t - tograph[tograph.length - 1].time > 2 * 3600000) {
                tograph.push({
                    time: t - 3600000,
                    conn: 0
                })
            }
            start = false
            tograph.push({
                time: t,
                conn: 1
            })
        } else {
            tograph[tograph.length - 1].conn++
        }
    })
    return tograph
}

module.exports = mergedToGraph