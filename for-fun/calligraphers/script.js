// import winkNLP from 'wink-nlp';
// import model from 'wink-eng-lite-web-model';
// import vectors from 'wink-embeddings-sg-100d';

// const nlp = winkNLP(model, ['sbd', 'pos'], vectors);
const glyphSpace = document.querySelector('#glyphs');
const wordInput = document.querySelector('#word-input');
const makeGlyphButton = document.querySelector('button');
const glyphs = {};

// function embed(word) {
//   const normalizedWord = word.toLowerCase();

//   // Process the word as a document to get a token
//   const doc = nlp.readDoc(normalizedWord);

//   // Get the first (and only) token
//   const token = doc.tokens().itemAt(0);

//   // Use nlp.vectorOf() to get the vector for that token
//   // This function automatically handles cases where the token might not have a vector
//   // (e.g., if it's not in the pre-trained vocabulary).
//   const vector = nlp.vectorOf(token);

//   // nlp.vectorOf() returns undefined if the vector is not found.
//   // We can return null or an empty array in such cases, based on preference.
//   if (vector) {
//     console.log(vector);
//     return vector;
//   } else {
//     console.warn(`Vector not found for word: "${word}"`);
//     return null;
//   }
// }

function getHash(word) {
    // embed(word);
    return word.toLowerCase().split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)), 0);
}

function displayGlyph(word) {
    let number = 0;
    if (glyphs[word]) {
        number = glyphs[word];
    } else {
        number = getHash(word) % 512;
        // I'm going to allow multiple words being assigned to one glyph, as it encourages interperatability
        // while (Object.values(glyphs).includes(number)) {
        //     number += 1;
        //     number = number % 512;
        // }
        glyphs[word] = number;
    }

    // Convert the number to binary
    let binaryNumber = number.toString(2).padStart(9, '0');
    if (binaryNumber == '000000000') {
        number += 1;
        binaryNumber = number.toString(2).padStart(9, '0');
    }

    // Create a div for each glyph layer 1-9 (given the binary number) and add it to the DOM
    for (let i = 1; i <= 9; i++) {
        if (binaryNumber[i] == '1') {
            let glyphImg = document.createElement('img');
            glyphImg.src = `images/${i}.png`;
            glyphSpace.appendChild(glyphImg);
        }
    }

}

function clearGlyphSpace() {
    while (glyphSpace.firstChild) {
        glyphSpace.removeChild(glyphSpace.lastChild);
    }
}

makeGlyphButton.addEventListener("click", () => {
    clearGlyphSpace();
    let wordInput = document.getElementById("word-input").value;
    displayGlyph(wordInput);
});
