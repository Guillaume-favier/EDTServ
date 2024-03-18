
const fs = require("fs");
const path = require("path");
const logPath = path.join(__dirname, "logs", "log.txt");
const connectionFilePath = path.join(__dirname, "logs", "connections.json");

if (!fs.existsSync(path.join(__dirname, "logs"))) {
    fs.mkdirSync(path.join(__dirname, "logs"));
}

if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "", "utf8");
}

if (!fs.existsSync(connectionFilePath)) {
    fs.writeFileSync(connectionFilePath, "[]", "utf8");
}

const loglevelshow = 0;

const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

const log = (level, text) => {
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
    const obj = [
        Date.now(),
        page,
        sucess,
        req.ip,
        req.headers["user-agent"],
        req.query,
    ];
    fs.readFile(connectionFilePath, "utf8", (err, data) => {
        if (err) {
            log(3, "Error reading connection file : " + err);
            return;
        }
        console.log(data)
        const arr = JSON.parse(data);
        console.log(arr)
        arr.push(obj);
        fs.writeFile(
            connectionFilePath,
            JSON.stringify(arr, null, 2),
            "utf8",
            (err) => {
                if (err) {
                    log(3, "Error writing connection file : " + err);
                    return;
                }
            },
        );
    });
};

module.exports = {
    log,
    connection,
};
