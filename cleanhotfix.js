const fs = require("fs")

let donne = JSON.parse(fs.readFileSync("EDT/hotfix.json", "utf8"))
let ld = Object.keys(donne)
ld.forEach(element => {
    for (let i = 0; i < donne[element].length; i++) {
        const el = donne[element][i];
        for (let j = 0; j < el[1].length; j++) {
            let cour = el[1][j];


            if (cour[0].startsWith(" ")) {
                cour[0] = cour[0].slice(1, cour[0].length)
            }
            let nc = [cour[0], "", cour[1], cour[2], cour[3], ""]
            if (cour[0].startsWith("TD")) {
                nc[1] = cour[0].split("TD ")[1].toLowerCase()
            }
            else if (cour[0].startsWith("TP")) {
                nc[1] = cour[0].split("TP ")[1].toLowerCase()
            } else if (cour[0].startsWith("Khôlle")) {
                nc[1] = cour[0].split("Khôlle ")[1].toLowerCase().replace("ç","c")
            }else {
                nc[1] = cour[0].toLowerCase().replace("ç", "c")
            }
            console.log(nc)
            el[1][j] = nc
        };
    };
});

fs.writeFileSync("EDT/newHotFix.json",JSON.stringify(donne,null,4),"utf-8")