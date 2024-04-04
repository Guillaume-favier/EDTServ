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
})()