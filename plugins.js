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
