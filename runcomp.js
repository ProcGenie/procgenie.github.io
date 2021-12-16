function runCompromise(c, text) {
  let nlpWrap = {};
  let compSafe = [
    "tokenize",
    "fromJson",
    "verbose",
    "version",
    "world",
    "parseMatch",
    "all",
    "found",
    "parent",
    "parents",
    "tagger",
    "wordCount",
    "length",
    "clone",
    "cache",
    "uncache",
    "first",
    "last",
    "slice",
    "eq",
    "terms",
    "firstTerms",
    "lastTerms",
    "sentences",
    "termList",
    "groups",
    "match",
    "not",
    "matchOne",
    "if",
    "ifNo",
    "has",
    "lookBehind",
    "lookAhead",
    "before",
    "after",
    "lookup",
    "toLowerCase",
    "toUpperCase",
    "toTitleCase",
    "toCamelCase",
    "pre",
    "post",
    "trim",
    "tag",
    "tagSafe",
    "unTag",
    "canBe",
    "replace",
    "replaceWith",
    "delete",
    "append",
    "prepend",
    "concat",
    "reverse",
    "normalize",
    "unique",
    "split",
    "splitBefore",
    "splitAfter",
    "segment",
    "join",
    "text",
    "json",
    "out",
    "debug",
    "clauses",
    "hyphenated",
    "phoneNumbers",
    "hashTags",
    "emails",
    "emoticons",
    "emojis",
    "atMentions",
    "urls",
    "adverbs",
    "pronouns",
    "conjunctions",
    "prepositions",
    "abbreviations",
    "people",
    "places",
    "organizations",
    "topics",
    "contractions",
    "expand",
    "contract",
    "parentheses",
    "possessives",
    "quotations",
    "acronyms",
    "lists",
    "items",
    "add",
    "adjectives",
    "nouns",
    "verbs",
    "toPlural",
    "toSingular",
    "isPlural",
    "isSingular",
    "hasPlural",
    "toPossessive",
    "conjugate",
    "toPastTense",
    "toPresentTense",
    "toFutureTense",
    "toInfinitive",
    "toGerund",
    "toParticiple",
    "toNegative",
    "toPositive",
    "isNegative",
    "isPositive",
    "isPlural",
    "isSingular",
    "adverbs",
    "isImperative",
    "toSuperlative",
    "toComparative",
    "toAdverb",
    "toVerb",
    "toNoun",
    "dates",
    "get",
    "units",
    "fractions",
    "toText",
    "toCardinal",
    "toOrdinal",
    "set",
    "add",
    "subtract",
    "increment",
    "decrement",
    "isEqual",
    "greaterThan",
    "lessThan",
    "between",
    "isOrdinal",
    "isCardinal",
    "toLocaleString",
    "money",
    "currency",
    "toDecimal",
    "normalize",
    "toPercantage",
    "toFraction",
    "sentences",
    "isPassive",
    "isQuestion",
    "isExclamation",
    "isStatement",
    "prepend",
    "append",
    "toExclamation",
    "toQuestion",
    "toStatement",
    "each",
    "speak",
    "middleEnglish",
    "rhyme"
  ]
  nlpWrap.doc = nlp(text);
  console.log(c);
  c = c.split(".");
  console.log(c);
  let fArr = [];
  nlpWrap.o = {};
  for (let i = 0; i < c.length; i++) {
    let f = c[i].match(/(\w+)\(/)[1]
    let args;
    if (c[i].match(/\(([\w\d\,]+)\)/)) {
      args = c[i].match(/\(([\{\}\w\s\+\.\-\=\<\>\!\?\d\,\:\;\$\'\"\%\/]+)\)/)[1]
    } else {
      args = null;
    }
    if (f === "rhyme") {
      let rhymes = pronouncing.rhymes(nlpWrap.o);
      let t = nlpWrap.o;
      t = t.split(" ");
      let rhyme = t[t.length - 1];
      rhyme = pronouncing.rhymes(rhyme);
      if (rhyme && rhyme.length > 0) {
        rhyme = rhyme[getRandomInt(0, rhyme.length - 1)]
        t[t.length - 1] = `${rhyme} `;
        t = t.join(" ");
        nlp.altOutput = t
      } else {
        console.log("ERROR: No rhyme for t")
        return "";
      }

      // OPTIMIZE: rhymes[getRandomInt(0, rhymes.length - 1)]
    } else if (f === "middleEnglish") {
      nlp.altOutput = middleEnglish(nlpWrap.o)
    } else if (f === "speak") {

      let o = {}
      o.voice = args;
      if (nlp.altOutput) {
        o.text = nlp.altOutput;
      } else {
        o.text = nlpWrap.o
      }


      g.speak.push(o)
      console.log(g);
    } else {
      let onList = false;
      for (let i = 0; i < compSafe.length; i++) {
        if (f === compSafe[i]) {
          console.log(`${f} is the same as ${compSafe[i]}`)
          onList = true;
        }
      }

      if (onList === true) {
        if (nlpWrap.o[f]) {
          try {
            nlpWrap.o = nlpWrap.o[f](args)
          } catch {
            console.log(`When you tried to use a compromise method named ${f} with the arguments ${args}, it threw an error. Make sure that the method ${f} exists for the given context`)
          }
        } else {
          console.log(f);
          try {
            nlpWrap.o = nlpWrap.doc[f](args)
          } catch {
            console.log(`When you tried to use a compromise method named ${f} with the arguments ${args}, it threw an error. Make sure that the method ${f} exists for the given context`)
          }
        }
      } else {
        console.log(`${f} is not a compromise method.`)
      }
    }
  }
  if (nlp.altOutput) {
    console.log(nlp.altOutput)
    return nlp.altOutput;
  } else {
    return nlpWrap.o
  }
}
