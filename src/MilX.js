const fs = require('fs')

const MssStrings = {
    duro:   `<MssStringXML>&lt;Symbol ID="SFGPEV---------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSHSWAC-----&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;Attribute ID="XH"&gt;Duro&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    sanw:   `<MssStringXML>&lt;Symbol ID="SFGPEV---------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSHSWAT-----&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    hebu:   `<MssStringXML>&lt;Symbol ID="SFGPEV---------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSHSW-------&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    kdt:    `<MssStringXML>&lt;Symbol ID="SFGPE----------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSAD--------&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    zfhr:   `<MssStringXML>&lt;Symbol ID="SFGPE----------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSAC--------&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    grfhr:  `<MssStringXML>&lt;Symbol ID="SFGPE----------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSAB--------&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`,
    sdt:    `<MssStringXML>&lt;Symbol ID="SFGPE----------"&gt;&lt;Attribute ID="T"&gt;3&lt;/Attribute&gt;&lt;Attribute ID="XO"&gt;{{ COLOR }}&lt;/Attribute&gt;&lt;Attribute ID="V"&gt;{{ NAME }}&lt;/Attribute&gt;&lt;Attribute ID="G"&gt;{{ MESSAGE }}&lt;/Attribute&gt;&lt;Attribute ID="H"&gt;{{ TTL }}min&lt;/Attribute&gt;&lt;Attribute ID="XE"&gt;9SCHSAA--------&lt;/Attribute&gt;&lt;Attribute ID="XF"&gt;{{ OPSTATE }}&lt;/Attribute&gt;&lt;/Symbol&gt;</MssStringXML>`
}

const objectTemplate = `
    <MilXGraphic>
        {{ MSSSTRING }}
        <Name>{{ NAME }}</Name>
        <PointList>
            <Point>
                <X>{{ LONG }}</X>
                <Y>{{ LAT }}</Y>
            </Point>
        </PointList>
    </MilXGraphic>
`

const fileTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <MilXDocument_Layer xmlns="http://gs-soft.com/MilX/V3.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <MssLibraryVersionTag>2024.03.24</MssLibraryVersionTag>
        <MilXLayer>
            <Name>00_BLUEFORCE_dd.mm</Name>
            <LayerType>Normal</LayerType>
            <GraphicList>
                {{ GRAPHICS }}
            </GraphicList>
            <CoordSystemType>WGS84</CoordSystemType>
            <SymbolSize>12.9646</SymbolSize>
        </MilXLayer>
    </MilXDocument_Layer>
`

const opstateDict = {
    "OPERATIONAL":              "GREEN",
    "PARTIALLY OPERATIONAL":    "AMBER",
    "NOT OPERATIONAL":          "RED",
    "NOT HERE / VACATION":      "BLACK"
}

const callSignDict = {
    "BROKER ONE":               "zfhr",
    "BROKER TWO":               "zfhr",
    "CARGO":                    "zfhr",
    "CHARLIE MED ONE ALPHA":    "sanw",
    "CHARLIE MED ONE BRAVO":    "sanw",
    "CHARLIE MED TWO ALPHA":    "sanw",
    "CHARLIE MED TWO BRAVO":    "sanw",
    "CHARLIE MIKE ONE ALPHA":   "duro",
    "CHARLIE MIKE ONE BRAVO":   "duro",
    "CHARLIE MIKE ONE CARGO":   "hebu",
    "CHARLIE MIKE TWO ALPHA":   "duro",
    "CHARLIE MIKE TWO BRAVO":   "duro",
    "CHARLIE MIKE TWO CARGO":   "hebu",
    "CHIEF RUSH":               "grfhr",
    "COBRA":                    "grfhr",
    "EAGLE FIVE":               "zfhr",
    "EAGLE FOUR":               "zfhr",
    "EAGLE ONE":                "zfhr",
    "EAGLE SEVEN":              "zfhr",
    "EAGLE SIX":                "zfhr",
    "EAGLE THREE":              "zfhr",
    "EAGLE TWO":                "zfhr",
    "HAWK":                     "zfhr",
    "INTEL":                    "grfhr",
    "LIGHTNING":                "zfhr",
    "MAJOLA":                   "grfhr",
    "KEVIN":                    "grfhr",
    "MEDICO DUE PICCOLO":       "grfhr",
    "MEDICO DUE":               "zfhr",
    "MEDICO UNO PICCOLO":       "grfhr",
    "MEDICO UNO":               "zfhr",
    "QUEEN PICCOLO":            "zfhr",
    "QUEEN":                    "zfhr",
    "REDOC":                    "kdt",
    "REPE PICCOLO":             "sdt",
    "REPE":                     "grfhr",
    "SIERRA":                   "zfhr",
    "THUNDER":                  "zfhr"
}

const colorDict = {
    red:    "$003333CC",
    orange: "$0000C0FF"
}


class MilX {
    constructor(){

    }

    generateMilXFile(reports){
        let file = fileTemplate
        let objects = []
        for (let r of reports){
            objects.push(this._generateObject(r))
        }
        file = file.replace("{{ GRAPHICS }}", objects.join(" "))
        fs.writeFileSync('Map.milxly',file)
        return file
    }

    _generateObject(report) {
        let obj = objectTemplate
        let objType = callSignDict[report.callsign]
        if (!objType) {
            objType = "sdt"
        }

        // find out if element is overdue
        let color = ""
        let overdueMinutes = (new Date() - new Date(report.timestamp) - report.ttl * 60000) / 60000
        if (overdueMinutes > 0){
            color = colorDict.orange
        }
        if (overdueMinutes > 30){
            color = colorDict.red
        }

        obj = obj.replace("{{ MSSSTRING }}", MssStrings[objType])
        obj = obj.replace("{{ OPSTATE }}", /*opstateDict[report.opstate]*/ "")
        obj = obj.replace("{{ NAME }}", report.callsign)
        obj = obj.replace("{{ NAME }}", report.callsign + (Math.random() + 1).toString(36).substring(7))
        obj = obj.replace("{{ MESSAGE }}", report.message)
        obj = obj.replace("{{ TTL }}", report.ttl)
        obj = obj.replace("{{ LAT }}", report.lat)
        obj = obj.replace("{{ LONG }}", report.long)
        obj = obj.replace("{{ COLOR }}", color)
        return obj
    }
}

module.exports = new MilX()