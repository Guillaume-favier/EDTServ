let EDT = [[["SI", "SI", "20", 8, 9, "Cornette"], ["Khôlle Physique", "physique", "26", 9, 10, "Bouchet"], ["TD SI", "SI", "20", 10, 11, "Cornette"], ["Anglais", "anglais", "33", 13, 14, "Bocquillon"], ["TD Physique", "physique", "20", 14, 16, "Bouchet"], ["EPS", "EPS", "dehors", 16, 18, "Sport"]], [["Info", "info", "20", 8, 10, "Rozsavolgyi"], ["Anglais", "anglais", "20", 10, 11, "Bocquillon"], ["Maths", "maths", "20", 12, 15, "Aufranc"], ["TP Info", "info", "37", 17, 19, "Rozsavolgyi"]], [["Physique", "physique", "20", 8, 10, "Bouchet"], ["Maths", "maths", "20", 10, 12, "Aufranc"], ["Maths", "maths", "20", 13, 14, "Aufranc"], ["Info", "info", "20", 14, 16, "Rozsavolgyi"]], [["Français", "français", "20", 8, 10, "Capitani"], ["Maths", "maths", "20", 10, 12, "Aufranc"], ["Maths", "maths", "20", 13, 15, "Aufranc"]], [["TD Maths", "maths", "20", 7.833333333333333, 9.833333333333334, "Aufranc"], ["TP Physique", "physique", "B214", 9.833333333333334, 11.833333333333334, "Bouchet"], ["Physique", "physique", "20", 13, 15, "Bouchet"], ["Khôlle Maths", "maths", "K22", 15, 16, "Royer"]]]

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