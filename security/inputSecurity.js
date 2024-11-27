const bannedWords = [
    "<script>", "</", "/>", "<?", "fetch(", "require ", "import " ];
    
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
function isPasswordComplex(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
}
function isCorrectEmail(inputEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail) && !containsBannedWord(inputEmail) && !containsSpace(inputEmail);
}
function isCorrectPassword(password) {
    return isPasswordComplex(password) && !containsBannedWord(password) && !containsSpace(password);
}
function isCorrectString(inputString) {
    return !containsBannedWord(inputString) && !containsSpace(inputString);
}
function isCorrectDate(inputDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inputDate)) {
        return false;
    }
    const date = new Date(inputDate);
    return date instanceof Date && !isNaN(date);
}
function isCorrectNumber(value) {
    return !isNaN(value) && isFinite(value);
}

function isCorrectReservation(data, isUpdate = false) {
    const validKeys = ['date_reservation', 'date_entree', 'date_sortie', 'hebergement_id', 'user_id', 'nom', 'prix', 'solde_restant'];

    if (isUpdate) {
        validKeys.push('id');
    }
    if (!Object.keys(data).length) {
        console.log('Validation échouée: données vides');
        return false;
    }
    if (isUpdate && !data.id) {
        console.log('Validation échouée: id manquant pour la mise à jour');
        return false;
    }

    for (const key of Object.keys(data)) {
        if (!validKeys.includes(key)) {
            console.log(`Validation échouée: clé invalide ${key}`);
            return false;
        }
        if (key === 'nom' && !isCorrectString(data[key])) {
            console.log(`Validation échouée: nom invalide ${data[key]}`);
            return false;
        }
        if ((key === 'date_reservation' || key === 'date_entree' || key === 'date_sortie') && !isCorrectDate(data[key])) {
            console.log(`Validation échouée: date invalide ${data[key]}`);
            return false;
        }
        if ((key === 'prix' || key === 'solde_restant') && !isCorrectNumber(data[key])) {
            console.log(`Validation échouée: nombre invalide ${data[key]}`);
            return false;
        }
    }
    return true;
}

function isCorrectHebergement(data, isUpdate = false) {
    const validKeys = ['nom', 'description', 'adresse', 'prix', 'capacite'];

    if (isUpdate) {
        validKeys.push('id');
    }
    if (!Object.keys(data).length) {
        console.log('Validation échouée: données vides');
        return false;
    }
    if (isUpdate && !data.id) {
        console.log('Validation échouée: id manquant pour la mise à jour');
        return false;
    }

    for (const key of Object.keys(data)) {
        if (!validKeys.includes(key)) {
            console.log(`Validation échouée: clé invalide ${key}`);
            return false;
        }
        if ((key === 'nom' || key === 'description' || key === 'adresse') && !isCorrectString(data[key])) {
            console.log(`Validation échouée: ${key} invalide ${data[key]}`);
            return false;
        }
        if (key === 'prix' && !isCorrectNumber(data[key])) {
            console.log(`Validation échouée: prix invalide ${data[key]}`);
            return false;
        }
        if (key === 'capacite' && !isCorrectNumber(data[key])) {
            console.log(`Validation échouée: capacité invalide ${data[key]}`);
            return false;
        }
    }
    return true;
}

function isCorrectPromotion(data, isUpdate = false) {
    const validKeys = ['nom', 'remise'];

    if (isUpdate) {
        validKeys.push('id');
    }
    if (!Object.keys(data).length) {
        console.log('Validation échouée: données vides');
        return false;
    }
    if (isUpdate && !data.id) {
        console.log('Validation échouée: id manquant pour la mise à jour');
        return false;
    }

    for (const key of Object.keys(data)) {
        if (!validKeys.includes(key)) {
            console.log(`Validation échouée: clé invalide ${key}`);
            return false;
        }
        if (key === 'nom' && !isCorrectString(data[key])) {
            console.log(`Validation échouée: nom invalide ${data[key]}`);
            return false;
        }
        if (key === 'remise' && !isCorrectNumber(data[key])) {
            console.log(`Validation échouée: remise invalide ${data[key]}`);
            return false;
        }
    }
    return true;
}

module.exports = { isCorrectEmail, isCorrectPassword, isCorrectString, isCorrectDate, isCorrectNumber, isCorrectReservation, isCorrectHebergement, isCorrectPromotion };