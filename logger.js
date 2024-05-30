
const fs = require("fs");
const path = require("path");
const logPath = path.join(__dirname, "logs", "log.txt");
let connectionFilePath = path.join(__dirname, "logs", "connections.json");

const checkFile = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate() }`;
    connectionFilePath = path.join(__dirname, "logs", "connections " + formattedDate +".json");
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
        fs.mkdirSync(path.join(__dirname, "logs"));
    }
    
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "", "utf8");
    }
    
    if (!fs.existsSync(connectionFilePath)) {
        fs.writeFileSync(connectionFilePath, "[]", "utf8");
    }
}

const loglevelshow = 0;

const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

const log = (level, text) => {
    checkFile()
    const txt =
        "[" + levels[level] + "] at " + new Date().toISOString() + " : " + text;
    fs.appendFileSync(logPath, txt + "\n", "utf8");
    if (level >= loglevelshow) {
        switch (level) {
            case 0:
                console.log(txt);
                break;
            case 1:
                console.log(txt);
                break;
            case 2:
                console.warn(txt);
                break;
            case 3:
                console.error(txt);
                break;
            case 4:
                console.error(txt);
                break;
            default:
                break;
        }
    }
};

const connection = (page, req, sucess) => {
    checkFile()
    const obj = [
        Date.now(),
        page,
        sucess,
        req.ip,
        req.headers["user-agent"],
        req.query,
    ];
    console.log(obj)

    const data = fs.readFileSync(connectionFilePath, "utf8")
    const arr = JSON.parse(data);
    arr.push(obj);
    fs.writeFileSync(connectionFilePath, JSON.stringify(arr), "utf8")
};

module.exports = {
    log,
    connection,
};
