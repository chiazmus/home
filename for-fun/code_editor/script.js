const button = document.getElementById('runButton');
const output = document.getElementById('output');
const editor = document.getElementById("editor");

button.addEventListener('click', runCode);
const keywords = ["if", "then", "else", 'print', 'goto', 'input', 'let', 'end'];

let skipHighlighting = false;

function highlightCode() {
    // If we're in the middle of handling an Enter key, skip highlighting.
    if (skipHighlighting) return;

    // Save caret position (as a character offset)
    const caretOffset = getCaretCharacterOffsetWithin(editor);

    // Escape HTML, replace keywords, and preserve newlines
    let text = editor.innerText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    text = text.replace(regex, `<span class="highlight">$1</span>`);
    text = text.replace(/\n/g, "<br>");

    editor.innerHTML = text;
    setCaretCharacterOffsetWithin(editor, caretOffset);
}

// Helper to get caret offset as a character count from the start
function getCaretCharacterOffsetWithin(element) {
    const selection = window.getSelection();
    let charCount = 0;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      charCount = preCaretRange.toString().length;
    }
    return charCount;
}

// Helper to set the caret at a given character offset within an element
function setCaretCharacterOffsetWithin(element, offset) {
    const selection = window.getSelection();
    const range = document.createRange();
    let charCount = 0;

    function traverseNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (charCount + node.length >= offset) {
          range.setStart(node, offset - charCount);
          range.collapse(true);
          return true;
        }
        charCount += node.length;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (traverseNodes(node.childNodes[i])) return true;
        }
      }
      return false;
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

  // Custom Enter key handling: insert a <br> plus a zero-width space.
editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      skipHighlighting = true;  // Prevent our auto-highlighting from interfering

      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();

      // Insert a <br> element
      const br = document.createElement("br");
      range.insertNode(br);

      // Insert a zero-width space so the caret has a proper place to go.
      const zwsp = document.createTextNode("\u200B");
      br.parentNode.insertBefore(zwsp, br.nextSibling);

      // Move the caret to after the zero-width space.
      range.setStartAfter(zwsp);
      range.setEndAfter(zwsp);
      selection.removeAllRanges();
      selection.addRange(range);

      // Use a short timeout so that any input event (from the break) doesn’t run our highlighting too early.
      setTimeout(() => {
        skipHighlighting = false;
        highlightCode();
      }, 0);
    }
});

// Re-highlight on any other input.
editor.addEventListener("input", () => {
    if (!skipHighlighting) highlightCode();
});

function runCode(){
    return true;
}