let prefab = [];
prefab.push(consonants);
prefab.push(vowels);
prefab.push(clusters);
prefab.push(lastnames);
prefab.push(names);
prefab.push(titleNumbers);
prefab.push(maleNames);
prefab.push(femaleNames);
prefab.push(adjectiveList)
prefab.push(color);
prefab.push(farmAnimals)
prefab.push(seat);
prefab.push(fruit);
prefab.push(liquor);
prefab.push(condiment);
prefab.push(cheese)
prefab.push(seasoning);
prefab.push(fish);
function loadPrefab() {
  //NOT WORKING - TRYING TO LOAD CATEGORIES IN SIDEBAR ON LOAD DEFAULTS
  for (let i = 0; i < prefab.length; i++) {
    g.grids.push(JSON.parse(prefab[i]))
    let t = g.grids[g.grids.length - 1].type
    console.log(t);
    if (g.gridTypes.indexOf(t) === -1) {
      g.gridTypes.push(t);
    }
  }
  g.gridTypes = g.gridTypes.sort();
}

GID("load-prefabs").onclick = function() {
  loadPrefab();
  alert("Prefabs loaded");
  fillSidebar();
}

/*
for (let n = 0; n < g.gridTypes.length; n++) {
  let gridTypeExists = false;
  console.log(t);
  console.log(g.gridTypes[n])
  if (t === g.gridTypes[n]) {
    gridTypeExists = true;
    console.log("existed");
  }
  if (gridTypeExists === false) {
    g.gridTypes.push(t);
    console.log("did not exist");
  }
}*/
