var markov = new Markov();
nlp.extend(compromiseSentences)
nlp.extend(compromiseAdjectives)
nlp.extend(compromiseNumbers)

let noiseArr = [];
for (let i = 0; i < 10; i++) {
  let simp = new SimplexNoise();
  simp.uid = i;
  noiseArr.push(simp);
}

function noise(uid, nx, ny) {
  let s;
  for (let i = 0; i < noiseArr.length; i++) {
    if (noiseArr[i].uid === i) {
      s = noiseArr[i]
    }
  }
  return s.noise2D(nx, ny) / 2 + 0.5;
}

function noiseAt(uid, nx, ny, at) {
  let s;
  for (let i = 0; i < noiseArr.length; i++) {
    if (noiseArr[i].uid === i) {
      s = noiseArr[i]
    }
  }
  let res = `${s.noise2D(nx, ny) / 2 + 0.5}`.split("");
  if (res && res[at]) {
    return res[at]
  } else {
    return 0;
  }
}

let globalFontSize = 9;

function GID(el) {
  return document.getElementById(el);
}

function compare(v, o, nv) {

  v = `${v}`;
  nv = `${nv}`
  if (v.match(/\d+/) || nv.match(/\d+/)) {
    v = parseInt(v);
    nv = parseInt(nv);
  }
  if (o === "includes") {
    if (`${v}`.includes(`${nv}`)) {
      return true;
    } else {
      return false;
    }
  }
  if (o === "===") {
    if (v === nv) {
      return true;
    } else {
      return false;
    }
  }
  if (o === ">") {
    if (v > nv) {
      return true
    } else {
      return false;
    }
  }
  if (o === ">=") {
    if (v >= nv) {
      return true
    } else {
      return false;
    }
  }
  if (o === "<") {
    if (v < nv) {
      return true;
    } else {
      return false
    }
  }
  if (o === "<=") {
    if (v <= nv) {
      return true;
    } else {
      return false;
    }
  }

  if (o === "!==") {
    if (v !== nv) {
      return true;
    } else {
      return false;
    }
  }
}

function replaceVariable(e, localization) {
  let regex = /\<\<[\w\s\.]+\>\>/;
  let l = localization;
  if (l && l.length > 0) {
    if (l.match(regex) && l.match(regex).length > 0) {
      let count = 0;
      while (l.includes("<<")) {
        count += 1;
        let matches = l.match(regex);
        if (matches) {
          let noDollars = matches[0].replace(/\<\</, "").replace(/\>\>/, "");
          let exists = false;
          for (let n = 0; n <  e.variables.length; n++) {
            if (noDollars && e.variables[n].name === noDollars) {

              l = l.replace(matches[0], e.variables[n].value)
              exists = true;
            }
          }
          if (exists === false) {
            l = l.replace(matches[0], "")
            console.log(`ERROR: The variable ${matches[0]} did not exist for interpolation.`)
          }
        }
        if (count === 1000) {
          console.log(`ERROR: It appears that you have an improperly nested variable in ${localization}`);
          return l;
        }
      }
    }
  }
  return l;
}

function getRandomInt(min, max) {
  //inclusive on both sides
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let g = {};
g.parser = {
  active: false,
  directions: [],
  gridName: ""
}
g.timers = [];
g.textTimersTimeout = [];
g.callbacks = [];
g.output = "";
g.choices = [];
g.links = [];
g.speak = [];
g.speakers = [];
g.arrays = {}
g.monthText = "January";
g.month = 1;
g.day = 1;
g.year = 2021
g.locations = [];
g.gridTypes = ["default"];

function createGrid(n) {
  let grid = {};
  grid.name = n || "default";
  grid.currentX = 0;
  grid.currentY = 0;
  grid.magnification = 5;
  grid.cellArray = [];
  grid.isMap = "no"
  return grid;
}

let cellArray = [];

function GID(el) {
  return document.getElementById(el);
}


function startup() {
  g.grids = [];
  g.grids.push(createGrid("newGrid"))
  g.grids[0].type = "default"
  g.currentGrid = g.grids[0]
  g.magnification = 5

}
startup();

function normBrackets(s) {
  let arr = [];
  s = s.replace("[", "");
  s = s.replace("]", "")
  if (s.includes(",")) {
    s = s.split(/\,\s(?=[\<\>A-Za-z])/);
    for (let i = 0; i < s.length; i++) {
      if (s[i].charAt(0) === " ") {
        s[i] = s[i].substring(1);
      }
    }
    arr = s;
  } else {
    arr.push(s);
  }
  console.log(arr);
  return arr;
}

function setVariableArray(v) {
  let arr = [];
  for (let i = 0; i < v.length; i++) {
    let variable = parseVariableFromText(v[i])
    if (variable !== "empty") {
      arr.push(variable);
    }
  }
  return arr;
}

function parseVariableFromText(t) {
  console.log(t);
  let matches = t.match(/\s?([\w\d\,\!\(\)\$\{\}\.\<\>]+)\s(includes|[\*\/\+\=\-\!\<\>]+)\s([\s\w\d\,\!\(\)\$\{\}\.\<\>]+)/);
  if (matches && matches.length > 0) {
    let o = {};
    o.name = matches[1];
    o.operation = matches[2];
    o.value = matches[3]; //edit here to parseint if messes up
    return o;
  } else {
    return "empty"
  }
}

function getChoiceFromMatch(m, coords) {
  let o = {};
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  o.x = parseInt(coords.match(rx)[1]);
  o.y = parseInt(coords.match(ry)[1]);
  let parens = /\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/g;
  let  parensArr = m.match(parens) || [];
  //o.text = m.replace(parens, "");
  o.text = m;
  o.text = o.text.replace("choice: ", "")
  o.text = o.text.replace("[", "");
  o.text = o.text.replace("]", "")
  o.gridName = g.currentGrid.name;
  for (let z = 0; z < parensArr.length; z++) {
    if (parensArr[z].includes("timer:")) {
      let time = parensArr[z].match(/timer\:\s(\d+)/)
      o.text = o.text.replace(/\(timer\:\s\d+\)/, "")
      o.timer = time[1];
    }
    if (parensArr[z].includes("=") || parensArr[z].includes("<") || parensArr[z].includes(">")) {
      let unp = parensArr[z].replace("(", "");
      unp = unp.replace(")", "");
      o.variables = normBrackets(unp);
      o.variables = setVariableArray(o.variables)
    } else {
      o.directions = normBrackets(parensArr[z])
      for (let n = 0; n < o.directions.length; n++) {
        o.directions[n] = o.directions[n].replace(")", "");
        o.directions[n] = o.directions[n].replace("(", "");
      }
    }
  }
  return o
}

function getLinkFromMatch(m, coords) {
  let o = {};
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  o.x = parseInt(coords.match(rx)[1]);
  o.y = parseInt(coords.match(ry)[1]);
  let parens = /\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/g;
  let  parensArr = m.match(parens) || [];
  //o.text = m.replace(parens, "");
  o.text = m;
  o.text = o.text.replace("link: ", "")
  o.text = o.text.replace("[", "");
  o.text = o.text.replace("]", "")
  o.gridName = g.currentGrid.name;
  for (let z = 0; z < parensArr.length; z++) {
    if (parensArr[z].includes("timer:")) {
      let time = parensArr[z].match(/timer\:\s(\d+)/)
      o.text = o.text.replace(/\(timer\:\s\d+\)/, "")
      o.timer = time[1];
    }
    if (parensArr[z].includes("=") || parensArr[z].includes("<") || parensArr[z].includes(">")) {
      let unp = parensArr[z].replace("(", "");
      unp = unp.replace(")", "");
      o.variables = normBrackets(unp);
      o.variables = setVariableArray(o.variables)
    } else {
      o.directions = normBrackets(parensArr[z])
      for (let n = 0; n < o.directions.length; n++) {
        o.directions[n] = o.directions[n].replace(")", "");
        o.directions[n] = o.directions[n].replace("(", "");
      }
    }
  }
  o.text = o.text.replace(/\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/g, "")
  return o
}

function process(unprocessed, coords) {
  let total = /\[[\{\}\w\s\+\.\-\=\*\<\>\!\?\d\,\:\;\(\)\$\'\"\”\“\”\“\%\/]+\]/g
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  let x = parseInt(coords.match(rx)[1]);
  let y = parseInt(coords.match(ry)[1]);
  let digits = /\[(\d+)\]/
  let components = unprocessed.split("|")
  let cArr = [];
  for (let j = 0; j < components.length; j++) {
    let c = {};
    c.variables = [];
    c.directions = [];
    c.choices = [];
    c.links = [];
    c.text = components[j].trim();
    if (c.text.includes("break()")) {
      c.break = true;
      c.text = c.text.replace("break()", "")
    }
    if (c.text.includes("loop(")) {
      c.loop = {};
      c.loop.x = x;
      c.loop.y = y;
      c.loop.gridName = g.currentGrid.name;
      c.loop.iterations = parseInt(c.text.match(/loop\(([\w\d]+)\)/)[1])
      c.loop.maxIterations = c.loop.iterations;
      c.text = c.text.replace(/loop\(\d+\)/, "")
    } else if (c.text.includes("teleport(")) {
      let m = c.text.match(/teleport\(([\w\d\$\{\}]+)\,\s([\d\-\$\{\}\w]+)\,\s([\d\-\$\{\}\w]+)\)/)
      c.teleport = {};
      c.teleport.gridName = m[1];
      c.teleport.x = m[2];
      c.teleport.y = m[3]
      c.text = c.text.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
      /*currentCell = getCell(walker.x, walker.y);
      possibleComponents = createPossibleComponentsArr(walker, currentCell.components);
      currentComponent = getComponent(possibleComponents);*/
    }


    //c.text = c.text.replace(/\[[\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\(\)\$\'\"\”\“\%\/]+\]/g, "")
    let matches = components[j].match(total);
    if (matches) {
      for (let n = 0; n < matches.length; n++) {
        let dig = matches[n].match(digits);
        if (dig) {
          c.probability = dig[1];
          matches[n] = matches[n].replace(/\[(\d+)\]/, "")
        }
        if (matches[n].includes("[START]")) {
          c.start = true;
        } else if (matches[n].includes("choice:")) {

          c.choices.push(getChoiceFromMatch(matches[n], coords))


        } else if (matches[n].includes("link:")) {
          c.links.push(getLinkFromMatch(matches[n], coords))
        } else if (matches[n].includes("bg:")) {
          c.background = matches[n].replace("bg: ", "").replace("[", "").replace("]", "");
        } else if (matches[n].includes("color:")) {
          c.color = matches[n].replace("color: ", "").replace("[", "").replace("]", "")
        } else if (matches[n].includes("img:")) {
          c.img = matches[n].replace("img: ", "").replace("[", "").replace("]", "")
        } else if (matches[n].includes("=") || matches[n].includes("<") || matches[n].includes(">") || matches[n].includes("includes")) {
          let unprocessedVariables = normBrackets(matches[n])
          c.variables = setVariableArray(unprocessedVariables);
        } else {
          c.directions = normBrackets(matches[n])
        }
      }
    }
    cArr.push(c);
  }
  return cArr
}

function saveCell(g, coords) {
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  let v = GID(`${coords}`).value
  let teleport;
  if (v.match(/(\w+)\s\=\s\[\]/)) {
    let matchArr = v.match(/(\w+)\s\=\s\[\]/g)
    for (let i = 0; i < matchArr.length; i++) {
      let name = matchArr[i].match(/(\w+)\s\=\s\[\]/)[1]
      g.arrays[`${name}`] = [];
    }
  }
  if (v.length > 0 && v.includes("BREAK(")) {
    let m = v.match(/BREAK\(([\s\S]+)\)END/);
    if (m && m[1]) {
      let x = parseInt(coords.match(rx)[1]);
      let y = parseInt(coords.match(ry)[1]);
      let arr = m[1].split(/\s/);
      for (let i = 0; i < arr.length; i++) {
        let cell = {};
        let o = {};
        if (i === 0) {
          cell.unprocessed = `${arr[i]} [E]`
          o.text = `${arr[i]}`
        } else if (i === arr.length - 1) {
          cell.unprocessed = `${arr[i]} `
          o.text = ` ${arr[i]}`
        } else {
          cell.unprocessed = `${arr[i]} [E]`;
          o.text = `${arr[i]} `;
        }
        cell.coords = `x${x}y${y}`;
        cell.x = x;
        cell.y = y;

        let cArr = [];



        o.variables = [];
        if (i === arr.length - 1) {
          o.directions = [];
        }  else {
          o.directions = ["E"];
        }

        o.choices = [];
        x += 1;
        cArr.push(o);
        cell.components = cArr;
        g.currentGrid.cellArray.push(cell);

      }
      drawGrid();
    }
  } else if (v.length > 0 && v.includes("SPLIT(")) {
    let m = v.match(/SPLIT\(([\s\S]+)\)(\w+)/);
    if (m && m[1]) {
      let x = parseInt(coords.match(rx)[1]);
      let y = parseInt(coords.match(ry)[1]);
      let arr = m[1].split(/\,?\s/);
      let cell = {};
      cell.coords = `x${x}y${y}`;
      cell.x = x;
      cell.y = y;
      let cArr = []
      cell.unprocessed = "";
      for (let i = 0; i < arr.length; i++) {
        let o = {};
        if (i === 0) {
          cell.unprocessed += `${arr[i]}[${m[2]}]|`
          o.text = `${arr[i]}`
          o.probability = m[2];
        } else if (i === arr.length - 1) {
          cell.unprocessed += `${arr[i]}[${m[2]}]`
          o.text = ` ${arr[i]}`
          o.probability = m[2];
        } else {
          cell.unprocessed += `${arr[i]}[${m[2]}]|`;
          o.text = `${arr[i]}`;
          o.probability = m[2];
        }
        cArr.push(o);
      }
      cell.components = cArr;
      g.currentGrid.cellArray.push(cell);
    }
    drawGrid();
  } else if (v.length > 0) {
    let o = {};
    let exists = false;

    for (let i = 0; i < g.currentGrid.cellArray.length; i++) {

      if (g.currentGrid.cellArray[i].coords === coords) {
        g.currentGrid.cellArray[i].unprocessed = v;
        let cArr = process(g.currentGrid.cellArray[i].unprocessed, coords);
        g.currentGrid.cellArray[i].components = cArr;
        exists = true;
      }
    }

    //non existant cell => create
    if (exists === false) {
      o.coords = coords
      let x = parseInt(o.coords.match(rx)[1]);
      let y = parseInt(o.coords.match(ry)[1]);
      o.x = x;
      o.y = y;
      o.unprocessed = v;
      let cArr = process(o.unprocessed, o.coords);
      o.components = cArr
      g.currentGrid.cellArray.push(o);
    }
  } else {
    //delete cell if it is later empty
    let rx = /x([\-\d]+)/
    let ry = /y([\-\d]+)/
    let x = parseInt(coords.match(rx)[1]);
    let y = parseInt(coords.match(ry)[1]);
    let deleteIndex = false
    for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
      if (g.currentGrid.cellArray[i].coords === coords) {
        deleteIndex = i
      }
    }
    if (deleteIndex) {
      g.currentGrid.cellArray.splice(deleteIndex, 1);
    }
  }
}


function buildGrid(size) {

  let t = "<table class=big-table>"
  if (size === -1) {
    t += "<tr>"
    t += `<td class="event-map-cell"><textarea class="inner-cell" id="x${g.currentGrid.currentX}y${g.currentGrid.currentY}"></textarea></td>`
    t += "</tr>"
  } else {
    for (let i = g.currentGrid.currentY + size; i > g.currentGrid.currentY - size - 1; i--) {
      t += "<tr>"
      for (let j = g.currentGrid.currentX - size; j < g.currentGrid.currentX + size + 1; j++) {
        let cellCoords = `x${j}y${i}`
        t += `<td class="event-map-cell">
          <td><textarea class="inner-cell" id="${cellCoords}"></textarea></td>
        </td>`
      }
      t += "</tr>"
    }
  }
  t += "</table>"
  return t;
}



function drawGrid(fontSize) {
  GID("grid").innerHTML = buildGrid(g.currentGrid.magnification);
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    try {
      GID(`${g.currentGrid.cellArray[i].coords}`).value = g.currentGrid.cellArray[i].unprocessed;
    } catch {

    }
  }
  let els = document.getElementsByClassName("inner-cell")
  if (fontSize === "l") {
    if (g.currentGrid.magnification < 10) {
      globalFontSize += 3;
    }
  } else if (fontSize === "s") {
    if (globalFontSize !== 3) {
      globalFontSize -= 3;
    }
  }
  for (let i = 0; i < els.length; i++) {
    if (fontSize && fontSize === "l") {
      els[i].style.fontSize = `${globalFontSize}px`;
    } else if (fontSize && fontSize === "s") {
      els[i].style.fontSize = `${globalFontSize}px`;
    } else {
      els[i].style.fontSize = `${globalFontSize}px`;
    }
    els[i].onclick = function() {
      let coords = els[i].id;
      GID("gridinfo").innerHTML = `Grid: ${g.currentGrid.name}, ${coords}`
    }
    els[i].onblur = function() {
      let coords = els[i].id;
      saveCell(g, coords);
    }
    els[i].onmouseover = function() {
      let coords = els[i].id;
      GID("gridinfo").innerHTML = `Grid: ${g.currentGrid.name}, ${coords}`
    }
  }
}

GID("plusicon").onclick = function() {
  if (g.currentGrid.magnification >= 1) {
    g.currentGrid.magnification -= 1;
    if (g.currentGrid.magnification % 2 === 0) {
      g.currentGrid.magnification -= 1;
    }
    drawGrid("l");
  }
}
GID("minusicon").onclick = function() {
  g.currentGrid.magnification += 1;
  if (g.currentGrid.magnification % 2 === 0) {
    g.currentGrid.magnification += 1;
  }
  drawGrid("s");
}

function showHide(el) {
  let d = GID(el).style.display;
  if (d === "none") {
    GID(el).style.display = "block";
  } else {
    GID(el).style.display = "none";
  }
}

/*GID("gogram").onclick = function() {
  GID("landing").style.display = "none";
}
*/

//otherwise, boxes only appear on second click...
GID("cell-box").style.display = "none";
GID("grid-select-box").style.display = "none";

GID("writeicon").onclick = function() {
  GID("generator-area").style.display = "none";
  GID("flexcontainer").style.display = "flex";
  //showHide("cell-box")
  let c = document.getElementById("outputCanvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

GID("cell-box").onclick = function() {
  //showHide("cell-box");
}
g.gridIndex = 0;
GID("gridicon").onclick = function() {
  showHide("grid-select-box");
  GID("grid-select-box").innerHTML = "";
  let t = "";
  t += "<p class=grid-buttons id=add-grid-button>Add Grid</p>";
  t += "<p class=grid-buttons id=rename-grid-button>Rename Grid</p>";
  t += "<p class=grid-buttons id=delete-grid-button>Delete Grid</p>"
  for (let i = 0; i < g.grids.length; i++) {
    if (g.gridIndex === i) {
      t += `<p class="grid-list selected-grid">${g.grids[i].name}</p>`
    } else {
      t += `<p class="grid-list">${g.grids[i].name}</p>`
    }
  }
  GID("grid-select-box").innerHTML += t;
  let els = document.getElementsByClassName("grid-list");
  for (let i = 0; i < els.length; i++) {
    els[i].onclick = function() {
      g.currentGrid = g.grids[i]
      g.gridIndex = i;
      drawGrid();
      GID("grid-select-box").style.display = "none";
    }
  }
  GID("add-grid-button").onclick = function() {
    addGrid();
    resetGridSelect();
  }
  GID("delete-grid-button").onclick = function() {
    g.grids.splice(g.gridIndex, 1)
    resetGridSelect();
  }
  GID("rename-grid-button").onclick = function() {
    let gridName = prompt("Name of Grid?")
    g.grids[g.gridIndex].name = gridName;
    resetGridSelect();
  }
}
let counter = 0

function resetGridSelect() {
  GID("grid-select-box").innerHTML = "";
  let t = "";
  t += "<p class=grid-buttons id=add-grid-button>Add Grid</p>";
  t += "<p class=grid-buttons id=rename-grid-button>Rename Grid</p>";
  t += "<p class=grid-buttons id=delete-grid-button>Delete Grid</p>"
  for (let i = 0; i < g.grids.length; i++) {
    if (g.gridIndex === i) {
      t += `<p class="grid-list selected-grid">${g.grids[i].name}</p>`
    } else {
      t += `<p class="grid-list">${g.grids[i].name}</p>`
    }

  }
  GID("grid-select-box").innerHTML += t;
  let els = document.getElementsByClassName("grid-list");
  for (let i = 0; i < els.length; i++) {
    els[i].onclick = function() {
      g.currentGrid = g.grids[i]
      g.gridIndex = i;
      drawGrid();
      GID("grid-select-box").style.display = "none";
    }
  }
  GID("add-grid-button").onclick = function() {
    addGrid();
    resetGridSelect();
  }
  GID("delete-grid-button").onclick = function() {
    g.grids.splice(g.gridIndex, 1)
    g.gridIndex = 0;
    resetGridSelect();
  }
  GID("rename-grid-button").onclick = function() {
    let gridName = prompt("Name of Grid?")
    g.grids[g.gridIndex].name = gridName;
    resetGridSelect();
  }
}

function addGrid() {
  let gridName = prompt("Name of Grid?")
  counter += 1;
  g.grids.push(createGrid(`${gridName}`))
}

GID("add-grid-button").onclick = function() {
  addGrid();
  resetGridSelect();
}

function keep(t) {
  if (t.includes("keep()")) {
    t = t.replace(/keep\(\)/g, "")
  } else {
    GID("main-text-box").innerHTML = "";
  }
  return t;
}

function addKeyValues(t) {
  for (let i = 0; i < kv.length; i++) {
    if (t.includes(`${kv[i].k}`)) {
      t = t.replace(`${kv[i].k}`, `<div class="tooltip">${kv[i].k}<span class="tooltipintext">${kv[i].v}</span></div>`)
    }
  }
  return t;
}

function deleteUnprocessedChoices(t) {
  t = t.replace(/\[choice\:\s[\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\(\)\;\:]+\]/g, "")
  return t;
}

function addHyperlinks(t) {
  for (let i = 0; i < g.links.length; i++) {
    console.log(g.links[i])
    console.log(t);
    t = t.replace(/\[link\:\s[\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\(\)\;\:]+\]/, `<span class="hyperlink-text" id="hyperlink${i}">${g.links[i].text}</span>`)
    console.log(t);
  }
  return t;
}

function createTimerArrayAndHTML(t) {
  while (t.includes("(timer:")) {
    //// TODO: change separating text to allow commas, etc in timer text...
    let m = t.match(/\(timer\:\s(\d+)\,\s([\w\s\.]+)\,?\s?([\w\s]+)?\)/);
    let o = {
      timer: m[1],
      text: m[2]
    }
    if (m[3]) {
      o.replacement = m[3]
    } else {
      o.replacement = "";
    }
    t = t.replace(/\(timer\:[\w\s\d\,]+\)/, `<span id="textTimer${g.textTimersArr.length}">${m[2]}</span>`)
    g.textTimersArr.push(o);
  }
  return t;
}

function addClickToHyperlinks() {
  let els = document.getElementsByClassName("hyperlink-text");
  if (els && els.length > 0) {
    for (let n = 0; n < els.length; n++) {
      els[n].onclick = function() {
        let id = els[n].id.replace("hyperlink", "");
        if (g.oldLinks[id].directions && g.oldLinks[id].directions.length > 0) {
          let walker = g.lastWalker;
          addChoiceToWalker(walker, g.oldLinks[id])
          let directions = g.oldLinks[id].directions;
          let nextDirection = directions[getRandomInt(0, directions.length - 1)];
          let possibleNextCells = createPossibleCellsArr(walker, g.oldLinks[id], g.oldLinks[id].x, g.oldLinks[id].y)
          let choiceGrid = g.oldLinks[id].gridName
          if (possibleNextCells.length > 0) {
            let nextCell = getRandomFromArr(possibleNextCells);
            walker.x = nextCell.x;
            walker.y = nextCell.y;
          }
          g.lastWalker = walker;
          runGenerationProcess(getGridByName(g, choiceGrid), walker);
        }
      }
    }
  }
}

function setTextTimerTimeouts() {
  for (let i = 0; i < g.textTimersArr.length; i++) {
    let timer = parseInt(g.textTimersArr[i].timer) * 1000;
    let a = setTimeout(function() {
      if (g.textTimersArr[i].replacement.length > 0) {
        GID(`textTimer${i}`).innerHTML = g.textTimersArr[i].replacement
      } else {
        GID(`textTimer${i}`).style.display = "none";
      }
    }, timer)
    g.textTimersTimeout.push(a)
  }
}

function outputText(t) {
  GID("main-text-box").innerHTML += `${replaceVariable(g.lastWalker, t)}`;
}

function replaceAnythingInBrackets(t) {
  t = t.replace(/\[[\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\(\)\$\'\"\”\“\%\/]+\]/g, "")
  return t;
}

function hideOutputIfEmpty(t) {
  if (t.length > 0) {
    GID("main-text-box").style.display = "block";
  } else {
    GID("main-text-box").style.display = "none";
  }
}

function addChoicesAndTimers() {
  GID("new-choices-box").innerHTML = "";
  for (let n = 0; n < g.choices.length; n++) {
    let parens = /\([\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\']+\)/g;
    //WORKING HERE
    let num = n;
    let t = g.choices[n].text.replace(parens, "")
    GID("new-choices-box").innerHTML += `<div class=choiceslist id=choice${num}>${replaceVariable(g.lastWalker, t)}</div>`
    if (g.choices[n].timer) {
      let timer = parseInt(g.choices[n].timer) * 1000;
      let a = setTimeout(function() {
        GID(`choice${num}`).style.display = "none";
      }, timer)
      g.timers.push(a)
    }
  }
}

function clearChoiceTimers() {
  if (g.timers && g.timers.length > 0) {
    for (let z = 0; z < g.timers.length; z++) {
      clearTimeout(g.timers[z]);
    }
    g.timers = []; //reset choice timers
  }
}

function clearTextTimers() {
  if (g.textTimersTimeout && g.textTimersTimeout.length > 0) {
    for (let z = 0; z < g.textTimersTimeout.length; z++) {
      clearTimeout(g.textTimersTimeout[z]);
    }
    g.textTimersTimeout = []; //reset choice timers
  }
}

function navigateToChoiceDestination(els, n) {
  let id = els[n].id.replace("choice", "");
  if (g.oldChoices[id].directions && g.oldChoices[id].directions.length > 0) {
    let walker = g.lastWalker;
    addChoiceToWalker(walker, g.oldChoices[id])
    let directions = g.oldChoices[id].directions;
    let nextDirection = directions[getRandomInt(0, directions.length - 1)];
    let possibleNextCells = createPossibleCellsArr(walker, g.oldChoices[id], g.oldChoices[id].x, g.oldChoices[id].y)
    let choiceGrid = g.oldChoices[id].gridName
    if (possibleNextCells.length > 0) {
      let nextCell = getRandomFromArr(possibleNextCells);
      walker.x = nextCell.x;
      walker.y = nextCell.y;
    }
    g.lastWalker = walker;
    runGenerationProcess(getGridByName(g, choiceGrid), walker);
  }
}

function addChoiceClickEvents() {
  let els = document.getElementsByClassName("choiceslist");
  for (let n = 0; n < els.length; n++) {
    els[n].onclick = function() {
      clearChoiceTimers();
      clearTextTimers();
      navigateToChoiceDestination(els, n);
    }
  }
}

function processRawGeneration(t) {
  t = keep(t);
  t = addKeyValues(t);
  t = deleteUnprocessedChoices(t);
  t = addHyperlinks(t);
  g.textTimersArr = [];
  t = createTimerArrayAndHTML(t);
  addClickToHyperlinks();
  setTextTimerTimeouts();
  hideOutputIfEmpty(t)
  addChoicesAndTimers();
  addChoiceClickEvents()
  t = replaceAnythingInBrackets(t);
  return t;
}

function addParserIfActive() {
  if (g.parser.active) {
    GID("main-text-box").innerHTML += `<input id="parser"></input><div id="submit-parser">Submit</div>`
    GID("submit-parser").onclick = function() {
      parserMove(g.lastWalker);
      let exists = false;
      for (let i = 0; i < g.lastWalker.variables.length; i++) {
        if (g.lastWalker.variables[i].name === "parser") {
          g.lastWalker.variables[i].value = GID("parser").value;
          exists = true;
        }
      }
      if (exists === false) {
        let o = {
          name: "parser",
          value: GID("parser").value
        }
        g.lastWalker.variables.push(o);
      }
      runGenerationProcess(getGridByName(g, g.parser.gridName), g.lastWalker);
    }
    g.parser.active = false;
  }
}

function hideChoiceBoxIfNone() {
  if (g.choices.length > 0) {
    GID("new-choices-box").style.display = "block";
  } else {
    GID("new-choices-box").style.display = "none";
  }
}

function changeInputObjects(objArr) {
  //method to put variables back on v1 and v2 input objects
  for (let i = 0; i < g.lastWalker.variables.length; i++) {
    let varName = g.lastWalker.variables[i].name
    let value = g.lastWalker.variables[i].value;
    let m = varName.match(/o(\d+)\.([\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\(\)\;\:]+)/)
    let newObject = false;
    if (m && m[1]) {
      if (m[2]) {
        let obj = {};
        let num = m[1]
        let name = m[2]
        //let name = m[2].match(/([\w\s\d\,\!\$\.\+\-\>\<\/\"\”\“\'\(\)\;\:]+)\s\=/)[1];
        //let value = m[2].match(/\=\s([\w\s\d\,\!\$\.\+\-\>\<\/\"\”\“\'\(\)\;\:]+)/)[1]
        // check to see whether object in grid exists in object array;
        if (objArr && objArr[num]) {
          //if object in grid exists in array, set obj to that obj
          obj = objArr[num]
          //check to see whether variable exists on object;
          let exists = false;
          let ownProps = Object.getOwnPropertyNames(obj)
          for (let j = 0; j < ownProps.length; j++) {
            if (ownProps === name) {
              obj[`${ownProps[j]}`] = value;
              exists = true;
            }
          }
          //if not, push that variable
          if (exists === false) {
            obj[`${name}`] = value;
          }
          //set element in object array to object (necessary with pass by reference?)
          objArr[num] = obj
        } else {
          //if object in grid does not exist in object array; add object and variable and push object to objectarray
          obj = {};
          obj[`${name}`] = value;
          newObject = true;
          if (objArr) {
            objArr[num] = obj;
          } else {
            objArr = [];
            objArr[num] = obj;
          }
        }
      }
    }
  }
}

function runGenerationProcess(grid, w, objArr) {
  g.output = "";
  //SHOULD the first if grid && w be fleshed out more with some of the else logic?
  let t = "";
  if (grid && w) {
    t = generate(grid, w, true);
  } else {
    t = generate(null, null, null, objArr);
  }
  t = processRawGeneration(t);
  outputText(t);
  hideChoiceBoxIfNone()
  addParserIfActive();
  textToSpeech(g);
  g.oldChoices = g.choices;
  g.oldLinks = g.links;
  g.links = [];
  g.choices = [];
  changeInputObjects(objArr);
  let res = GID("main-text-box").innerHTML;
  return res;
}

function parserMove(walker) {
  let randDir = g.parser.directions[getRandomInt(0, g.parser.directions.length - 1)];
  if (randDir === "E") {
    walker.x += 1;
  } else if (randDir === "W") {
    walker.x -= 1;
  } else if (randDir === "N") {
    walker.y += 1;
  } else if (randDir === "S") {
    walker.y -= 1;
  } else if (randDir === "NE") {
    walker.y += 1;
    walker.x += 1;
  } else if (randDir === "NW") {
    walker.y += 1;
    walker.x -= 1;
  } else if (randDir === "SW") {
    walker.y -= 1;
    walker.x -= 1;
  } else if (randDir === "SE") {
    walker.y -= 1;
    walker.x += 1;
  }
}

function textToSpeech(g) {
  let synth = window.speechSynthesis;
  for (let n = 0; n < g.speak.length; n++) {
    let o = g.speak[n];
    let text = `${g.speak[n].text}`
    let voice;
    for (let i = 0; i < g.speakers.length; i++) {
      if (g.speakers[i].name === o.voice) {
        voice = g.speakers[i]
      }
    }
    let utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice.voice
      utterance.rate = voice.rate;
      utterance.pitch = voice.pitch;
    }
    synth.speak(utterance);
  }
  g.speak = [];
}

let oArr = [
  {
    name: "Boof",
    age: 32
  },
  {
    name: "Bic",
    age: 40
  }
]

GID("generateicon").onclick = function() {
  kv = [];
  runGenerationProcess(null, null, oArr);

  //reset any loop components; only works on second click for some reason.
  if (g.loop) {
    let lg = getGridByName(g, g.loop.gridName);
    let cell = getCell(lg, g.loop.x, g.loop.y)
    let component = cell.components[0];
    component.loop.iterations = component.loop.maxIterations;
  }
}

GID("new-generator").onclick = function() {
  let restart = confirm("Start a new generator? You will lose all unsaved progress.")
  if (restart === true) {
    g.output = "";
    g.choices = [];
    g.links = [];
    g.speak = [];
    g.speakers = [];
    g.arrays = {}
    g.monthText = "January";
    g.month = 1;
    g.day = 1;
    g.year = 2021
    g.locations = [];
    g.gridTypes = ["default"];
    startup();
    fillSidebar();
  }
}

GID("run-grid-drop").onclick = function() {
  kv = [];
  runGenerationProcess(null, null, oArr);
  //reset any loop components; only works on second click for some reason.
  if (g.loop) {
    let lg = getGridByName(g, g.loop.gridName);
    let cell = getCell(lg, g.loop.x, g.loop.y)
    let component = cell.components[0];
    component.loop.iterations = component.loop.maxIterations;
  }
  GID("generator-area").style.display = "none";
  GID("flexcontainer").style.display = "flex";
  //showHide("cell-box")
  let c = document.getElementById("outputCanvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

GID("saveicon").onclick = function() {
  let n = prompt("What name should this generator be saved under?")
  localStorage.setItem(n, JSON.stringify(g))
}

GID("save-generator").onclick = function() {
  let n = prompt("What name should this generator be saved under?")
  localStorage.setItem(n, JSON.stringify(g))
}

GID("load-generator").onclick = function() {
  let n = prompt("What generator would you like to load?")
  g = JSON.parse(localStorage.getItem(n))
  drawGrid();
  fillSidebar();
}

GID("loadicon").onclick = function() {
  let n = prompt("What generator would you like to load?")
  g = JSON.parse(localStorage.getItem(n))
  drawGrid();
  fillSidebar();
}

document.onkeydown = move

function move(e) {
  let c = e.keyCode;
  if (c === 104) {
    //north
    g.currentGrid.currentY += 1;
    drawGrid();
  }
  if (c === 100) {
    //west
    g.currentGrid.currentX -= 1;
    drawGrid();
  }
  if (c === 103) {
    //northwest
    g.currentGrid.currentX -= 1;
    g.currentGrid.currentY += 1;
    drawGrid();
  }
  if (c === 97) {
    //southwest
    g.currentGrid.currentX -= 1;
    g.currentGrid.currentY -= 1;
    drawGrid();
  }
  if (c === 105) {
    //northeast
    g.currentGrid.currentX += 1;
    g.currentGrid.currentY += 1;
    drawGrid();
  }
  if (c === 99) {
    //southeast
    g.currentGrid.currentX -= 1;
    g.currentGrid.currentY -= 1;
    drawGrid();
  }
  if (c === 102) {
    //east
    g.currentGrid.currentX += 1;
    drawGrid();
  }
  if (c === 98) {
    //south
    g.currentGrid.currentY -= 1;
    drawGrid();
  }
  if (c === 27) {
    GID("flexcontainer").style.display = "none";
    GID("export-box").style.display = "none";
    GID("generator-area").style.display = "block";
  }
  let el = GID("parser");
  if (el && el.style.display !== "none") {
    if (c === 13) {
      parserMove(g.lastWalker);
      let exists = false;
      for (let i = 0; i < g.lastWalker.variables.length; i++) {
        if (g.lastWalker.variables[i].name === "parser") {
          g.lastWalker.variables[i].value = GID("parser").value;
          exists = true;
        }
      }
      if (exists === false) {
        let o = {
          name: "parser",
          value: GID("parser").value
        }
        g.lastWalker.variables.push(o);
      }
      runGenerationProcess(getGridByName(g, g.parser.gridName), g.lastWalker);
      g.parser.active = false;
    }
  }
}

GID("flexcontainer").style.display = "none";

function getCell(sg, x, y) {
  for (let i = 0; i < sg.cellArray.length; i++) {
    if (parseInt(sg.cellArray[i].x) === parseInt(x) && parseInt(sg.cellArray[i].y) === parseInt(y)) {
      return sg.cellArray[i];
    }
  }
}
function getCellArr(component, x, y) {
  // TODO: incorporate weighting
  if (component.directions && component.directions.length > 0) {
    let dArr = [];
    for (let i = 0; i < component.directions.length; i++) {
      let targetX = parseInt(x);
      let targetY = parseInt(y);
      let validDirection = true;
      let d = component.directions[i];

      if (d === "E") {
        targetX += 1;
      } else if (d === "W") {
        targetX -= 1;
      } else if (d === "N") {
        targetY += 1;
      } else if (d === "S") {
        targetY -= 1;
      } else if (d === "NW") {
        targetY += 1;
        targetX -= 1;
      } else if (d === "NE") {
        targetY += 1;
        targetX += 1;
      } else if (d === "SE") {
        targetY -= 1;
        targetX += 1;
      } else if (d === "SW") {
        targetY -= 1;
        targetX -= 1;
      } else {
        validDirection = false;
      }
      if (validDirection === true) {
        let dir = get(targetX, targetY);

        if (dir !== undefined) {
          dArr.push(dir)
        }
      }
    }
    return dArr;
  } else {
    return "STOP";
  }
}

function getStarts() {
  let starts = [];
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    for (let j = 0; j < g.currentGrid.cellArray[i].components.length; j++) {
      if (g.currentGrid.cellArray[i].components[j].start) {
        starts.push(g.currentGrid.cellArray[i])
      }
    }
  }
  return starts;
}

function getRandomStart(starts) {
  let rand = getRandomInt(0, starts.length - 1);
  let start = starts[rand];
  return start;
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function doMath(num1, operator, num2, walker) {
  if (num1) {
    num1 = runFunctions(walker, num1);
  }
  if (num2) {
    num2 = runFunctions(walker, num2)
  }

  if (operator === "=") {
    if (Number.isInteger(num2) || isNumeric(num2)) {
      return parseInt(num2);
    } else {
      return num2;
    }
  } else {
    if ((Number.isInteger(num1) || isNumeric(num1)) && (Number.isInteger(num2) || isNumeric(num2))) {
      num1 = parseInt(num1);
      num2 = parseInt(num2);
    }
    if (operator === "+=") {
      return num1 + num2;
    } else if (operator === "-=") {
      return num1 - num2;
    } else if (operator === "*=") {
      return num1 * num2;
    } else if (operator === "=") {
      return num2;
    } else if (operator === "/=") {
      return num1 / num2
    }
  }
  return num2;
}


function getGridByName(g, n) {
  for (let i = 0; i < g.grids.length; i++) {
    if (g.grids[i].name === n) {
      return g.grids[i];
    }
  }
}

function setStart(w) {
  let starts = getStarts()
  let constrainedStarts = [];
  let start;
  if (w) {
    for (let i = 0; i < starts.length; i++) {
      let arr = createPossibleComponentsArr(w, starts[i].components);
      if (arr.length > 0) {
        constrainedStarts.push(starts[i])
      }
    }
    start = getRandomStart(constrainedStarts);
  } else {
    start = getRandomStart(starts);
  }
  return start;
}

function getWalker(start, w, objArr) {
  let walker = {};
  if (w) {
    walker = w;
  } else {
    walker.text = "";
    walker.x = parseInt(start.x);
    walker.y = parseInt(start.y);
    walker.variables = [];
    for (let i = 0; i < objArr.length; i++) {
      let obj = objArr[i];
      if (obj !== undefined) {
        let ownProps = Object.getOwnPropertyNames(obj);
        for (let j = 0; j < ownProps.length; j++) {
          walker.variables.push(
            {
              name: `o${i}.${ownProps[j]}`,
              value: `${obj[`${ownProps[j]}`]}`
            }
          )
        }
      }
    }
  }
  //map input object variables to walker

  return walker;
}


function getComponent(possible) {

  if (possible[0].probability) {
    let totalProb = 0;
    for (let i = 0; i < possible.length; i++) {
      if (possible[i].probability) {
        totalProb += parseInt(possible[i].probability)
      } else {
        totalProb += 1;
      }
    }
    let rand = getRandomInt(0, totalProb)
    let countProb = 0;
    for (let i = 0; i < possible.length; i++) {
      let lowProb = countProb;
      if (possible[i].probability) {
        countProb += parseInt(possible[i].probability)
      } else {
        countProb += 1;
      }
      let highProb = countProb;
      if (rand >= lowProb && rand <= highProb) {
        return possible[i];
      }
    }
  } else {
    return possible[0]
  }
}

function teleport(walker, currentComponent) {
  let gridName = replaceVariable(walker, currentComponent.teleport.gridName);
  let x = replaceVariable(walker, walker.x);
  let y = replaceVariable(walker, walker.y);
  gridName = gridName.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  x = `${x}`.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  y = `${y}`.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  g.currentGrid = getGridByName(g, gridName);
  walker.x = replaceVariable(walker, currentComponent.teleport.x);
  walker.y = replaceVariable(walker, currentComponent.teleport.y);
}


function genLoop(walker) {
  let res = ""
  let generating = true;
  while (generating === true) {
    let currentCell = getCell(g.currentGrid, walker.x, walker.y);
    let possibleComponents = createPossibleComponentsArr(walker, currentCell.components);
    let currentComponent = getComponent(possibleComponents)
    let compGen = "";
    addComponentTo(walker, currentComponent);
    if (currentComponent.text.includes("G(")) {
      compGen += runGrids(walker, currentComponent.text)
      compGen = runFunctions(walker, compGen);
    } else {
      compGen += replaceVariable(walker, currentComponent.text);
      compGen = runFunctions(walker, compGen);
    }
    let possibleNextCells = createPossibleCellsArr(walker, currentComponent, walker.x, walker.y)

    //LOOPING IS NOW FIXED. NEED TO RESET LOOP ITERATIONS ON COMPONENT AFTER GENERATION RUNS
    if (currentComponent.break) {
      g.loop.break = true;
    }

    if (currentComponent.text.includes("parse(")) {
      let m = currentComponent.text.match(/parse\(([\w\,\s\d]+)\)/)[1]
      let parseArr = m.split(", ")
      g.parser = {
        active: true,
        directions: parseArr,
        gridName: g.currentGrid.name,
        x: currentCell.x,
        y: currentCell.y
      }
      compGen = compGen.replace(/parse\([\w\s\,]+\)/, "")
    }

    if (currentComponent.text.includes("LOCK()")) {
      console.log(currentComponent)
      currentComponent.text = compGen;
      currentComponent.text = currentComponent.text.replace("LOCK()", "")
      compGen = compGen.replace("LOCK()", "")
    }
    if (currentComponent.text.includes("callback(")) {
      let cb = currentComponent.text.match(/callback\(([\{\}\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%\/]+)\)/)
      g.callbacks.push(cb[1])
      compGen = compGen.replace(/callback\([\{\}\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%\/]+\)/, "")
    }
    if (currentComponent.text.includes("interrupt()")) {
      if (g.callbacks.length > 0) {
        compGen = compGen.replace("interrupt()", g.callbacks.shift())
      } else {
        console.log(`You called interrupt() in Grid ${g.currentGrid.name} at x: ${walker.x} y: ${walker.y}, but there was no callback to call.`)
        compGen = compGen.replace("interrupt()", "")
      }
    }
    res += compGen;

    if (currentComponent.loop && isNaN(currentComponent.loop.iterations)) {
      g.loop = {};
      g.loop.gridName = currentComponent.loop.gridName;
      g.loop.x = currentComponent.loop.x;
      g.loop.y = currentComponent.loop.y;
      g.loop.iterations = currentComponent.loop.iterations;
      g.loop.break = false;
    } else if (currentComponent.loop) {
      currentComponent.loop.iterations -= 1;
      g.loop = {};
      g.loop.gridName = currentComponent.loop.gridName;
      g.loop.x = currentComponent.loop.x;
      g.loop.y = currentComponent.loop.y;
      g.loop.iterations = currentComponent.loop.iterations;
      g.loop.break = false;
    }

    if (currentComponent.teleport) {
      teleport(walker, currentComponent)
    } else if (possibleNextCells.length === 0 && g.loop && g.loop.break === false && (g.loop.iterations > 0 || isNaN(g.loop.iterations)) && g.choices.length === 0 && g.links.length === 0 && g.parser.active === false) {
      g.currentGrid = getGridByName(g, g.loop.gridName);
      walker.x = g.loop.x;
      walker.y = g.loop.y
    } else if (possibleNextCells.length > 0) {
      let nextCell = getRandomFromArr(possibleNextCells);
      walker.x = nextCell.x;
      walker.y = nextCell.y;
    } else {
      generating = false;
    }
  }
  g.lastWalker = walker;
  return res;
}

function addChoiceToWalker(w, c) {
  if (c.variables) {
    for (let i = 0; i < c.variables.length; i++) {
      let trueValue = replaceVariable(w, c.variables[i].value)
      let exists = false;
      for (let j = 0; j < w.variables.length; j++) {
        if (variablesHaveSameName(w.variables[j], c.variables[i])) {
          exists = true;
          if (isComparisonOperator(c.variables[i].operation) === false) {
            let newValue = doMath(w.variables[j].value, c.variables[i].operation, trueValue, w)
            w.variables[j].value = newValue;
          }
        }
      }
      if (exists === false) {
        //address fact that some variables are strings.
        let o = {};
        o.name = c.variables[i].name;
        o.value = doMath(0, c.variables[i].operation, c.variables[i].value, w)
        w.variables.push(o);
      }
    }
  }
}

function runGrids(w, t) {
  let stillT = true;
  while (stillT === true) {
    t = `${t}`;
    if (t && t.includes("G(")) {
      let m = t.match(/G\(([\w\s\d,\!\$\.]+)\)/);
      let res = ""
      for (let i = 1; i < m.length; i++) {
        let iteratorCount = m[i].match(/\,\s(\d+)/);
        m[i] = m[i].replace(/\,\s(\d+)/, "")
        if (iteratorCount && iteratorCount[1]) {
          for (let n = 1; n < iteratorCount[1]; n++) {
            let lastGrid = g.currentGrid;
            let lastX = w.x;
            let lastY = w.y;
            let nextGrid = getGridByName(g, m[i]);
            res += generate(nextGrid, w);
            g.currentGrid = lastGrid;
            w.x = lastX;
            w.y = lastY;
          }
        } else {
          let lastGrid = g.currentGrid;
          let lastX = w.x;
          let lastY = w.y;
          let nextGrid = getGridByName(g, m[i]);
          res += generate(nextGrid, w);
          g.currentGrid = lastGrid;
          w.x = lastX;
          w.y = lastY;
        }
        t = t.replace(/G\(([\w\s\d,\!\$\.]+)\)/, res)
      }
    } else {
      stillT = false;
    }
  }
  return t;
}

function getRandomColor() {
  let randomColor = Math.floor(Math.random()*16777215).toString(16);
  return randomColor;
}

let kv = [];

function runFunctions(w, t) {
  let stillT = true;
  let c = document.getElementById("outputCanvas");
  let ctx = c.getContext("2d");
  while (stillT === true) {
    t = `${t}`
    replaceVariable(w, t);
    if (t && t.includes(".push(")) {
      let m = t.match(/(\w+)\.push\((\w+)\)/)
      let arrName = m[1];
      let varName = m[2];
      let o = {};
      for (let i = 0; i < w.variables.length; i++) {
        if (w.variables[i].name.includes(`${m[2]}`)) {
          let prop = w.variables[i].name.match(/\.(\w+)/)[1];
          o.name = m[2]
          o[`${prop}`] = w.variables[i].value
        }
      }
      g.arrays[arrName].push(o)
      t = t.replace(/(\w+)\.push\((\w+)\)/)
    } else if (t && t.includes("date()")) {
      t = t.replace("date()", `${g.monthText} ${g.day}, ${g.year}`)
    } else if (t && t.includes("addDay(")) {
      let m = t.match(/addDay\((\d+)\)/)
      addDay(parseInt(m[1]))
      t = t.replace(/addDay\(\d+\)/, "");
    } else if (t && t.match(/ctx\.\w+\s\=\s[A-Za-z\s\d\,\"\'\(\)]+\;/)) {
      //canvas settings (like fillStyle)  - must end in semicolon
      let p = t.match(/ctx\.(\w+)\s\=\s[A-Za-z\s\d\,\"\'\(\)]+\;/)[1];
      let setting = t.match(/ctx\.\w+\s\=\s([A-Za-z\s\d\,\"\'\(\)]+)\;/)[1]
      let c = document.getElementById("outputCanvas");
      let ctx = c.getContext("2d");
      ctx[p] = setting;
      t = t.replace(/ctx\.\w+\s\=\s[A-Za-z\s\d\,\"\'\(\)]+\;/, "")
    } else if (t && t.match(/ctx\.\w+\(/)) {
      //canvas functions
      let f = t.match(/ctx\.(\w+)\(/)[1]
      let args;
      if (t.match(/ctx\.\w+\(([\w\d\,\s\<\/\>\"\'\.\=]+)\)/)) {
        args = t.match(/ctx\.\w+\(([\w\d\,\s\<\/\>\"\'\.\=]+)\)/)[1]
        t = t.replace(/ctx\.\w+\(([\w\d\,\s\<\/\>\"\'\.\=]+)\)/, "")
      } else {
        args = null;
        t = t.replace(/ctx\.\w+\(\)/, "")
      }
      if (args && args.includes(",")) {
        args = args.split(",");
        for (let i = 0; i < args.length; i++) {
          if (isNumeric(args[i])) {
            args[i] = parseInt(args[i].trim());
          } else {
            args[i] = args[i].trim();
          }

        }
      }
      //let c = document.getElementById("outputCanvas");
      //let ctx = c.getContext("2d");
      //special case for image draw
      if (f.includes("drawImage")) {
        let img = new Image;
        img.src = `${args[0]}`;
        args[0] = img
      }
      if (args) {
        ctx[f](...args)
      } else {
        ctx[f]
      }

    } else if (t && t.includes("getRandomInt(")) {
      let m = t.match(/getRandomInt\((\d+)\,\s?(\d+)\)/);
      if (m && m[1] && m[2])  {
        t = t.replace(/getRandomInt\((\d+)\,\s?(\d+)\)/, getRandomInt(parseInt(m[1]), parseInt(m[2])))
      } else {
        stillT = false;
      }
    } else if (t && t.includes("<speaker>")) {
      let m = t.match(/\<speaker\>([\w\s\.\-\!\?\d\,\:\;\'\"\”\“\%\/)\=\/]+)\<\/speaker\>/)
      try {
        let o = {};
        o.name = m[1].match(/name\:\s(\w+)/)[1]
        o.lang = m[1].match(/lang\:\s(\w+)/)[1];
        o.pitch = m[1].match(/pitch:\s(\d\.\d)/)[1];
        o.rate = m[1].match(/rate:\s(\d\.\d)/)[1];
        if (o.pitch > 2.0) {
          o.pitch = `2.0`;
        }
        if (o.rate > 10) {
          o.rate = `10`;
        }
        if (o.rate < 0.1) {
          o.rate = `0.1`
        }
        let synth = window.speechSynthesis;
        let voices = synth.getVoices();
        let voiceMatches = [];
        for (let i = 0; i < voices.length; i++) {
          if (voices[i].lang.includes(`${o.lang}`)) {
            voiceMatches.push(voices[i])
          }
        }
        let rand = getRandomInt(0, voiceMatches.length - 1);
        o.voice = voiceMatches[rand];
        g.speakers.push(o)
      } catch {
        console.log(`ERROR: something went wrong when setting speaker with ${m[0]}`)
      }
      t = t.replace(/\<speaker\>([\w\s\.\-\!\?\d\,\:\;\'\"\”\“\%\/)\<\>\=\/]+)\<\/speaker\>/, "")
    } else if (t && t.includes("getRandomColor()")) {
      t = t.replace("getRandomColor()", getRandomColor());
    } else if (t && t.includes("noise(")) {
      let m = t.match(/noise\(([\w\d]+)\,\s(\d+)\,\s(\d+)\)/)
      t = t.replace(/noise\([\w\d]+\,\s\d+\,\s\d+\)/, `${noise(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]))}`)
    } else if (t && t.includes("noiseAt(")) {
      let m = t.match(/noiseAt\(([\w\d]+)\,\s(\d+)\,\s(\d+)\,\s(\d+)\)/)
      t = t.replace(/noiseAt\(([\w\d]+)\,\s(\d+)\,\s(\d+)\,\s(\d+)\)/, `${noiseAt(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4]))}`)
    } else if (t && t.match(/\{([A-Za-z\w\s\+\.\-\=\<\>\!\?\d\,\n\:\;\$\{\}\'\"\”\“\`\%\/$\n]+)\}\.([\w\#\(\)\s\.]+)/)) {
      //compromise
      let m = t.match(/\{([A-Za-z\w\s\+\.\-\=\<\>\!\?\d\,\n\:\;\$\{\}\'\"\”\“\%\/$\n]+)\}\.([\w\#\(\)\s\.]+)/);
      let res;
      res = runCompromise(m[2], m[1]);
      if (res) {
        t = t.replace(/\{([A-Za-z\w\s\+\.\-\=\<\>\!\?\d\,\n\:\;\$\{\}\'\"\”\“\%\/$\n]+)\}\.([\w\#\(\)\s\.]+)/, res)
      } else {
        t = t.replace(/\{([A-Za-z\w\s\+\.\-\=\<\>\!\?\d\,\n\:\;\$\{\}\'\"\”\“\%\/$\n]+)\}\.([\w\#\(\)\s\.]+)/, "")
      }

    } else if(t && t.includes("markov(")) {
      let m = t.match(/markov\(([\(\)\{\}\w\s\+\.\-\=\<\>\!\?\d\,\n\:\;\$\'\"\”\“\%\/$]+)\,\s(\d+)\,\s(\d+)\)/)
      markov.addStates(m[1]);
      markov.train(parseInt(m[2]));
      let rep = markov.generateRandom(parseInt(m[3]))
      t = t.replace(/markov\(([\{\}\w\s\+\.\-\=\<\>\!\?\d\,\:\;\(\)\$\'\"\”\“\%\/]+)\,\s(\d+)\,\s(\d+)\)/, rep)
    } else if (t && t.includes("grid()")) {
      t = t.replace("grid()", `${g.currentGrid.name}`)
    } else if (t && t.includes("coords()")) {
      t = t.replace("coords()", `x:${w.x}y:${w.y}`);
    } else if (t && t.includes("x()")) {
      t = t.replace("x()", `${w.x}`)
    } else if (t && t.includes("y()")) {
      t = t.replace("y()", `${w.y}`)
    } else if (t && t.includes("indent(")) {
      let m = t.match(/indent\((\d+)\)/)
      if (m && m[1]){
        let d = parseInt(m[1]);
        let indent = "";
        for (let i = 0; i < d; i++) {
          indent += "&nbsp&nbsp";
        }
        t = t.replace(/indent\(\d+\)/, indent)
      }
    } else if (t && t.includes("replaceKey(")) {
      let m = t.match(/replaceKey\(([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\]+),\s([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\]+)\)/)
      m[1] = replaceVariable(w, m[1]);
      m[2] = replaceVariable(w, m[2]);
      let exists = false;
      for (let i = 0; i < kv.length; i++) {
        if (kv[i].k === m[1]) {
          exists = true
          kv[i].v = ` ${m[2]}`
          kv[i].lastChange = 0;
        }
      }
      if (exists === false) {
        let o = {};
        o.k = m[1];
        o.v = m[2];
        //lastChange is an experimental value that one could use to track the forgetting of knowledge over time. No use at moment.
        o.lastChange = 0;
        kv.push(o);
      }
      t = t.replace(/replaceKey\(([\w\d\s\.\,\?\!\;\:\<\>\-\+\=\"\”\“\/\\]+),\s([\w\d\s\.\,\?\;\!\:\<\>\-\+\=\"\”\“\/\\]+)\)/, "")
    } else if (t && t.includes("addKey(")) {
      let m = t.match(/addKey\(([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\]+),\s([\w\d\s\,\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\]+)\)/)
      m[1] = replaceVariable(w, m[1]);
      m[2] = replaceVariable(w, m[2]);
      let exists = false;
      for (let i = 0; i < kv.length; i++) {
        if (kv[i].k === m[1]) {
          exists = true
          kv[i].v += ` ${m[2]}`
          kv[i].lastChange = 0;
        }
      }
      if (exists === false) {
        let o = {};
        o.k = m[1];
        o.v = m[2];
        o.lastChange = 0;
        kv.push(o);
      }
      t = t.replace(/addKey\(([\w\d\s\.\,\?\!\;\:\<\>\-\+\=\"\”\“\/\\]+),\s([\w\d\s\.\,\?\;\!\:\<\>\-\+\=\"\”\“\/\\]+)\)/, "")
    } else if (t && t.includes("C(")) {
      let m = t.match(/C\((\w+)\)/)
      if (m && m[1]) {
        let upper = m
        t = t.replace(/C\((\w+)\)/, m[1].charAt(0).toUpperCase() + m[1].slice(1))
      }
    } else if (t && t.match(/\<speak\((\w+)\)\>/)) {
      let m = t.match(/\<speak\((\w+)\)\>([\$\{\}\w\s\.\-\!\?\d\,\:\;\'\"\”\“\%\(/)\<\>\=\/]+)\<\/speak>/);
      let f = t.match(/\<speak\((\w+)\)\>[\$\{\}\w\s\.\-\!\?\d\,\:\;\'\"\”\“\%\(/)\<\>\=\/]+\<\/speak\>/);
      let o = {};
      o.text = `${m[2]}`
      o.voice = `${m[1]}`
      g.speak.push(o)
      t = t.replace(/\<speak\((\w+)\)\>([\$\{\}\w\s\.\-\!\?\d\,\:\;\'\"\”\“\%\(/)\<\>\=\/\\]+)<\/speak\>/, "")
    } else {
      stillT = false;
    }
  }
  return t;
}

function addComponentTo(w, comp) {
  if (comp.variables) {
    for (let i = 0; i < comp.variables.length; i++) {
      let exists = false;
      for (let j = 0; j < w.variables.length; j++) {
        let wv = w.variables[j];
        wv = replaceVariable(w, wv);
        let cv = _.cloneDeep(comp.variables[i]);
        cv.name = replaceVariable(w, cv.name);
        cv.value = replaceVariable(w, cv.value);
        wv.name = runGrids(w, wv.name);
        cv.name = runGrids(w, cv.name)
        wv.name = runFunctions(w, wv.name);
        cv.name = runFunctions(w, cv.name)
        if (variablesHaveSameName(wv, cv)) {
          exists = true;
          if (isComparisonOperator(cv.operation) === false) {
            wv.value = runGrids(w, wv.value);
            cv.value = runGrids(w, cv.value);
            wv.value = runFunctions(w, wv.value);
            //cv.value = runFunctions(w, cv.value);
            let newValue = doMath(wv.value, cv.operation, cv.value, w)
            w.variables[j].value = replaceVariable(w, newValue);
          }
        }
      }
      if (exists === false) {
        //address fact that some variables are strings.
        let o = {};
        o.name = comp.variables[i].name;
        o.name = replaceVariable(w, o.name)
        o.name = runGrids(w, o.name)
        o.name = runFunctions(w, o.name)
        o.value = doMath(0, comp.variables[i].operation, runFunctions(w, comp.variables[i].value), w)
        o.value = replaceVariable(w, o.value)
        o.value = runGrids(w, o.value)
        o.value = runFunctions(w, o.value)
        w.variables.push(o);
      }
    }
  }
  if (comp.choices && comp.choices.length > 0) {
    for (let i = 0; i < comp.choices.length; i++) {
      if (choiceVariablesConflict(w, comp.choices[i])) {
        //do nothing
      } else {
        //add choice to walker
        let o = _.cloneDeep(comp.choices[i]);
        o.text = runGrids(w, o.text);
        o.text = runFunctions(w, o.text);
        g.choices.push(o);
      }
    }
  }
  if (comp.links && comp.links.length > 0) {
    for (let i = 0; i < comp.links.length; i++) {
      if (choiceVariablesConflict(w, comp.links[i])) {
        //do nothing
      } else {
        let o = _.cloneDeep(comp.links[i]);
        o.text = runGrids(w, o.text);
        o.text = runFunctions(w, o.text);
        g.links.push(o);
      }
    }
  }
  if (comp.background && comp.background.length > 0) {
    GID("cell-box").style.backgroundColor = `${comp.background}`
  }
  if (comp.color && comp.color.length > 0) {
    GID("cell-box").style.color = `${comp.color}`
  }
  if (comp.img && comp.img.length > 0) {
    GID("left-img").src = `${comp.img}`;
  }
}

function getRandomFromArr(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function createPossibleComponentsArr(w, c) {
  let arr = [];
  for (let i = 0; i < c.length; i++) {
    if (variablesConflict(w, c[i]) === false) {
      arr.push(c[i]);
    } else {
    }
  }
  return arr;
}

function isComparisonOperator(operator) {
  if (operator === "===" || operator.includes("<") || operator.includes(">") || operator.includes("includes")) {
    return true;
  } else {
    return false;
  }
}

function walkerIsEmptyButComponentCompares(w, c) {
  if (w.variables.length === 0 && isComparisonOperator(c.operation)) {
    return true;
  } else {
    return false;
  }
}

function variablesHaveSameName(v1, v2) {
  if (v1.name === v2.name) {
    return true;
  } else {
    return false;
  }
}

function variableComparisonsFail(w, compVar) {
  for (let i = 0; i < w.variables.length; i++) {
    if (variablesHaveSameName(w.variables[i], compVar)) {
      if (compare(w.variables[i].value, compVar.operation, compVar.value) === false) {
        return true;
      }
    }
  }
  return false;
}

function choiceVariableComparisonsFail(w, compVar) {
  let exists = false;
  for (let i = 0; i < w.variables.length; i++) {
    if (variablesHaveSameName(w.variables[i], compVar)) {
      exists = true;
      if (compare(w.variables[i].value, compVar.operation, compVar.value) === false) {
        return true;
      }
    }
  }
  if (exists === false) {
    if (compVar.operation === "=") {
      return false;
    } else {
      return true;
    }
  }
  return false;
}

function variablesConflict(w, c) {
  if (c && c.variables) {
    for (let i = 0; i < c.variables.length; i++) {
      let compVar = c.variables[i]
      if (walkerIsEmptyButComponentCompares(w, compVar)) {
        return true;
      }
      if (variableComparisonsFail(w, compVar)) {
        return true;
      }
    }
  }
  return false;
}

function choiceVariablesConflict(w, c) {
  if (c && c.variables) {
    for (let i = 0; i < c.variables.length; i++) {
      let compVar = c.variables[i]
      if (walkerIsEmptyButComponentCompares(w, compVar)) {
        return true;
      }
      if (choiceVariableComparisonsFail(w, compVar)) {
        return true;
      }
    }
  }
  return false;
}

function createPossibleCellsArr(w, component, x, y) {
  let gridHolder = g.currentGrid.name;
  if (component.gridName) {
    //deals with choices not being called until later
    g.currentGrid = getGridByName(g, component.gridName)
  }
  //component is a misnomer here, also can take choices
  let dArr = [];
  if (component.directions && component.directions.length > 0) {

    for (let i = 0; i < component.directions.length; i++) {
      let targetX = parseInt(x);
      let targetY = parseInt(y);
      let validDirection = true;
      let d = component.directions[i];
      d = replaceVariable(w, component.directions[i])

      if (d === "E") {
        targetX += 1;
      } else if (d === "W") {
        targetX -= 1;
      } else if (d === "N") {
        targetY += 1;
      } else if (d === "S") {
        targetY -= 1;
      } else if (d === "NW") {
        targetY += 1;
        targetX -= 1;
      } else if (d === "NE") {
        targetY += 1;
        targetX += 1;
      } else if (d === "SE") {
        targetY -= 1;
        targetX += 1;
      } else if (d === "SW") {
        targetY -= 1;
        targetX -= 1;
      } else {
        validDirection = false;
      }
      if (validDirection === true) {
        let dir = getCell(g.currentGrid, targetX, targetY);

        //check cell from direction to see if at least one component does not conflict
        let conflicts = true;
        if (dir && dir.components.length > 0) {
          for (let j = 0; j < dir.components.length; j++) {
            if (variablesConflict(w, dir.components[j]) === false) {
              conflicts = false;
            }
          }
        }

        if (dir !== undefined && conflicts === false) {
          dArr.push(dir)
        }
      }
    }
    g.currentGrid = getGridByName(g, gridHolder);
    return dArr;
  } else {
    return [];
  }
}


function generate(grid, w, continuing, objArr) {
  let res = "";
  let lastGrid;
  if (grid) {
    lastGrid = g.currentGrid;
    g.currentGrid = grid;
  }
  let start;
  if (w) {
    start = setStart(w)
  } else {
    start = setStart()
  }
  let walker = w || getWalker(start, null, objArr)
  if (continuing) {

  } else {
    walker.x = start.x;
    walker.y = start.y;
  }
  res += genLoop(walker);


  if (lastGrid !== undefined) {
    g.currentGrid = lastGrid
  }
  return res
}

function addDay(num) {
  for (let i = 0; i < num; i++) {
    g.day += 1;
    if (g.day > 28 && g.monthText === "February") {
      g.day -= 28;
      g.month += 1;
      normalizeMonth()
    } else if (g.day > 30 && (g.monthText === "September" || g.monthText === "April" || g.monthText === "June" || g.monthText === "November")) {
      g.day -= 30;
      g.month += 1;
      normalizeMonth()
    } else if (g.day > 31) {
      g.day -= 31
      if (g.month === 12) {
        g.month = 1
        g.year += 1;
      } else {
        g.month += 1;
      }
      normalizeMonth()
    }
  }
}

function normalizeMonth() {
  if (g.month === 1) {
    g.monthText = "January"
  } else if (g.month === 2) {
    g.monthText = "February"
  } else if (g.month === 3) {
    g.monthText = "March"
  } else if (g.month === 4) {
    g.monthText = "April"
  } else if (g.month === 5) {
    g.monthText = "May"
  } else if (g.month === 6) {
    g.monthText = "June"
  } else if (g.month === 7) {
    g.monthText = "July"
  } else if (g.month === 8) {
    g.monthText = "August"
  } else if (g.month === 9) {
    g.monthText = "September"
  } else if (g.month === 10) {
    g.monthText = "October"
  } else if (g.month === 11) {
    g.monthText = "November"
  } else if (g.month === 12) {
    g.monthText = "December"
  }
}


GID("export-grid").onclick = function() {
  GID("export-box").style.display = "block";
  GID("generator-area").style.display = "none";
  let t = JSON.stringify(g.currentGrid);
  GID("export-box").innerHTML = t;
}

GID("new-rule-btn").onclick = function() {
  newRule()
}

function newRule() {
  let n = GID("gridName").value
  let t = GID("gridType").value;

  let gridTypeExists = false;
  for (let i = 0; i < g.gridTypes.length; i++) {
    if (t === g.gridTypes[i]) {
      gridTypeExists = true;
    }
  }
  if (gridTypeExists === false) {
    g.gridTypes.push(t);
    g.gridTypes = g.gridTypes.sort();
  }
  g.grids.push(createGrid(`${n}`))
  g.currentGrid = g.grids[g.grids.length - 1]
  g.currentGrid.type = GID("gridType").value;
  g.currentGrid.isMap = GID("isMap").value;
  g.gridIndex = g.grids.length - 1;
  drawGrid();
  alert(`You created the ${n} grid. The ${n} grid is now your current grid.`)
  fillSidebar();
}

function fillSidebar() {
  GID("left-sidebar").innerHTML = ``;
  let text = "";
  for (let i = 0; i < g.gridTypes.length; i++) {
    text += `<div id="gridType${g.gridTypes[i]}"><a href="#">&#8680 ${g.gridTypes[i]}</a></div>`
  }
  GID("left-sidebar").innerHTML = `${text}`;
  GID("new-rule-btn").onclick = function() {
    newRule();
  }
  for (let i = 0; i < g.gridTypes.length; i++) {
    GID(`gridType${g.gridTypes[i]}`).onclick = function () {
      let t = "";
      let arr = [`<a href="#">&#8681 ${g.gridTypes[i]}</a>`]
      for (let n = 0; n < g.grids.length; n++) {
        if (g.grids[n].type === g.gridTypes[i]) {
          arr.push(`<p class="grid-links" id=grid${g.grids[n].name}-${g.gridTypes[i]}>&#8680 ${g.grids[n].name}</p>`)
        }
      }
      arr = arr.sort();
      for (let n = 0; n < arr.length; n++) {
        t += arr[n]
      }
      GID(`gridType${g.gridTypes[i]}`).innerHTML = t
      for (let n = 0; n < g.grids.length; n++) {
        if (g.grids[n].type === g.gridTypes[i]) {
          GID(`grid${g.grids[n].name}-${g.grids[n].type}`).onclick = function() {
            g.currentGrid = g.grids[n]
            GID("gridName").value = g.currentGrid.name;
            GID("gridType").value = g.currentGrid.type;
            GID("isMap").value = g.currentGrid.isMap;
            hideAll();
            drawGrid();
            showHide("grammar-gen")
          }
        }
      }
      for (let n = 0; n < g.gridTypes.length; n++) {
        if (n !== i) {
          GID(`gridType${g.gridTypes[n]}`).innerHTML = `<a href="#">&#8680 ${g.gridTypes[n]}</a>`
        }
      }
    }
  }
}
fillSidebar();

GID("delete-rule-btn").onclick = function() {
  let deleted = g.currentGrid.name;
  g.grids.splice(g.gridIndex, 1)
  g.gridIndex -= 1;
  g.currentGrid = g.grids[g.gridIndex];
  GID("gridName").value = g.currentGrid.name;
  GID("gridType").value = g.currentGrid.type;
  GID("isMap").value = g.currentGrid.isMap;
  drawGrid();
  alert(`You have deleted the ${deleted} grid and are now on the ${g.currentGrid.name} grid.`)
}
