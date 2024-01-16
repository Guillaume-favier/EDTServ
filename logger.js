const fs = require("fs")
const path = require("path")
const logPath = path.join(__dirname, "log.txt")

if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "", "utf8")
}

const loglevelshow = 0

const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]

const log = (level,text) => {
    const txt = "[" + levels[level] + "] at " + (new Date()).toISOString() + " : " + text
    fs.appendFileSync(logPath, txt + "\n", "utf8")
    if (level >= loglevelshow) {
        switch (level) {
            case 0:
                console.log(txt)
                break;
            case 1:
                console.log(txt)
                break;
            case 2:
                console.warn(txt)
                break;
            case 3:
                console.error(txt)
                break;
            case 4:
                console.error(txt)
                break;
            default:
                break;
        }
    }
}

module.exports = {
    log
}