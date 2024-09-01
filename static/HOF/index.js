async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
}
async function getJson(url) {
    const response = await fetch(url);
    const jj = await response.json();
    return jj
}


;(async() => {
    let allHOF = await getJson("https://guillaume-favier.github.io/HOF/HOF.json");
    Object.keys(allHOF).forEach(e => {
        const div = document.createElement("div")
        const h = document.createElement("h3")
        h.innerText = e+" :"
        div.appendChild(h)
        const table = document.createElement("table")

        const tr = document.createElement("tr")
        const matiere = document.createElement("th")
        const eleve = document.createElement("th")
        const note = document.createElement("th")
        const date = document.createElement("th")
        matiere.innerText = "Matière"
        eleve.innerText = "Elève"
        note.innerText = "Note"
        date.innerText = "Date"
        tr.appendChild(matiere)
        tr.appendChild(eleve)
        tr.appendChild(note)
        tr.appendChild(date)
        table.appendChild(tr)
        console.log(allHOF)
        allHOF[e].forEach(f => {
            const tr = document.createElement("tr")
            const matiere = document.createElement("td")
            const eleve = document.createElement("td")
            const note = document.createElement("td")
            const date = document.createElement("td")
            matiere.innerText = f["matiere"]
            eleve.innerText = f["eleve"]
            note.innerText = f["note"]
            date.innerText = f["date"]
            tr.appendChild(matiere)
            tr.appendChild(eleve)
            tr.appendChild(note)
            tr.appendChild(date)
            table.appendChild(tr)
        })
        div.appendChild(table)
        document.getElementById("HOF").appendChild(div)
    })

    const Bdiv = document.getElementById("contrib")
    const table = document.getElementById("listContr")
    let contrib = await getJson("https://api.github.com/repos/Guillaume-favier/HOF/contributors")
    contrib.forEach((e,i) => {
        const div = document.createElement("div")
        const a = document.createElement("a")
        a.href = e.html_url
        const a2 = a.cloneNode(true);
        a.innerHTML = `<img src="${e.avatar_url}" alt="pfp" width="100" height="100">`

        

        a2.innerText = e.login
        const nb = document.createElement("p")
        nb.innerText = e.contributions == 1 ? e.contributions + " contribution" : e.contributions + " contributions"

        div.appendChild(a)
        div.appendChild(document.createElement("br"))
        div.appendChild(a2)
        div.appendChild(nb)

        const comments = {
            "Guillaume-favier": "Le maitre",
            "Getoune": "Le sage",
            "Hamanarca": "Le BG",
            "NolanGlotin": "Le "+["premier","deuxième","troisième","quatrième","cinquième","sixième"][i]
        }
        
        if (Object.keys(comments).includes(e.login)){
            const comm = document.createElement("i")
            comm.innerText = comments[e.login]
            div.appendChild(comm)
        }
        table.appendChild(div)
    })
    

    
})()