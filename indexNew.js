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
  fillSidebar();
}

GID("create-themes-btn").onclick = function() {
  hideAll();
  showHide("theme-gen")
  fillThemeSidebar();
}

GID("delete-theme-btn").onclick = function() {
  if (g.themes.length > 1) {
    for (let i = 0; i < g.themes.length; i++) {
      if (g.currentTheme.name === g.themes[i].name) {
        g.themes.splice(i, 1);
        break;
      }
    }
  }
  g.currentTheme = g.themes[0]
  fillThemeSidebar();
}

GID("save-theme-btn").onclick = function() {
  let o = {};
  o.bg = GID("theme-bg-pick").value;
  o.color = GID("theme-color-pick").value;
  o.name = GID("theme-name").value;
  o.links = GID("theme-link-pick").value;
  o.choicebg = GID('theme-choice-bg').value;
  o.choiceText = GID('theme-choice-text').value
  o.choiceHoverbg = GID("theme-choice-hover-bg").value;
  o.choiceHoverText = GID("theme-choice-hover-text").value;
  let exists = false;
  for (let i = 0; i < g.themes.length; i++) {
    if (g.themes[i].name === o.name) {
      g.themes[i] = o;
      g.currentTheme = g.themes[i]
      exists = true;
    }
  }
  if (exists === false) {
    g.themes.push(o);
    g.currentTheme = g.themes[g.themes.length - 1]
  }
  fillThemeSidebar();
}

hideAll();

GID("help-btn").onclick = function() {
  hideAll();
  GID("help").style.display = "block"
}

showHide("grammar-gen")
drawGrid();
