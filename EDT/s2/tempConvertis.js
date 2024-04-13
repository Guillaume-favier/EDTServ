const fs = require("fs")
const stringify = require("json-stringify-pretty-compact");
const data = JSON.parse(fs.readFileSync("./kholles.json").toString())
const majPrem = (s) => s[0].toUpperCase() + s.substring(1);

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

let no = {}
Object.keys(data).forEach(key => {
    no[key] = []
    
    no[key]= data[key].map(kh => {
        console.log(kh)
        if (kh.length < 3) return [];

        return khollesToEDT(kh, key)
    })
    
});
fs.writeFileSync("khollesnew.json",stringify(no))