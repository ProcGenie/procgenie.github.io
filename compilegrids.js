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
  for (let i = 0; i < prefab.length; i++) {
    g.grids.push(JSON.parse(prefab[i]))
  }
}

GID("load-prefabs").onclick = function() {
  loadPrefab();
  alert("Prefabs loaded");
}
