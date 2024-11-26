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

function isPasswordComplex(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit;
}

module.exports = { containsBannedWord, containsSpace, espaceSensibleCharacters, isPasswordComplex };