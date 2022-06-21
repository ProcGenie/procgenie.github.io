function postProcess(t) {

  //FIX THIS - take out compromise?
  //an for a
  let allA = t.match(/\s([Aa])\s\w/g)
  if (allA && allA.length > 0) {
    for (let i = 0; i < allA.length; i++) {
      let m = t.match(/\s([Aa])\s(\w)/)
      if (m) {
        let letter = m[2]
        let article = m[1];
        console.log(letter);
        console.log(article);
        if (letter === "a" || letter === "e" || letter === "o" || letter === "u" || letter === "i" || letter === "A" || letter === "E" || letter === "I" || letter === "O" || letter === "U") {
          t = t.replace(/\s[Aa]\s\w/, ` ${m[1]}n ${m[2]}`)
        }
      }
    }
  }

  //a for an
  let allB = t.match(/\s[Aa]n\s\w/g)
  console.log(allB);
  if (allB && allB.length > 0) {
    for (let i = 0; i < allB.length; i++) {
      let m = t.match(/\s([Aa])n\s(\w)/)
      if (m) {
        console.log(m);
        let article = m[1]
        let letter = m[2]
        console.log(article)
        console.log(letter);
        if (letter === "a" || letter === "e" || letter === "o" || letter === "u" || letter === "i" || letter === "A" || letter === "E" || letter === "I" || letter === "O" || letter === "U") {

        } else {
          t = t.replace(/\s[Aa]n\s\w/, ` ${m[1]} ${m[2]}`)
        }
      }
    }
  }
  return t;
}

//MAJOR NEED TO REFACTOR AND CLEAN UP TECHNICAL DEBT



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
          let ref = noDollars.match(/([\w\d]+)\./)[1]
          let varName = noDollars.match(/\.([\w\d]+)/)[1]
          let exists = false;
          for (let n = 0; n < e.tags[`${ref}`].variables.length; n++) {
            if (varName === e.tags[`${ref}`].variables[n].name) {
              l = l.replace(matches[0], e.tags[`${ref}`].variables[n].value)
              exists = true
            }
          }
          /*
          for (let n = 0; n <  e.variables.length; n++) {
            if (noDollars && e.variables[n].name === noDollars) {

              l = l.replace(matches[0], e.variables[n].value)
              exists = true;
            }
          }
          */
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
g.themes = [
  {
    name: "default",
    color: "black",
    bg: "white",
    links: "#7cc584",
    choiceText: "black",
    choicebg: "white",
    choiceHoverbg: "black",
    choiceHoverText: "white"
  }
];
g.currentTheme = g.themes[0]
g.parser = {
  active: false,
  directions: [],
  gridName: "",
  variables: []
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
g.locations = [];
g.gridTypes = ["default"];
g.savedObjects = [];
g.res = []

function createGrid(n) {
  let grid = {};
  grid.name = n || "default";
  grid.currentX = 0;
  grid.currentY = 0;
  grid.currentZ = 0;
  grid.magnification = 5;
  grid.cellArray = [];
  grid.stacked = false;
  return grid;
}

function parseTags(component) {
  let anyRef = component.text.match(/anyRef\(([\<\>\w\s]+)\)/) //return refs with any matched tag
  let randRef = component.text.match(/randRef\(([\<\>\w\s]+)\)/) // return a random ref with all matched tags
  let allRefs = component.text.match(/allRefs\(([\<\>\w\s]+)\)/) //return refs with all tags
  let notRefs = component.text.match(/notRefs\(([\<\>\w\s]+)\)/) // return refs that do not match tags
  let getRefsByName = component.text.match(/getRefsByName\(([\<\>\w\s]+)\)/)
  let ref = component.text.match(/refs\(([\<\>\w\s]+)\)/)
  let addTags = component.text.match(/\+\(([\<\>\w\s]+)\)/)
  let removeTags = component.text.match(/\-\(([\<\>\w\s]+)\)/)
  let conditionalTags = component.text.match(/\?\(([\<\>\w\s]+)\)/)
  let notTags = component.text.match(/\!\(([\<\>\w\s]+)\)/)



  if (anyRef) {
    if (typeof anyRef === 'string') {
      component.anyRef = [anyRef]
    } else {
      component.anyRef = anyRef[1].split(" ")
    }
  } else {
    component.anyRef = [];
  }

  if (randRef) {
    if (typeof randRef === 'string') {
      component.randRef = [randRef]
    } else {
      component.randRef = randRef[1].split(" ");
    }
  } else {
    component.randRef = [];
  }
  if (notRefs) {
    if (typeof notRefs === 'string') {
      component.notRefs = [notRefs]
    } else {
      component.notRefs = notRefs[1].split(" ")
    }
  } else {
    component.notRefs = [];
  }
  if (allRefs) {
    if (typeof allRefs === 'string') {
      component.allRefs = [allRefs]
    } else {
      component.allRefs = allRefs[1].split(" ")
    }
  } else {
    component.allRefs = [];
  }
  if (ref) {
    if (typeof ref === 'string') {
      component.refs = [ref]
    } else {
      component.refs = ref[1].split(" ")
    }
  } else {
    component.refs = [];
  }
  if (getRefsByName) {
    if (typeof getRefsByName === ' string') {
      component.refs = [getRefsByName]
    } else {
      component.refs = getRefsByName[1].split(" ")
    }

  }
  if (addTags) {
    if (typeof addTags === 'string') {
      component.addTags = [addTags]
    } else {
      component.addTags = addTags[1].split(" ");
    }
  } else {
    component.addTags = [];
  }
  if (removeTags) {
    if (typeof removeTags === 'string') {
      component.removeTags = [removeTags]
    } else {
      component.removeTags = removeTags[1].split(" ");
    }
  } else {
    component.removeTags = [];
  }
  if (conditionalTags) {
    if (typeof conditionalTags === 'string') {
      component.conditionalTags = [conditionalTags]
    } else {
      component.conditionalTags = conditionalTags[1].split(" ");
    }
  } else {
    component.conditionalTags = []
  }
  if (notTags) {
    if (typeof notTags === 'string') {
      component.notTags = [notTags]
    } else {
      component.notTags = notTags[1].split(" ");
    }
  } else {
    component.notTags = []
  }
  component.text = component.text.replace(/refs\(([\<\>\w\s]+)\)/, "")
  component.text = component.text.replace(/\+\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/\-\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/\?\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/\!\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/allRefs\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/notRefs\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/randRef\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/anyRef\([\<\>\w\s]+\)/, "")
  component.text = component.text.replace(/getRefsByName\([\<\>\w\s]+\)/, "")
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
    if (matches[1].includes(".")) {
      o.ref = [matches[1].match(/([\w\d\,\!\(\)\$\{\}\\<\>]+)\./)[1]]
      o.name = matches[1].match(/\.([\w\d\,\!\(\)\$\{\}\\<\>]+)/)[1]
    } else {
      o.name = matches[1];
      o.ref = "refs"
    }
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
  let rz = /z([\-\d]+)/
  o.x = parseInt(coords.match(rx)[1]);
  o.y = parseInt(coords.match(ry)[1]);
  o.z = parseInt(coords.match(rz)[1]);
  let parens = /G?\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/g;
  let  parensArr = m.match(parens) || [];
  //o.text = m.replace(parens, "");
  o.text = m;
  o.text = o.text.replace("choice: ", "")
  o.text = o.text.replace("[", "");
  o.text = o.text.replace("]", "")
  o.variables = [];
  o.gridName = g.currentGrid.name;
  for (let z = 0; z < parensArr.length; z++) {
    if (parensArr[z].includes("timer:")) {
      let time = parensArr[z].match(/timer\:\s(\d+)/)
      o.text = o.text.replace(/\(timer\:\s\d+\)/, "")
      o.timer = time[1];
    }
    if (parensArr[z].includes("=") || parensArr[z].includes("<") || parensArr[z].includes(">")) {
      console.log(parensArr[z])
      let unp = parensArr[z].replace("(", "");
      unp = unp.replace(")", "");
      o.variables = normBrackets(unp);
      o.variables = setVariableArray(o.variables)
      o.text = o.text.replace(/\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/, "")
    } else if (parensArr[z].includes("G(")) {
      console.log("GRID RUN")
      //do nothing if run grid.
    } else {
      o.directions = normBrackets(parensArr[z])
      let joined = o.directions.join(", ");
      for (let n = 0; n < o.directions.length; n++) {
        o.directions[n] = o.directions[n].replace(")", "");
        o.directions[n] = o.directions[n].replace("(", "");
      }
      o.text = o.text.replace(`${joined}`, "")
    }
  }
  return o
}

function getLinkFromMatch(m, coords) {
  console.log(m);
  let o = {};
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  let rz = /z([\-\d]+)/
  o.x = parseInt(coords.match(rx)[1]);
  o.y = parseInt(coords.match(ry)[1]);
  o.z = parseInt(coords.match(rz)[1]);
  let parens = /G?\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/g;
  let  parensArr = m.match(parens) || [];
  //o.text = m.replace(parens, "");
  o.text = m;
  o.text = o.text.replace("link: ", "")
  o.text = o.text.replace("[", "");
  o.text = o.text.replace("]", "")
  o.variables = []
  console.log(o.text);
  o.gridName = g.currentGrid.name;
  for (let z = 0; z < parensArr.length; z++) {
    console.log(parensArr[z]);
    console.log(o.text);
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
      o.text = o.text.replace(/\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/, "")
    } else if (parensArr[z].includes("G(")) {
      console.log("GRID RUN")
      //do nothing if run grid.
    } else {
      o.directions = normBrackets(parensArr[z])
      console.log(o.directions);
      let joined = o.directions.join(", ");
      console.log(joined)
      for (let n = 0; n < o.directions.length; n++) {
        o.directions[n] = o.directions[n].replace(")", "");
        o.directions[n] = o.directions[n].replace("(", "");
      }
      o.text = o.text.replace(`${joined}`, "")
    }
  }
  //o.text = o.text.replace(/\([\w\s\d\,\!\/\'\"\”\“\$\.\*\/\=\+\-\>\<\%\:]+\)/, "")
  console.log(o.text);
  return o
}

function process(unprocessed, coords) {
  let total = /\[[\{\}\w\s\+\.\-\=\*\<\>\!\?\d\,\:\;\(\)\$\'\"\”\“\”\“\%\/]+\]/g
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  let rz = /z([\-\d]+)/
  let x = parseInt(coords.match(rx)[1]);
  let y = parseInt(coords.match(ry)[1]);
  let z = parseInt(coords.match(rz)[1]);
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
    c.tags = []
    c.refs = []
    c.allRefs = []
    c.notRefs = [];
    c.randRef = []
    c.anyRef = [];
    parseTags(c)
    if (c.text.includes("break()")) {
      c.break = true;
      c.text = c.text.replace("break()", "")
    }
    if (c.text.includes("loop(")) {
      c.loop = {};
      c.loop.x = x;
      c.loop.y = y;
      c.loop.z = z;
      c.loop.gridName = g.currentGrid.name;
      c.loop.iterations = parseInt(c.text.match(/loop\(([\w\d]+)\)/)[1])
      c.loop.maxIterations = c.loop.iterations;
      c.text = c.text.replace(/loop\(\d+\)/, "")
      c.text = c.text.replace(/loop\(\w+\)/, "")
    } else if (c.text.includes("teleport(")) {
      let m = c.text.match(/teleport\(([\w\d\$\{\}]+)\,\s([\d\-\$\{\}\w]+)\,\s([\d\-\$\{\}\w]+)\,\s([\d\-\$\{\}\w]+)\)/)
      c.teleport = {};
      c.teleport.gridName = m[1];
      c.teleport.x = m[2];
      c.teleport.y = m[3]
      c.teleport.z = m[4]
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
  let rz = /z([\-\d]+)/
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
      let z = parseInt(coords.match(rz)[1]);
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
        cell.coords = `x${x}y${y}z${z}`;
        cell.x = x;
        cell.y = y;
        cell.z = z;

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
      let z = parseInt(coords.match(rz)[1]);
      let arr = m[1].split(/\,?\s/);
      let cell = {};
      cell.coords = `x${x}y${y}z${z}`;
      cell.x = x;
      cell.y = y;
      cell.z = z;
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
        //g.currentGrid.cellArray[i].unprocessed = g.currentGrid.cellArray[i].unprocessed.replace(/"/g, `\\\"`)
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
      let z = parseInt(o.coords.match(rz)[1]);
      o.x = x;
      o.y = y;
      o.z = z
      o.unprocessed = v;
      //o.unprocessed = o.unprocessed.replace(/"/g, `\\\"`)
      let cArr = process(o.unprocessed, o.coords);
      o.components = cArr
      g.currentGrid.cellArray.push(o);
    }
  } else {
    //delete cell if it is later empty
    let rx = /x([\-\d]+)/
    let ry = /y([\-\d]+)/
    let rz = /z([\-\d]+)/
    let x = parseInt(coords.match(rx)[1]);
    let y = parseInt(coords.match(ry)[1]);
    let z = parseInt(coords.match(rz)[1]);
    let deleteIndex = false
    for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
      if (g.currentGrid.cellArray[i].x === x && g.currentGrid.cellArray[i].y === y && g.currentGrid.cellArray[i].z === z) {
        deleteIndex = i
      }
    }
    if (typeof deleteIndex === 'number') {
      g.currentGrid.cellArray.splice(deleteIndex, 1);
    }
  }
  //g.currentGrid.cellArray[g.currentGrid.cellArray.length - 1].unprocessed = g.currentGrid.cellArray[g.currentGrid.cellArray.length - 1].unprocessed.replace(/"/g, '\\\"')
}


function buildGrid(size) {

  let t = "<table class=big-table>"
  if (size === -1) {
    t += "<tr>"
    t += `<td class="event-map-cell"><textarea class="inner-cell" id="x${g.currentGrid.currentX}y${g.currentGrid.currentY}z${g.currentGrid.currentZ}"></textarea></td>`
    t += "</tr>"
  } else {
    for (let i = g.currentGrid.currentY + size; i > g.currentGrid.currentY - size - 1; i--) {
      t += "<tr>"
      for (let j = g.currentGrid.currentX - size; j < g.currentGrid.currentX + size + 1; j++) {
        let cellCoords = `x${j}y${i}z${g.currentGrid.currentZ}`
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
      let rx = /x([\-\d]+)/
      let ry = /y([\-\d]+)/
      let rz = /z([\-\d]+)/
      let x = parseInt(coords.match(rx)[1]);
      let y = parseInt(coords.match(ry)[1]);
      let z = parseInt(coords.match(rz)[1]);
      g.currentGrid.currentX = x;
      g.currentGrid.currentY = y;
      g.currentGrid.currentZ = z
      drawGrid();
      GID(coords).focus();
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

GID("cell-box").onclick = function() {
  //showHide("cell-box");
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
  //when you run a grid in a link, it adds a bunch of bracketed meta information, which needs to be deleted, as below
  t = t.replace(/\[(?!link\:\s)[\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\(\)\;\:\?]+\]/g, "")
  for (let i = 0; i < g.links.length; i++) {
    console.log(g.links[i])
    console.log(t);
    console.log(t);
    t = t.replace(/\[link\:\s[\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\(\)\;\:\?]+\]/, `<span class="hyperlink-text" id="hyperlink${i}">${g.links[i].text}</span>`)
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
        console.log("clicked!")
        let id = els[n].id.replace("hyperlink", "");
        if (g.oldLinks[id].directions && g.oldLinks[id].directions.length > 0) {
          let walker = g.lastWalker;
          addChoiceToWalker(walker, g.oldLinks[id])
          let directions = g.oldLinks[id].directions;
          let nextDirection = directions[getRandomInt(0, directions.length - 1)];
          let possibleNextCells = createPossibleCellsArr(walker, g.oldLinks[id], g.oldLinks[id].x, g.oldLinks[id].y, g.oldLinks[id].z)
          let choiceGrid = g.oldLinks[id].gridName
          if (possibleNextCells.length > 0) {
            let nextCell = getRandomFromArr(possibleNextCells);
            walker.x = nextCell.x;
            walker.y = nextCell.y;
            walker.z = nextCell.z
          }
          g.lastWalker = walker;
          runGenerationProcess(getGridByName(g, choiceGrid), walker);
        }
      }
    }
  }
}

function addClickToParser() {
  let el = GID("submit-parser");
  let p;
  GID("submit-parser").onclick = function() {
    if (g.oldParser) {
      p = g.oldParser;
    } else {
      p = g.parser;
    }
    if (p.directions && p.directions.length > 0) {
      let walker = g.lastWalker;
      addChoiceToWalker(walker, p)
      let directions = p.directions;
      let nextDirection = directions[getRandomInt(0, directions.length - 1)];
      let possibleNextCells = createPossibleCellsArr(walker, p, p.x, p.y, p.z)
      let choiceGrid = p.gridName
      if (possibleNextCells.length > 0) {
        let nextCell = getRandomFromArr(possibleNextCells);
        walker.x = nextCell.x;
        walker.y = nextCell.y;
        walker.z = nextCell.z;
      }
      g.lastWalker = walker;
      let exists = false;
      if (g.lastWalker.tags["parser"]) {
        exists = true;
        let o = {
          name: "parser",
          value: GID("parser").value
        }
        g.lastWalker.tags[`parser`].variables = [o]
      }
      if (exists === false) {
        let o = {
          name: "parser",
          value: GID("parser").value
        }
        if (g.lastWalker.tags[`parser`]) {
          g.lastWalker.tags[`parser`].variables = [o]
        } else {
          g.lastWalker.tags[`parser`] = [];
          g.lastWalker.tags[`parser`].variables = [o]
        }
        g.lastWalker.variableCount += 1;
      }
      runGenerationProcess(getGridByName(g, choiceGrid), walker);
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

function addCapitalization(t) {
  while (t.includes("C(")) {
    let m = t.match(/C\(([\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\$\'\"\”\“\%\/]+)\)/)
    if (m && m[1]) {
      console.log(m);
      let upper = m
      console.log(m[1].slice(1))
      t = t.replace(/C\([\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\$\'\"\”\“\%\/]+\)/, m[1].charAt(0).toUpperCase() + m[1].slice(1))
    }
  }
  return t;
}

function removeCapitalization(t) {
  while (t.includes("c(")) {
    let m = t.match(/c\(([\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\$\'\"\”\“\%\/]+)\)/)
    if (m && m[1]) {
      console.log(m);
      let upper = m
      console.log(m[1].slice(1))
      t = t.replace(/c\([\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\$\'\"\”\“\%\/]+\)/, m[1].charAt(0).toLowerCase() + m[1].slice(1))
    }
  }
  return t;
}

function outputText(t) {
  t = replaceAnythingInBrackets(t);
  t = addCapitalization(t);
  t = removeCapitalization(t);
  GID("main-text-box").innerHTML += `${replaceVariable(g.lastWalker, t)}`;
}

function replaceAnythingInBrackets(t) {
  console.log(t);
  t = t.replace(/\[[\{\}\w\s\=\<\>\*\+\.\-\!\?\,\:\d\(\)\$\'\"\”\“\%\/]+\]/g, "")
  console.log(t);
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
    let parens = /\([\w\s\d\,\!\$\.\=\+\-\>\<\/\"\”\“\'\[\]]+\)/g;
    //WORKING HERE
    let num = n;
    let t = g.choices[n].text.replace(parens, "")
    t = replaceAnythingInBrackets(t);
    t = postProcess(t);
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
    let possibleNextCells = createPossibleCellsArr(walker, g.oldChoices[id], g.oldChoices[id].x, g.oldChoices[id].y, g.oldChoices[id].z)
    let choiceGrid = g.oldChoices[id].gridName
    if (possibleNextCells.length > 0) {
      let nextCell = getRandomFromArr(possibleNextCells);
      walker.x = nextCell.x;
      walker.y = nextCell.y;
      walker.z = nextCell.z
    }
    g.lastWalker = walker;
    runGenerationProcess(getGridByName(g, choiceGrid), walker);
  }
}

function getVariableByName(w, n) {
  let varArr = w.variables;
  console.log(varArr)
  for (let i = 0; i < varArr.length; i++) {
    if (varArr[i].name === n) {
      return varArr[i]
    }
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
  hideOutputIfEmpty(t);
  t = replaceAnythingInBrackets(t);
  return t;
}

function submitParser(grid) {
  console.log(grid);
  parserMove(g.lastWalker);
  let exists = false;
  if (g.lastWalker.tags["parser"]) {
    exists = true;
    let o = {
      name: "parser",
      value: GID("parser").value
    }
    g.lastWalker.tags[`parser`].variables = [o]
  }
  if (exists === false) {
    let o = {
      name: "parser",
      value: GID("parser").value
    }
    if (g.lastWalker.tags[`parser`]) {
      g.lastWalker.tags[`parser`].variables = [o]
    } else {
      g.lastWalker.tags[`parser`] = [];
      g.lastWalker.tags[`parser`].variables = [o]
    }
    g.lastWalker.variableCount += 1;
  }
  runGenerationProcess(getGridByName(g, grid), g.lastWalker);
}

function addParserIfActive() {
  if (g.parser.active) {
    function myFunc(evt) {
      console.log(evt.currentTarget.param)
      submitParser(evt.currentTarget.param)
    }
    let grid = g.parser.gridName
    GID("main-text-box").innerHTML += `<input id="parser"'></input><div id="submit-parser">Submit</div>`
    g.parser.active = false;
    /*g.parserEl = GID("submit-parser");
    g.parserEl.addEventListener('click', myFunc, false);
    g.parserEl.param = grid;*/
    addClickToParser();
  }
}

function hideChoiceBoxIfNone() {
  if (g.choices.length > 0) {
    GID("new-choices-box").style.display = "block";
  } else {
    GID("new-choices-box").style.display = "none";
  }
}

function applyTheme() {
  let text = GID("right-div");
  console.log(g.currentTheme);
  text.style.background = g.currentTheme.bg;
  text.style.color = g.currentTheme.color;
  let el = GID("new-choices-box");
  el.style.background = g.currentTheme.choicebg;
  el.style.color = g.currentTheme.choiceText
  let choices = document.getElementsByClassName("choiceslist");
  for (let i = 0; i < choices.length; i++) {
    choices[i].style.border = g.currentTheme.border
  }
  let links = document.getElementsByClassName("hyperlink-text");
  for (let i = 0; i < links.length; i++) {
    links[i].style.color = g.currentTheme.links;
  }

  /*
  let els = document.getElementsByClassName("choiceslist");
  for (let i = 0; i < els.length; i++) {
    els[i].style.background = g.currentTheme.choicebg;
    els[i].style.color = g.currentTheme.choiceText
  }
  */
}

function runGenerationProcess(grid, w) {
  g.output = "";
  //SHOULD the first if grid && w be fleshed out more with some of the else logic?
  let t = "";
  if (grid && w) {
    t = generate(grid, w, true);
  } else {
    t = generate(null, null, null);
  }
  t = processRawGeneration(t);
  applyTheme();  //APPLYING THEME TWICE ENSURES THAT THEME IS CORRECT ON FIRST GENERATION
  t = postProcess(t);
  outputText(t);
  g.res.push(t);
  addClickToHyperlinks();
  setTextTimerTimeouts()
  addChoicesAndTimers();
  addChoiceClickEvents()
  hideChoiceBoxIfNone()
  applyTheme()
  addParserIfActive();
  textToSpeech(g);
  g.oldChoices = g.choices;
  g.oldLinks = g.links;
  g.oldParser = g.parser;
  g.links = [];
  g.choices = [];
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
  } else if (randDir === "U") {
    walker.z += 1
  } else if (randDir === "D") {
    walker.z -= 1
  }
}

function resetTheme() {
  g.currentTheme = g.themes[0]
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
    g.locations = [];
    g.gridTypes = ["default"];
    startup();
    fillSidebar();
  }
}

function resetComponents() {

}

GID("run-grid-drop").onclick = function() {
  resetTheme();
  console.log(g.currentTheme);
  g.savedObjects = [];
  g.currentGrid.stacked = false;
  applyTheme();
  kv = [];
  runGenerationProcess(null, null);
  //reset any loop components; only works on second click for some reason.
  if (g.loop) {
    let lg = getGridByName(g, g.loop.gridName);
    let cell = getCell(lg, g.loop.x, g.loop.y, g.loop.z)
    let component = cell.components[0];
    component.loop.iterations = component.loop.maxIterations;
  }
  GID("generator-area").style.display = "none";
  GID("flexcontainer").style.display = "block";
  //showHide("cell-box")
  let c = document.getElementById("outputCanvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}


GID("saveicon").onclick = function() {
  g.currentGrid.currentZ -= 1;
  drawGrid();
  GID("gridinfo").innerHTML = `Grid: ${g.currentGrid.name}, x:${g.currentGrid.currentX}y:${g.currentGrid.currentY}z:${g.currentGrid.currentZ}`
}

GID("loadicon").onclick = function() {
  g.currentGrid.currentZ += 1
  drawGrid();
  GID("gridinfo").innerHTML = `Grid: ${g.currentGrid.name}, x:${g.currentGrid.currentX}y:${g.currentGrid.currentY}z:${g.currentGrid.currentZ}`
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
  //let el = GID("parser");
  let el = GID("submit-parser");
  if (typeof(el) != 'undefined' && el != null) {
    if (c === 13) {
      if (g.oldParser) {
        p = g.oldParser;
      } else {
        p = g.parser;
      }
      if (p.directions && p.directions.length > 0) {
        let walker = g.lastWalker;
        addChoiceToWalker(walker, p)
        let directions = p.directions;
        let nextDirection = directions[getRandomInt(0, directions.length - 1)];
        let possibleNextCells = createPossibleCellsArr(walker, p, p.x, p.y, p.z)
        let choiceGrid = p.gridName
        if (possibleNextCells.length > 0) {
          let nextCell = getRandomFromArr(possibleNextCells);
          walker.x = nextCell.x;
          walker.y = nextCell.y;
          walker.z = nextCell.z
        }
        g.lastWalker = walker;
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
          g.lastWalker.variableCount += 1;
        }
        runGenerationProcess(getGridByName(g, choiceGrid), walker);
      }
    }
  }
}

GID("flexcontainer").style.display = "none";

function getCell(sg, x, y, z) {
  for (let i = 0; i < sg.cellArray.length; i++) {
    if (parseInt(sg.cellArray[i].x) === parseInt(x) && parseInt(sg.cellArray[i].y) === parseInt(y) && parseInt(sg.cellArray[i].z) === parseInt(z)) {
      return sg.cellArray[i];
    }
  }
}
function getCellArr(component, x, y, z) {
  // TODO: incorporate weighting
  //// TODO: NOT USED DELETE
  if (component.directions && component.directions.length > 0) {
    let dArr = [];
    for (let i = 0; i < component.directions.length; i++) {
      let targetX = parseInt(x);
      let targetY = parseInt(y);
      let targetZ = parseInt(z);
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
      } else if (d === "U") {
        targetZ += 1;
      } else if (d === "D") {
        targetZ -= 1;
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

function getWalker(start, w) {
  let walker = {};
  walker.res = "";
  if (w) {
    walker = w;
  } else {
    walker.text = "";
    walker.x = parseInt(start.x);
    walker.y = parseInt(start.y);
    walker.z = parseInt(start.z);
    walker.variables = [];
    walker.variableCount = 0;
    walker.tags = [];
    walker.refs = ["default"]
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
        g.lastProbability = {
          low: lowProb,
          selected: rand,
          high: highProb
        }
        return possible[i];
      }
    }
  } else {
    g.lastProbability = {
      low: "none",
      selected: "none",
      high: "none"
    }
    return possible[0]
  }
}

function teleport(walker, currentComponent) {
  let gridName = replaceVariable(walker, currentComponent.teleport.gridName);
  let x = replaceVariable(walker, walker.x);
  let y = replaceVariable(walker, walker.y);
  let z = replaceVariable(walker, walker.z)
  gridName = gridName.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  x = `${x}`.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  y = `${y}`.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  z = `${z}`.replace(/teleport\([\w\$\d\s\,\-\{\}]+\)/, "")
  g.currentGrid = getGridByName(g, gridName);
  walker.x = replaceVariable(walker, currentComponent.teleport.x);
  walker.y = replaceVariable(walker, currentComponent.teleport.y);
  walker.z = replaceVariable(walker, currentComponent.teleport.z);
}

function changeTheme(name) {
  let theme;
  console.log("Changing theme")
  console.log(name);
  for (let i = 0; i < g.themes.length; i++) {
    if (g.themes[i].name === name) {
      g.currentTheme = g.themes[i]
    }
  }
}

function genLoop(walker) {
  let res = ""
  let generating = true;
  //walker.res = "";
  while (generating === true) {
    let currentCell = getCell(g.currentGrid, walker.x, walker.y, walker.z);
    let possibleComponents = createPossibleComponentsArr(walker, currentCell.components);
    let currentComponent = getComponent(possibleComponents)
    let compGen = "";
    let debug = "";
    debug += `DEBUG: The walker steps to X:${currentCell.x} Y: ${currentCell.y} Z: ${currentCell.z} on the ${g.currentGrid.name} grid and selects the component with the text: ${currentComponent.text}.`;
    if (g.lastProbability) {
      debug += `The component was selected based on a probability factor roll of ${g.lastProbability.selected} in a range of ${g.lastProbability.low} and ${g.lastProbability.high}`
    }
    console.log(debug);
    addComponentTo(walker, currentComponent);
    //walker.res += compGen;


    if (currentComponent.text.includes("G(")) {
      walker.collecting = true;
      compGen += runGrids(walker, currentComponent.text);
      walker.collecting = false;
      //walker.res = replaceVariable(walker, walker.res);
      //walker.res = runGrids(walker, walker.res);
      compGen = runFunctions(walker, compGen);
      //walker.res = runFunctions(walker, walker.res)
      console.log(walker.res);
    } else {
      compGen += replaceVariable(walker, currentComponent.text);
      compGen = runFunctions(walker, compGen);
      //walker.res = replaceVariable(walker, walker.res);
      //walker.res = runFunctions(walker, walker.res)

    }
    if (walker.collecting === false) {
        walker.res += compGen
    }


    let possibleNextCells = createPossibleCellsArr(walker, currentComponent, walker.x, walker.y, walker.z)

    if (currentComponent.text.includes("theme(")) {
      let themeName = currentComponent.text.match(/theme\((\w+)\)/)[1];
      changeTheme(themeName);
      compGen = compGen.replace(/theme\(\w+\)/, "")
    }


    //VISITS function allows you to specify that text will change on sequential visits to a component.
    if (currentComponent.text.match(/visits\([\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%]+\)/)) {
      let def = currentComponent.text.match(/default\:\s([\w\s\+\.\-\=\<\>\!\?\d\,\:\$\'\"\”\“\%]+)\;/)
      if (def) {
        def = def[1]
      } else{
        def = "";
      }
      if (currentComponent.visited) {
        currentComponent.visited += 1;
      } else {
        currentComponent.visited = 1
      }
      let all = currentComponent.text.match(/visits\(([\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%]+)\)/)[1]
      all = all.split("; ");
      let set = false;
      for (let i = 0; i < all.length; i++) {
        let o ={};
        if (all[i].match(/\d+\:\s/)) {
          o.times = all[i].match(/(\d+)\:/)[1];
          o.text = all[i].match(/\d+\:\s([\w\s\+\.\-\=\<\>\!\?\d\,\:\$\'\"\”\“\%]+)/)[1]
        }
        if (o.times && parseInt(o.times) === currentComponent.visited) {
          compGen = compGen.replace(/visits\([\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%]+\)/, o.text)
          set = true;
        }
      }
      if (set === false) {
        compGen = compGen.replace(/visits\([\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%]+\)/, def)
      }
    }


    //LOOPING IS NOW FIXED. NEED TO RESET LOOP ITERATIONS ON COMPONENT AFTER GENERATION RUNS
    if (currentComponent.break) {
      g.loop.break = true;
    }

    if (currentComponent.text.includes("parse(")) {
      let m = currentComponent.text.match(/parse\(([\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\”\“\%]+)\)/)[1]
      let parseArr = m.split(", ")
      g.parser = {
        active: true,
        directions: parseArr,
        gridName: g.currentGrid.name,
        x: currentCell.x,
        y: currentCell.y,
        z: currentCell.z,
        variables: []
      }
      compGen = compGen.replace(/parse\([\w\s\,]+\)/, "")
    }

    if (currentComponent.text.includes("lock()")) {
      currentComponent.text = compGen;
      currentComponent.text = currentComponent.text.replace("lock()", "")
      compGen = compGen.replace("lock()", "")
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
        console.log(`You called interrupt() in Grid ${g.currentGrid.name} at x: ${walker.x} y: ${walker.y} z: ${walker.z}, but there was no callback to call.`)
        compGen = compGen.replace("interrupt()", "")
      }
    }

    //This works but when you call a grid the text of the grid jumps out in front.

    if (compGen.includes("save(")) {
      let m = compGen.match(/save\(([\w\d]+)\)/)[1];
      compGen = compGen.replace(/save\([\w\d]+\)/, "")
      walker.res = walker.res.replace(/save\([\w\d]+\)/, "")
      console.log(walker.res);
      compGen = "";
      console.log(m);
      let o = {};
      o.name = m;
      o.text = walker.res;
      o.choices = g.choices;
      g.choices = [];
      o.links = g.links;
      g.links = [];
      g.savedObjects.push(o);
      console.log(g.savedObjects);
      walker.res = "";
      res = "";
    } else if (compGen.includes("load(")) {
      let m = compGen.match(/load\(([\w\d]+)\)/)[1];
      console.log(m);
      let exists = false;
      console.log(g.savedObjects);
      for (let i = 0; i < g.savedObjects.length; i++) {
        if (g.savedObjects[i].name === m) {
          exists = true;
          addComponentTo(walker, g.savedObjects[i])
          console.log(g.savedObjects[i].text)
          compGen = compGen.replace(/load\([\w\d]+\)/, g.savedObjects[i].text)
        }
      }
      if (exists === false) {
        console.log(`You tried to call load() with ${m} as a paremeter, but ${m} has not been defined.`)
        compGen = compGen.replace(/load\([\w\d]+\)/, "")
      }
    }

    if (compGen.includes("listRefs()")) {
      if (walker.refs.length === 0) {

      } else if (walker.refs.length === 1) {
        compGen = compGen.replace("listRefs()", walker.refs[0])
      } else if (walker.refs.length === 2) {
        compGen = compGen.replace("listRefs()", `${walker.refs[0]} and ${walker.refs[1]}`)
      } else if (walker.refs.length > 2) {
        let nt = ""
        let count = walker.refs.length;
        for (let i = 0; i < count; i++) {
          if (i === count - 1) {
            nt += ` and ${walker.refs[i]}`
          } else {
            nt += `${walker.refs[i]}, `
          }
        }
        compGen = compGen.replace("listRefs()", `${nt}`)
      }
    }

    res += replaceVariable(walker, compGen);
    console.log(res);


    if (currentComponent.loop && isNaN(currentComponent.loop.iterations)) {
      g.loop = {};
      g.loop.gridName = currentComponent.loop.gridName;
      g.loop.x = currentComponent.loop.x;
      g.loop.y = currentComponent.loop.y;
      g.loop.z = currentComponent.loop.z
      g.loop.iterations = currentComponent.loop.iterations;
      g.loop.break = false;
    } else if (currentComponent.loop) {
      currentComponent.loop.iterations -= 1;
      g.loop = {};
      g.loop.gridName = currentComponent.loop.gridName;
      g.loop.x = currentComponent.loop.x;
      g.loop.y = currentComponent.loop.y;
      g.loop.z = currentComponent.loop.z
      g.loop.iterations = currentComponent.loop.iterations;
      g.loop.break = false;
    }

    if (g.currentGrid.stacked === undefined) {
      g.currentGrid.stacked = false;
    }

    if (currentComponent.teleport) {
      teleport(walker, currentComponent)
    } else if (possibleNextCells.length === 0 && g.loop && g.loop.break === false && (g.loop.iterations > 0 || isNaN(g.loop.iterations)) && g.choices.length === 0 && g.links.length === 0 && g.parser.active === false && (g.currentGrid.stacked === false || g.currentGrid === getGridByName(g, g.loop.gridName))) {
      g.currentGrid = getGridByName(g, g.loop.gridName);
      walker.x = g.loop.x;
      walker.y = g.loop.y
      walker.z = g.loop.z
    } else if (possibleNextCells.length > 0) {
      let nextCell = getRandomFromArr(possibleNextCells);
      walker.x = nextCell.x;
      walker.y = nextCell.y;
      walker.z = nextCell.z
    } else {
      generating = false;
    }
  }
  g.lastWalker = walker;
  return res;
}

/*


for (let n = 0; n < w.refs.length; n++) {
  let p = w.refs[n];
  let o = w.tags[`${p}`]
  if (o && o.variables) {
    for (let i = 0; i < o.variables.length; i++) {
      if (variablesHaveSameName(o.variables[i], compVar)) {
        exists = true;
        if (compare(o.variables[i].value, compVar.operation, compVar.value) === false) {
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
  return false;
}

*/

function addChoiceToWalker(w, c) {
  for (let p in w.tags) {
     for (let i = 0; i < c.variables.length; i++) {
       let cv = _.cloneDeep(c.variables[i]);
       console.log(cv.ref);
       console.log(p);
       console.log(w.refs);
       if (cv.ref.indexOf(p) > -1 || (cv.ref === "refs" && w.refs.indexOf(p) > -1)) {
         console.log("matched")
         let exists = false
         for (let n = 0; n < w.tags[`${p}`].variables.length; n++) {
           let wv = w.tags[`${p}`].variables[n];
           wv = replaceVariable(w, wv);
           cv.name = replaceVariable(w, cv.name);
           cv.value = replaceVariable(w, cv.value);
           wv.name = runGrids(w, wv.name);
           cv.name = runGrids(w, cv.name)
           wv.name = runFunctions(w, wv.name);
           cv.name = runFunctions(w, cv.name)
           if (variablesHaveSameName(wv, cv)) {
             exists = true;
             if (isComparisonOperator(cv.operation) === false) {
               wv.value = replaceVariable(w, wv.value);
               wv.value = runGrids(w, wv.value);
               cv.value = runGrids(w, cv.value);
               wv.value = runFunctions(w, wv.value);
               console.log(wv.value);
               console.log(cv.value);
               //cv.value = runFunctions(w, cv.value);
               let newValue = doMath(wv.value, cv.operation, cv.value, w)
                w.tags[`${p}`].variables[n].value = replaceVariable(w, newValue);
             }
           }
         }
         if (exists === false) {
           let o = {};
           o.name = cv.name;
           o.name = replaceVariable(w, o.name)
           o.name = runGrids(w, o.name)
           o.name = runFunctions(w, o.name)
           o.value = doMath(0, cv.operation, runFunctions(w, cv.value), w)
           o.value = replaceVariable(w, o.value)
           o.value = runGrids(w, o.value)
           o.value = runFunctions(w, o.value)
           if (cv.ref.indexOf(p) > -1 || (cv.ref === "refs" && w.refs.indexOf(p) > -1)) {
             console.log("MATCH2")
             if (w.tags[`${p}`].variables) {
               w.tags[`${p}`].variables.push(o)
               w.variableCount += 1
             } else {
               w.tags[`${p}`].variables = []
               w.tags[`${p}`].variables.push(o)
               w.variableCount += 1;
             }
           }
         }
       }
     }
  }
  /*
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
  }*/
}

function runGrids(w, t) {
  console.log(t);
  let stillT = true;
  while (stillT === true) {
    t = `${t}`;
    if (t && t.includes("G(")) {
      let m = t.match(/G\(([\w\s\d,\!\$\.\<\>]+)\)/);
      let res = ""
      for (let i = 1; i < m.length; i++) {
        let iteratorCount = m[i].match(/\,\s(\d+)/);
        m[i] = m[i].replace(/\,\s(\d+)/, "")
        if (iteratorCount && iteratorCount[1]) {
          for (let n = 1; n < iteratorCount[1]; n++) {
            let lastGrid = g.currentGrid;
            let lastX = w.x;
            let lastY = w.y;
            let lastZ = w.z
            m[i] = replaceVariable(w, m[i]);
            let nextGrid = getGridByName(g, m[i]);
            nextGrid.stacked = true
            res += generate(nextGrid, w);
            nextGrid.stacked = false
            g.currentGrid = lastGrid;
            w.x = lastX;
            w.y = lastY;
            w.z = lastZ
          }
        } else {
          let lastGrid = g.currentGrid;
          let lastX = w.x;
          let lastY = w.y;
          let lastZ = w.z
          m[i] = replaceVariable(w, m[i]);
          let nextGrid = getGridByName(g, m[i]);
          nextGrid.stacked = true;
          res += generate(nextGrid, w);
          nextGrid.stacked = false;
          g.currentGrid = lastGrid;
          w.x = lastX;
          w.y = lastY;
          w.z = lastZ
        }
        t = t.replace(/G\(([\w\s\d,\!\$\.\<\>]+)\)/, res)
      }
    } else {
      stillT = false;
    }
  }
  console.log(t);
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
    t = replaceVariable(w, t);
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
      console.log(m[1])
      let res;
      res = runCompromise(m[2], replaceVariable(w, m[1]));
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
      t = t.replace("coords()", `x:${w.x}y:${w.y}z:${w.z}`);
    } else if (t && t.includes("x()")) {
      t = t.replace("x()", `${w.x}`)
    } else if (t && t.includes("y()")) {
      t = t.replace("y()", `${w.y}`)
    }else if (t && t.includes("z()")) {
      t = t.replace("z()", `${w.z}`)
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
      let m = t.match(/replaceKey\(([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+),\s([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+)\)/)
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
      t = t.replace(/replaceKey\(([\w\d\s\.\,\?\!\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+),\s([\w\d\s\.\,\?\;\!\:\<\>\-\+\=\"\”\“\/\\\(\)]+)\)/, "")
    } else if (t && t.includes("addKey(")) {
      let m = t.match(/addKey\(([\w\d\s\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+),\s([\w\d\s\,\.\!\?\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+)\)/)
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
      t = t.replace(/addKey\(([\w\d\s\.\,\?\!\;\:\<\>\-\+\=\"\”\“\/\\\(\)]+),\s([\(\)\w\d\s\.\,\?\;\!\:\<\>\-\+\=\"\”\“\/\\]+)\)/, "")
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
  //w.tags is the refs - each ref has array of tags

  if (comp.anyRef.length > 0) {
    let anyRefArr = [];
    w.refs = [];
    for (let p in w.tags) {
      let hasAnyTag = false;
      for (let i = 0; i < comp.anyRef.length; i++) {
        let index = w.tags[`${p}`].indexOf(comp.anyRef[i]);
        if (index > -1) {
          hasAnyTag = true;
        }
      }
      if (hasAnyTag) {
        anyRefArr.push(p)
      }
    }
    w.refs = anyRefArr //DOES THIS WORK
  }

  if (comp.randRef.length > 0) {
    let randRefArr = [];
    w.refs = [];
    for (let p in w.tags) {
      let hasAllTags = true;
      for (let i = 0; i < comp.randRef.length; i++) {
        let index = w.tags[`${p}`].indexOf(comp.randRef[i]);
        if (index === - 1) {
          hasAllTags = false;
        }
      }
      if (hasAllTags === true) {
        randRefArr.push(p);
      }
    }
    let rand = randRefArr[getRandomInt(0, randRefArr.length - 1)]
    w.refs.push(rand);
  }

  //allRefs matches refs with all tags listed
  if (comp.allRefs.length > 0) {
    w.refs = [];
    for (let p in w.tags) {
      let allMatched = true;
      for (let i = 0; i < comp.allRefs.length; i++) {
        let index = w.tags[`${p}`].indexOf(comp.allRefs[i]);
        if (index === -1) {
          allMatched = false;
        }
      }
      if (allMatched === true) {
        w.refs.push(p);
      }
    }
  }
  if (comp.notRefs.length > 0) {
    w.refs = [];
    for (let p in w.tags) {
      let matchedNot = false;
      for (let i = 0; i < comp.notRefs.length; i++) {
        let index = w.tags[`${p}`].indexOf(comp.notRefs[i]);
        if (index > -1) {
          matchedNot = true
        }
      }
      if (matchedNot === false) {
        w.refs.push(p);
      }
    }
  }
  if (comp.refs.length > 0) {
    w.refs = comp.refs
  }
  for (let j = 0; j < w.refs.length; j++) {
    //added below to fix bug where variables not available without prior tags. Need to clean up remainder of function
    if (w.tags[`${w.refs[j]}`]) {

    } else {
      w.tags[`${w.refs[j]}`] = [];
      w.tags[`${w.refs[j]}`].variables = [];
    }
    for (let i = 0; i < comp.addTags.length; i++) {
      let tag = replaceVariable(w, comp.addTags[i])
      if (w.tags[`${w.refs[j]}`]) {
        w.tags[`${w.refs[j]}`].push(tag)
      } else {
        w.tags[`${w.refs[j]}`] = [];
        w.tags[`${w.refs[j]}`].variables = [];
        w.tags[`${w.refs[j]}`].push(tag)
      }
    }
    for (let i = 0; i < comp.removeTags.length; i++) {
      let tag = replaceVariable(w, comp.removeTags[i])
      if (w.tags[`${w.refs[j]}`]) {
        let index = w.tags[`${w.refs[j]}`].indexOf(tag);
        if (index > -1) {
          w.tags[`${w.refs[j]}`].splice(index, 1)
        }
      } else {
        w.tags[`${w.refs[j]}`] = [];
      }
    }
  }


  if (comp.variables) {

    for (let p in w.tags) {
       for (let i = 0; i < comp.variables.length; i++) {
         let cv = _.cloneDeep(comp.variables[i]);
         console.log(cv.ref);
         console.log(p);
         console.log(w.refs);
         if (cv.ref.indexOf(p) > -1 || (cv.ref === "refs" && w.refs.indexOf(p) > -1)) {
           console.log("matched")
           let exists = false
           for (let n = 0; n < w.tags[`${p}`].variables.length; n++) {
             let wv = w.tags[`${p}`].variables[n];
             wv = replaceVariable(w, wv);
             cv.name = replaceVariable(w, cv.name);
             cv.value = replaceVariable(w, cv.value);
             wv.name = runGrids(w, wv.name);
             cv.name = runGrids(w, cv.name)
             wv.name = runFunctions(w, wv.name);
             cv.name = runFunctions(w, cv.name)
             if (variablesHaveSameName(wv, cv)) {
               exists = true;
               if (isComparisonOperator(cv.operation) === false) {
                 wv.value = replaceVariable(w, wv.value);
                 wv.value = runGrids(w, wv.value);
                 cv.value = runGrids(w, cv.value);
                 wv.value = runFunctions(w, wv.value);
                 console.log(wv.value);
                 console.log(cv.value);
                 //cv.value = runFunctions(w, cv.value);
                 let newValue = doMath(wv.value, cv.operation, cv.value, w)
                  w.tags[`${p}`].variables[n].value = replaceVariable(w, newValue);
               }
             }
           }
           if (exists === false) {
             let o = {};
             o.name = comp.variables[i].name;
             o.name = replaceVariable(w, o.name)
             o.name = runGrids(w, o.name)
             o.name = runFunctions(w, o.name)
             o.value = doMath(0, comp.variables[i].operation, runFunctions(w, comp.variables[i].value), w)
             o.value = replaceVariable(w, o.value)
             o.value = runGrids(w, o.value)
             o.value = runFunctions(w, o.value)
             if (cv.ref.indexOf(p) > -1 || (cv.ref === "refs" && w.refs.indexOf(p) > -1)) {
               console.log("MATCH2")
               if (w.tags[`${p}`].variables) {
                 w.tags[`${p}`].variables.push(o)
                 w.variableCount += 1
               } else {
                 w.tags[`${p}`].variables = []
                 w.tags[`${p}`].variables.push(o)
                 w.variableCount += 1;
               }
             }
           }
         }
       }
    }
  }

  if (comp.choices && comp.choices.length > 0) {
    for (let i = 0; i < comp.choices.length; i++) {
      if (choiceVariablesConflict(w, comp.choices[i])) {
        //do nothing
      } else if (choiceTagsConflict(w, comp.choices[i])) {

      } else {
        //add choice to walker
        let o = _.cloneDeep(comp.choices[i]);
        o.text = replaceVariable(w, o.text);
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
        o.text = replaceVariable(w, o.text)
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

function choiceTagsConflict(walker, choice) {
  return false;
}

function getRandomFromArr(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function createPossibleComponentsArr(w, c) {
  let arr = [];
  for (let i = 0; i < c.length; i++) {
    if (variablesConflict(w, c[i]) === false && tagsConflict(w, c[i]) === false) {
      arr.push(c[i]);
    } else {
    }
  }
  return arr;
}

function tagsConflict(w, c) {
  let conflicts = false;
  for (let j = 0; j < w.refs.length; j++) {
    for (let i = 0; i < c.conditionalTags.length; i++) {
      let tag = replaceVariable(w, c.conditionalTags[i])
      let index = w.tags[`${w.refs[j]}`].indexOf(tag)
      if (index === -1) {
        conflicts = true;
      }
    }
    for (let i = 0; i < c.notTags.length; i++) {
      let tag = replaceVariable(w, c.notTags[i])
      let index = w.tags[`${w.refs[j]}`].indexOf(tag);
      if (index !== -1) {
        conflicts = true
      }
    }
  }
  return conflicts
}

function isComparisonOperator(operator) {
  if (operator === "===" || operator.includes("<") || operator.includes(">") || operator.includes("includes")) {
    return true;
  } else {
    return false;
  }
}

function walkerIsEmptyButComponentCompares(w, c) {
  if (w.variableCount === 0 && isComparisonOperator(c.operation)) {
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
  let result = false;
  for (let n = 0; n < w.refs.length; n++) {
    let p = w.refs[n]
    console.log(p);
    let o = w.tags[`${p}`];
    console.log(w.tags[`${p}`])
    console.log(o)
    if (o && o.variables) {
      for (let i = 0; i < o.variables.length; i++) {
        if (variablesHaveSameName(o.variables[i], compVar)) {
          if (compare(o.variables[i].value, compVar.operation, compVar.value) === false) {
            result = true;
          }
        }
      }
    }
  }
  return result;
}

function choiceVariableComparisonsFail(w, compVar) {
  let exists = false;
  let result;
  for (let n = 0; n < w.refs.length; n++) {
    let p = w.refs[n];
    let o = w.tags[`${p}`]
    if (o && o.variables) {
      for (let i = 0; i < o.variables.length; i++) {
        if (variablesHaveSameName(o.variables[i], compVar)) {
          exists = true;
          if (compare(o.variables[i].value, compVar.operation, compVar.value) === false) {
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
    return false;
  }
  /*
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
  */
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

function createPossibleCellsArr(w, component, x, y, z) {
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
      let targetZ = parseInt(z);
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
      } else if (d === "U") {
        targetZ += 1;
      } else if (d === "D") {
        targetZ -= 1;
      } else {
        validDirection = false;
      }
      if (validDirection === true) {
        let dir = getCell(g.currentGrid, targetX, targetY, targetZ);

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


function generate(grid, w, continuing) {
  let res = "";
  let lastGrid;
  if (grid) {
    lastGrid = g.currentGrid;
    g.currentGrid = grid;
  }
  let start;
  let walker;
  if (w) {
    walker = w;
    start = setStart(walker)
  } else {
    start = setStart()
    walker = getWalker(start, null)
    walker.collecting = false;
  }
  if (continuing) {

  } else {
    walker.x = start.x;
    walker.y = start.y;
    walker.z = start.z
  }
  res += genLoop(walker);


  if (lastGrid !== undefined) {
    g.currentGrid = lastGrid
  }
  return res
}


GID("export-grid").onclick = function() {
  GID("export-box").style.display = "block";
  GID("generator-area").style.display = "none";
  let t = JSON.stringify(g.currentGrid);
  GID("export-box").innerHTML = `let ${g.currentGrid.name} = ${t}`;
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
  g.gridIndex = g.grids.length - 1;
  drawGrid();
  alert(`You created the ${n} grid. The ${n} grid is now your current grid.`)
  fillSidebar();
}

function fillThemeSidebar() {
  GID("left-sidebar").innerHTML = "";
  let text = "";
  for (let i = 0; i < g.themes.length; i++) {
    if (g.themes[i].name === g.currentTheme.name) {
      text += `<p class="gridlinks" id="themelink${i}" style="color: #2980b9">${g.themes[i].name}</p>`
    } else {
      text += `<p class="gridlinks" id=themelink${i}>${g.themes[i].name}</p>`
    }

  }
  GID("left-sidebar").innerHTML += text;
  GID("theme-bg-pick").value = g.currentTheme.bg;
  GID("theme-color-pick").value = g.currentTheme.color;
  GID("theme-name").value = g.currentTheme.name
  GID("theme-link-pick").value = g.currentTheme.links;
  GID("theme-choice-bg").value = g.currentTheme.choicebg;
  GID("theme-choice-text").value = g.currentTheme.choiceText
  GID("theme-choice-hover-bg").value = g.currentTheme.choiceHoverbg;
  GID("theme-choice-hover-text").value = g.currentTheme.choiceHoverText
  GID("theme-choice-border").value = g.currentTheme.border;
  for (let i = 0; i < g.themes.length; i++) {
    let num = i
    GID(`themelink${i}`).onclick = function() {
      g.currentTheme = g.themes[num]
      GID("theme-bg-pick").value = g.currentTheme.bg;
      GID("theme-color-pick").value = g.currentTheme.color;
      GID("theme-name").value = g.currentTheme.name
      GID("theme-link-pick").value = g.currentTheme.links;
      GID("theme-choice-bg").value = g.currentTheme.choicebg;
      GID("theme-choice-text").value = g.currentTheme.choiceText
      GID("theme-choice-hover-bg").value = g.currentTheme.choiceHoverbg;
      GID("theme-choice-hover-text").value = g.currentTheme.choiceHoverText
      GID("theme-choice-border").value = g.currentTheme.border;
    }
  }
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
  drawGrid();
  alert(`You have deleted the ${deleted} grid and are now on the ${g.currentGrid.name} grid.`)
}
