const bannedWords = [
    "<script>", "</", "<", "<?", "fetch(", "require ", "import ", ";", ];

function containsBannedWord(inputString) {
    for (let word of bannedWords) {
        if (inputString.includes(word)) {
            return true;
        }
    }
    return false;
}

function containsSpace(inputString) {
    return inputString.trim() != inputString || inputString.trim() == "";
}

function espaceSensibleCharacters(inputString) {
    return inputString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = { containsBannedWord, containsSpace, espaceSensibleCharacters };