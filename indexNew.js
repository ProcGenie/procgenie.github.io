//DOM MANIPULATION UTILITIES

function GID(el) {
  return document.getElementById(el);
}

function showAll() {
  let els = document.getElementsByClassName("hidable");
  for (let i = 0; i < els.length; i++) {
    els[i].style.display = "block";
  }
}

function hideAll() {
  let els = document.getElementsByClassName("hidable");
  console.log(els);
  for (let i = 0; i < els.length; i++) {
    els[i].style.display = "none";
  }
}

function showHide(el) {
  let d = GID(el).style.display;
  if (d === "none") {
    GID(el).style.display = "block";
  } else {
    GID(el).style.display = "none";
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function fileDropdown() {
  document.getElementById("fileDropdown").classList.toggle("show");
}

function ruleDropdown() {
  document.getElementById("ruleDropdown").classList.toggle("show")
}

function helpDropdown() {
  document.getElementById("helpDropdown").classList.toggle("show")
}

function worldDropdown() {
  document.getElementById("worldDropdown").classList.toggle("show")
}

function settingsDropdown() {
  document.getElementById("settingsDropdown").classList.toggle("show")
}

function aboutDropdown() {
  document.getElementById("aboutDropdown").classList.toggle("show")
}

function placesDropdown() {
  document.getElementById("placesDropdown").classList.toggle("show")
}

function peopleDropdown() {
  document.getElementById("peopleDropdown").classList.toggle("show")
}

function thingsDropdown() {
  document.getElementById("thingsDropdown").classList.toggle("show")
}

function eventsDropdown() {
  document.getElementById("eventsDropdown").classList.toggle("show")
}

function actionsDropdown() {
  document.getElementById("actionsDropdown").classList.toggle("show")
}

function designDropdown() {
  document.getElementById("designDropdown").classList.toggle("show")
}

function soundDropdown() {
  document.getElementById("soundDropdown").classList.toggle("show")
}

function natureDropdown() {
  document.getElementById("natureDropdown").classList.toggle("show")
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

GID("create-rule-btn").onclick = function() {
  hideAll();
  GID("gridName").value = g.currentGrid.name;
  GID("gridType").value = g.currentGrid.type;
  console.log(g.currentGrid)
  buildGrid(g.magnification);
  drawGrid();
  showHide("grammar-gen")
}

GID("list-rules-btn").onclick = function() {
  hideAll();
  GID("rules-a").innerHTML = "<h2>A</h2>"
  GID("rules-b").innerHTML = "<h2>B</h2>"
  GID("rules-c").innerHTML = "<h2>C</h2>"
  GID("rules-d").innerHTML = "<h2>D</h2>"
  GID("rules-e").innerHTML = "<h2>E</h2>"
  GID("rules-f").innerHTML = "<h2>F</h2>"
  GID("rules-g").innerHTML = "<h2>G</h2>"
  GID("rules-h").innerHTML = "<h2>H</h2>"
  GID("rules-i").innerHTML = "<h2>I</h2>"
  GID("rules-j").innerHTML = "<h2>J</h2>"
  GID("rules-k").innerHTML = "<h2>K</h2>"
  GID("rules-l").innerHTML = "<h2>L</h2>"
  GID("rules-m").innerHTML = "<h2>M</h2>"
  GID("rules-n").innerHTML = "<h2>N</h2>"
  GID("rules-o").innerHTML = "<h2>O</h2>"
  GID("rules-p").innerHTML = "<h2>P</h2>"
  GID("rules-q").innerHTML = "<h2>Q</h2>"
  GID("rules-r").innerHTML = "<h2>R</h2>"
  GID("rules-s").innerHTML = "<h2>S</h2>"
  GID("rules-t").innerHTML = "<h2>T</h2>"
  GID("rules-u").innerHTML = "<h2>U</h2>"
  GID("rules-v").innerHTML = "<h2>V</h2>"
  GID("rules-w").innerHTML = "<h2>W</h2>"
  GID("rules-x").innerHTML = "<h2>X</h2>"
  GID("rules-y").innerHTML = "<h2>Y</h2>"
  GID("rules-z").innerHTML = "<h2>Z</h2>"
  g.grids.sort((a, b) => (a.name > b.name) ? 1 : -1)
  for (let i = 0; i < g.grids.length; i++) {
    let f = g.grids[i].name.split("")[0];
    console.log(f);
    if (f === "A" || f === "a") {
      GID("rules-a").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "B" || f === "b") {
      GID("rules-b").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "C" || f === "c") {
      GID("rules-c").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "D" || f === "d") {
      GID("rules-d").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "E" || f === "e") {
      GID("rules-e").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "F" || f === "f") {
      GID("rules-f").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "G" || f === "g") {
      GID("rules-g").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "H" || f === "h") {
      GID("rules-h").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "I" || f === "i") {
      GID("rules-i").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "J" || f === "j") {
      GID("rules-j").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "K" || f === "k") {
      GID("rules-k").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "L" || f === "l") {
      GID("rules-l").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "M" || f === "m") {
      GID("rules-m").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "N" || f === "n") {
      GID("rules-n").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "O" || f === "o") {
      GID("rules-o").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "P" || f === "p") {
      GID("rules-p").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "Q" || f === "q") {
      GID("rules-q").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "R" || f === "r") {
      GID("rules-r").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "S" || f === "s") {
      GID("rules-s").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "T" || f === "t") {
      GID("rules-t").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "U" || f === "u") {
      GID("rules-u").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "V" || f === "v") {
      GID("rules-v").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "W" || f === "w") {
      GID("rules-w").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "X" || f === "x") {
      GID("rules-x").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "Y" || f === "y") {
      GID("rules-y").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    if (f === "Z" || f === "z") {
      GID("rules-z").innerHTML += `<p class="clickable" id="grid-${g.grids[i].name}-type-${g.grids[i].type}">${g.grids[i].name} (${g.grids[i].type})</p>`
    }
    let num = i;
    if (GID(`grid-${g.grids[i].name}-type-${g.grids[i].type}`)) {
      GID(`grid-${g.grids[i].name}-type-${g.grids[i].type}`).onclick = function() {
        g.currentGrid = g.grids[num]
        GID("gridName").value = g.currentGrid.name;
        GID("gridType").value = g.currentGrid.type;
        GID("isMap").value = g.currentGrid.isMap;
        hideAll();
        drawGrid();
        showHide("grammar-gen")
      }
    }
  }
  showHide("list-rules-page")
}

hideAll();
