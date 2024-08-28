(async() => {
    const infos = await fetch("https://api.github.com/repos/Guillaume-favier/EDTServ/activity")
    const res = (await infos.json())[0]
    // console.log(res)
    let text = "Dernière mise à jour : " + res.timestamp + "\nPar : " + res.actor.login + "\nType : " + res.activity_type + "\nPrécédent hash : " + res.before +"\nDernier hash : "+res.after
    
    console.log(text)
    if(!isPages){
        const hereJ = await (await fetch("/api/v2/gitVers/")).text()
        const version = hereJ.substring(0, hereJ.length-1) //
        console.log(hereJ)
        let messagePourDebutant = ""
        console.log('"' + res.before + '"', '"' + res.after + '"', '"' + version + '"', (res.after).toLowerCase() == version.toLowerCase())
        if (res.after == version) {
            messagePourDebutant = "Le serveur est à jour !!!"
        } else if (res.before == version){
            messagePourDebutant = "Le serveur à un retard de 1 version. C'est pas beaucoup mais c'est jamais idéal. Si tu veux tu peux me contacter pour que je mette le serveur à jour (c'est pas long)"
        } else {
            messagePourDebutant = "Le serveur à plus d'une version retard. C'est pas idéal du tout. N'hésite pas à contacter pour que je mette le serveur à jour (c'est pas long)"
        }
        text += "\n\n Comme on est sur un vrai server : \nLast operation : " + version + "\n\nSi vous ne comprenez rien en gros : " + messagePourDebutant
    }
    document.getElementById("res").innerText = text

    // password
    const passtxt = document.getElementById("passInp")
    const passCheck = document.getElementById("passCheck")
    const passSend = document.getElementById("passSend")

    passCheck.onchange = e => {
        passtxt.type = e.target.checked ? "text" : "password"
    }

    const sha256 = async (data) => {
        const textAsBuffer = new TextEncoder().encode(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return digest;
    }

    passSend.onclick = async e => {
        const stats = await fetch("/api/v2/stats/?passwd=" + await sha256(passtxt.value))
        const tempStats = await stats.json()
        console.log(tempStats, tempStats["ok"])
        if (!tempStats["ok"]) {
            alert("Mauvais mot de passe")
            passtxt.value = ""
            passtxt.focus();
            passtxt.select();
            return
        }
        const jstats = tempStats["graph"]
    
        const select = document.getElementById("jour-select")
        const tempo = document.getElementById('temps');
        const perso = document.getElementById('personnes');
    
        let hours = []
        const dataNulle = []
        for (let i = 0; i < 24; i++) hours.push(i+"h")
        for (let i = 0; i < 24; i++) dataNulle.push(0)
        let temporalChart = new Chart(tempo, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: '# of connections',
                    data: dataNulle,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        let personnalChart = new Chart(perso, {
            type: 'bar',
            data: {
                datasets: [{
                    label: '# of connections',
                    data: [],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        Object.keys(jstats).forEach(element => {
            const options = document.createElement("option")
            options.value = element
            options.innerText = element
            select.appendChild(options)
        });
    
        select.onchange = (e) => {
            if (e.target.value == "") {
                document.getElementById("textRes").style.display = "none"
                temporalChart.data.datasets = [{
                    label: '# of connections',
                    data: dataNulle,
                    borderWidth: 1
                }]
                personnalChart.data.datasets = [{
                    label: '# of connections',
                    data: [],
                    borderWidth: 1
                }]
            }
            else {
                document.getElementById("textRes").style.display = "block"
                document.getElementById("nbPersConnection").innerText = Object.keys(jstats[e.target.value]).length-1
                document.getElementById("nbConnection").innerText = jstats[e.target.value]["everyone"].reduce((a, b) => a + b, 0)
                let deb = -1
                let last = 0
                for (let h = 0; h < 24; h++) {
                    if (jstats[e.target.value]["everyone"][h] == 0) continue
                    console.log(h)
                    if (deb == -1) deb = h
                    last = h
                }
                deb--
                last+=2
                if (deb < 0) deb = 0
                if (last > 24) last = 24
                console.log(deb, last)
                temporalChart.data.labels = hours.slice(deb, last)
                temporalChart.data.datasets = [{
                    label: '# of connections',
                    data: jstats[e.target.value]["everyone"].slice(deb, last),
                    borderWidth: 1
                }]
                personnalChart.data.datasets[0].data = []
                Object.keys(jstats[e.target.value]).forEach((element, index) => {
                    if (element == "everyone") return
                    temporalChart.data.datasets.push({
                        label: element,
                        data: jstats[e.target.value][element].slice(deb, last),
                        borderWidth: 1
                    })
    
                    personnalChart.data.datasets[0].data.push({"x": element, "y": jstats[e.target.value][element].reduce((a, b) => a + b, 0)})
                })
            }
    
            temporalChart.update()
            personnalChart.update()
        }
    
        
        select.value = Object.keys(jstats)[Object.keys(jstats).length-1]
        select.dispatchEvent(new Event("change"))
    }
})()