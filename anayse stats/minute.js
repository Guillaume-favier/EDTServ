
const mergedToMinutesGraph = (merged, start) => {
    let tograph = []
    let i = 0
    merged.forEach((el) => { // la liste est composée de toutes les connexions par heure
        if (start < el[0]) return
        i++
        tograph.push({
            time: el[0],
            conn: i
        })
    })
    return tograph
}

module.exports = mergedToMinutesGraph