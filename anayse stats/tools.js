
const listDateToHours = (arr) => {
    let res = []
    for (let i = 0; i < 24; i++) res.push(0)
    for (let i = 0; i < arr.length; i++) {
        const element = Math.floor(arr[i]);
        res[element]++
    }
    return res
}

const moyenne = (arr) => {
    return arr.reduce((a, b) => a + b, 0) / arr.length
}

const medianne = (arr) => {
    arr.sort()
    if (arr.length % 2 == 0) {
        return (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2
    } else {
        return arr[Math.floor(arr.length / 2)]
    }
}

const floatHours = (time) => {
    const T = new Date(time)
    return T.getHours() + (T.getMinutes() / 60) + (T.getSeconds() / 3600)
}

const dispfloatHours = (time) => {
    const H = math.floor(time)
    const M = math.floor((time - H) * 60)
    const S = math.floor((time - H - M / 60) * 3600)
    console.log(H + "h" + M + "m" + S + "s")
}

const ApproxHour = (times) => {
    let res = []
    for (let i = 0; i < times.length; i++) {
        res.push(new Date(times[i]).setMinutes(0, 0, 0))
    }
    return res
}

module.exports = { listDateToHours, moyenne, medianne, floatHours, dispfloatHours, ApproxHour }