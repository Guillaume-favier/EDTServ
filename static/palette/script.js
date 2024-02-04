let EDT = [[["Info", "info", "20", 8, 10, "Rozsavolgyi"], ["TIPE", "tipe", "20", 10, 12, "?"], ["Anglais", "anglais", "33", 13, 14, "Bocquillon"], ["TD Physique", "physique", "20", 14, 15, "Bouchet"], ["EPS", "EPS", "dehors", 16, 18, "Sport"]], [["Français", "français", "20", 8, 10, "Capitani"], ["Anglais", "anglais", "20", 10, 11, "Bocquillon"], ["Maths", "maths", "20", 11, 13, "Aufranc"], ["Maths", "maths", "20", 14, 16, "Aufranc"], ["Khôlle Physique", "physique", "K34", 16, 17, "Malaterre"]], [["Physique", "physique", "20", 8, 10, "Bouchet"], ["Info", "info", "20", 10, 12, "Rozsavolgyi"], ["Maths", "maths", "20", 13, 16, "Aufranc"]], [["Maths", "maths", "20", 8, 11, "Aufranc"], ["Khôlle Maths", "maths", "20", 11, 12, "Aufranc"], ["SI", "SI", "20", 13, 14, "Cornette"], ["TP Info", "info", "37", 14, 16, "Rozsavolgyi"]], [["TD Maths", "maths", "20", 7.833333333333333, 9.833333333333334, "Aufranc"], ["TP Physique", "physique", "Labo de physique", 9.833333333333334, 11.833333333333334, "Bouchet"], ["Physique", "physique", "20", 13, 15, "Bouchet"], ["Chimie", "chimie", "20", 15, 16, "Bouchet"]]]

;(async() => {
    afficheEDT(EDT, false)
    const pals = await getJson("/palette/palettes.json")
    let paletteElem = document.getElementById("palette")
    Object.keys(pals).forEach(nomPal => {
        console.log("aaaaa")
        const option = document.createElement("option")
        option.innerText = nomPal
        option.value = nomPal
        paletteElem.appendChild(option)
    });

    

    const setpalette = () => {
        console.log("hello")
        const palcook = getCookie("palette")
        if (palcook == "" || !Object.keys(pals).includes(palcook)) {
            paletteElem.value = "Guillaume"
            setCookie("palette", "Guillaume", 100)
        } else {
            paletteElem.value = palcook
        }
        console.log(paletteElem.value)

        const namePal = paletteElem.value
        const pal = pals[namePal]
        if (typeof pal == "undefined" || pal == null) return
        Object.keys(pal).forEach(matiere => {
            const mm = document.getElementsByClassName(matiere)
            for (let i = 0; i < mm.length; i++) {
                const element = mm[i];
                element.style.background = pal[matiere]
            }
        })
    }

    setpalette()

    paletteElem.onchange = e => {
        setCookie("palette", paletteElem.value, 100)
        setpalette()
        console.log(paletteElem.value)
    }
    
})()