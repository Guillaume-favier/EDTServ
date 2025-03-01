document.body.appendChild(document.createElement("br"))
document.body.appendChild(document.createElement("br"))


function sc(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function cg(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
function setCook(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCook(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCook("dark") == "") {
    setCook("dark", "false", 365)
}

const applyTheme = () => {
    const logoMP2I = document.getElementsByClassName("logoMP2I")
    const logoMPI = document.getElementsByClassName("logoMPI")
    if (getCook("dark") == "true") {
        document.getElementById("genestyle").setAttribute("href", "/nightGeneral.css")
        if(logoMP2I[0]) {
            logoMP2I[0].src = "/asset/MP2I blanc.png"
            logoMPI[0].src = "/asset/MPI blanc.png"
        }
    } else {
        document.getElementById("genestyle").setAttribute("href", "/general.css")
        if (logoMP2I[0]) {
            logoMP2I[0].src = "/asset/MP2I noir.png"
            logoMPI[0].src = "/asset/MPI noir.png"
        }
    }
}


document.getElementById("dark").onclick = () => {
    if (getCook("dark") == "true") {
        setCook("dark", "false", 365)
        applyTheme()
    }else{
        setCook("dark", "true", 365)
        applyTheme()
    }
}
applyTheme()

let isPages = true
;(async() => {
    const response = await fetch("/loc");
    const u = document.getElementById("url")
    if (response.ok) {
        isPages = false
        u.innerHTML = '<i class="fa-solid fa-server"></i> '
    }else {
        u.innerHTML = '<i class="fa-solid fa-file"></i> '
    }
    const a = document.createElement('a')
    a.href = "/"
    a.innerText = window.location.hostname 
    u.appendChild(a)
})()

if (cg("id") == "") {
    sc("id", Math.random().toString(36).substr(2, 9), 365);
    fetch("/api/v2/log/?id=" + cg("id"));
}
else sc("id", cg("id"), 365);