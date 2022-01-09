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
  g.grids.push(germanSurnames);
  g.grids.push(italianSurnames);
  g.grids.push(italianMaleFirstNames);
  g.grids.push(italianFemaleFirstNames)
  g.grids.push(greekFemaleFirstNames);
  g.grids.push(consonant);
  g.grids.push(vowel);
  g.grids.push(titlenumber);
  g.grids.push(cluster);
  g.grids.push(name);
  g.grids.push(mood);
  g.grids.push(modernJob);
  g.grids.push(personAdjectives);
  g.grids.push(vegetable);
  g.grids.push(governmentType);
  g.grids.push(fabric);
  g.grids.push(symptom);
  g.grids.push(musicalInstrument);
  g.grids.push(monster);
  g.grids.push(flower);
  g.grids.push(meleeWeapon);
  g.grids.push(rangedWeapon);
  g.grids.push(weatherCondition);
  g.grids.push(personalityType);
  g.grids.push(encouragingWord);
  g.grids.push(interjection);
  g.grids.push(preposition);
  g.grids.push(drunk)
  g.grids.push(manmadeFeature)
  g.grids.push(environmentalHazard)
  g.grids.push(bodyPart);
  g.grids.push(relic);
  g.grids.push(agricultureMedieval);
  g.grids.push(medievalHunter);
  g.grids.push(medievalAquaculture);
  g.grids.push(medievalArtist)
  g.grids.push(medievalCraftsman);
  g.grids.push(leathermaker);
  g.grids.push(smith);
  g.grids.push(randomCraftsman);
  g.grids.push(medievalCriminal);
  g.grids.push(medievalMusician);
  g.grids.push(medievalEntertainer);
  g.grids.push(medievalMedical);
  g.grids.push(medievalMerchant);
  g.grids.push(medievalSailor);
  g.grids.push(medievalService);
  g.grids.push(hello);
  g.grids.push(howAreYou);
  g.grids.push(goodbye);
  g.grids.push(bah);
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
