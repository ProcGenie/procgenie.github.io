function textToSpeech(g) {
  let synth = window.speechSynthesis;
  for (let n = 0; n < g.speak.length; n++) {
    let o = g.speak[n];
    let text = `${g.speak[n].text}`
    let voice;
    for (let i = 0; i < g.speakers.length; i++) {
      if (g.speakers[i].name === o.voice) {
        voice = g.speakers[i]
      }
    }
    let utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice.voice
      utterance.rate = voice.rate;
      utterance.pitch = voice.pitch;
    }
    synth.speak(utterance);
  }
  g.speak = [];
}
