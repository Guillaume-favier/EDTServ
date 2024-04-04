(async() => {
    const infos = await fetch("https://api.github.com/repos/Guillaume-favier/EDTServ/activity")
    const res = (await infos.json())[0]
    // console.log(res)
    let text = "Dernière mise à jour : " + res.timestamp + "\nPar : " + res.actor.login + "\nType : " + res.activity_type + "\nPrécédent hash : " + res.before +"\nDernier hash : "+res.after
    
    console.log(text)
    if(!isPages){
        const here = await fetch("/api/v1/gitVers/")
        const hereJ = await here.text()
        console.log(hereJ)
        text += "\n\n Comme on est sur un vrai server : \nLast operation : " + hereJ
    }
    document.getElementById("res").innerText = text
    const stats = await fetch("/api/v1/stats/")
    const jstats = (await stats.json())

    const select = document.getElementById("jour-select")
    const ctx = document.getElementById('myChart');

    let hours = []
    const dataNulle = []
    for (let i = 0; i < 24; i++) hours.push(i+"h")
    for (let i = 0; i < 24; i++) dataNulle.push(0)
    let testchart = new Chart(ctx, {
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

    Object.keys(jstats).forEach(element => {
        const options = document.createElement("option")
        options.value = element
        options.innerText = element
        select.appendChild(options)
    });

    select.onchange = (e) => {
        if (e.target.value == "") testchart.data.datasets = [{
            label: '# of connections',
            data: dataNulle,
            borderWidth: 1
        }]
        else {
            testchart.data.datasets = [{
                label: '# of connections',
                data: jstats[e.target.value]["everyone"],
                borderWidth: 1
            }]
            Object.keys(jstats[e.target.value]).forEach((element, index) => {
                if (element == "everyone") return
                testchart.data.datasets.push({
                    label: element,
                    data: jstats[e.target.value][element],
                    borderWidth: 1
                })
            })
        }

        testchart.update()
    }
    
    select.value = Object.keys(jstats)[Object.keys(jstats).length-1]
    select.dispatchEvent(new Event("change"))
})()