function loadPrefab() {
  g.grids.push(lastname);
  g.grids.push(adjectives);
  g.grids.push(color)
  g.grids.push(femaleNames);
  g.grids.push(condiments);
  g.grids.push(cheese);
  g.grids.push(fish);
  g.grids.push(fruit);
  g.grids.push(liquor);
  g.grids.push(seasoning);
  g.grids.push(seat);
  g.grids.push(lastname)
  g.grids.push(maleName);
  g.grids.push(consonant);
  g.grids.push(vowel);
  g.grids.push(titlenumber);
  g.grids.push(cluster);
  g.grids.push(name)
  for (let i = 0; i < g.grids.length; i++) {
    let t = g.grids[i].type
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
  console.log(g.gridTypes);
  fillSidebar();
}

GID("load-prefabs").onclick = function() {
  loadPrefab();
  alert("Prefabs loaded");
  fillSidebar();
}

/*

g.grids.push(cheese);
g.grids.push(farm);
g.grids.push(lastname);
for (let i = 0; i < g.grids.length; i++) {
  let t = g.grids[i].type
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
console.log(g.gridTypes);
fillSidebar();
}

*/
