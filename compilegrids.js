function loadPrefab() {
  g.grids.push(test)
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
