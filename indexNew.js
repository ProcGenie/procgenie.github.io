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

function gridDropdown() {
  document.getElementById("gridDropdown").classList.toggle("show");
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

hideAll();
GID("help").style.display = "block"

GID("help-btn").onclick = function() {
  hideAll();
  GID("help").style.display = "block"
}
