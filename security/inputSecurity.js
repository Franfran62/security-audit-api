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
    return inputString.trim() != inputString || inputString.trim() != "";
}

module.exports = { containsBannedWord, containsSpace };