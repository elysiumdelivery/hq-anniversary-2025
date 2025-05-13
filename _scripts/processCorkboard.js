import Papa from 'papaparse';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CORKBOARD_CSV = "../data/corkboard.csv";

let singleDecos = ["eds.png", "home/polaroid1.png", "home/polaroid2.png"];
let reusableDecos = ["star1.png", "star2.png"];

const randomData = [];

let data = fs.readFileSync(path.join(__dirname, CORKBOARD_CSV), 'utf8');
Papa.parse(data, {
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
        processData(result.data);
        fs.writeFileSync(path.join(__dirname, "../data/corkboard.js"), `const CORKBOARD_DATA = ${JSON.stringify(randomData, null, 2)}`, 'utf8');
        console.log("done")
    },
});
function processData (data) {
    let processed = data.map(d => {
        let p = {
            category: d["Category"].toLowerCase(),
            type: d["Type"].toLowerCase().split(" + "),
            polaroid: d["Polaroid"],
            credit: d["Credit"].split(") "),
            desc: d["Entry Description"],
            cutouts: d["Cutouts"].split(", "),
        }
        if (p.credit.length > 1) {
            p.credit = p.credit.map((v) => {
                if (v.charAt(v.length - 1) !== ")") {
                    return v += ")";
                }
                return v;
            });
        }
        if (d["Art Entry Filename"]) {
            p.path = `corkboard-img/entries/${d["Art Entry Filename"]}`;
        }
        if (p.category == "memory") {
            p.talents = d["Talent"];
            p.stream = {
                date: Date.parse(d["Stream date"]),
                name: d["Stream Name"],
                link: d["Stream Link"]
            }
            if (p.type.includes("writing")) {
                p.stream.entry = d["Writing Entry (HTML)"];
                p.stream.type = d["Writing Type"];
            }
        }

        return p;
    })

    let plusOrMinus = 1;
    let pmCount = 0;
    for (var i = 0; i < processed.length; i++) {
        let processedData = processed[i];
        if (Math.floor(Math.random() * 12) === 0) {
            genInlineDeco(singleDecos, { rotate: true });
        }
        else if (Math.floor(Math.random() * 6) === 0) {
            genInlineDeco(reusableDecos, { margin: true });
        }
        var newPlusOrMinus = Math.random() < 0.5 ? -1 : 1;
        if (plusOrMinus === newPlusOrMinus && pmCount < 2) {
            pmCount++;
        }
        else if (plusOrMinus === newPlusOrMinus) {
            newPlusOrMinus = newPlusOrMinus * -1;
            pmCount = 0;
        }
        plusOrMinus = newPlusOrMinus;
        if (processedData.path === undefined) {
            processedData.path = "corkboard/writing_thumb.png";
        }
        processedData.itemType = "corkboard-item"
        processedData.rotate = Math.round((2 + Math.random() * 5 * plusOrMinus));
        processedData.zIndex = 100 + processed.length - i;
        randomData.push(processedData);
    }

    randomData.forEach((processedData, i) => {
        if (processedData.path) {
            let imgPath = path.join(__dirname, `../images/${processedData.path}`);
            try {
                let stdout = execSync(`identify -ping -format '%w %h' ${imgPath}`, { encoding: "utf-8"});
                console.log(stdout)
                let dimensions = stdout.split(" ");
                randomData[i].imageRatio = dimensions[0] / dimensions[1]
            }
            catch (e) {
                console.warn(`${imgPath} not found`)
            }
        }
        if (processedData.polaroid) {
            let polaroidPath;
            if (processedData.polaroid.toLowerCase().includes(".png") || processedData.polaroid.toLowerCase().includes(".jpg")) {
                polaroidPath = path.join(__dirname, `../images/corkboard-img/entries/${processedData.polaroid}`);
            }
            else if (processedData.polaroid) {
                polaroidPath = path.join(__dirname, `../images/corkboard/polaroids/${processedData.polaroid}.png`);
            }
            try {
                let stdout = execSync(`identify -ping -format '%w %h' ${polaroidPath}`, { encoding: "utf-8"});
                let dimensions = stdout.split(" ");
                randomData[i].polaroidRatio = dimensions[0] / dimensions[1]
            }
            catch (e) {
                console.warn(`${polaroidPath} not found`)
            }
        }
    })
}

function genInlineDeco (decos, options) {
    let randomDecoPath = decos[Math.floor(Math.random() * decos.length)];
    let data = {
        itemType: "inline-deco",
        path: randomDecoPath,
    };
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    if (options.rotate) {
        data.rotate = Math.round((2 + Math.random() * 5 * plusOrMinus));
    }
    if (options.margin) {
        data.margin = Math.round((2 + Math.random() * 5));
    }
    randomData.push(data);
}