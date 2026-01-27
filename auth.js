// AUTHENTICATION MODULE
// Hash: password -> Base64
const _0x5a1 = "VHhpbmd1cnJp"; 

window.checkPassword = function(input) {
    try {
        if (!input) return false;
        // Limpiamos espacios en blanco accidentales al inicio o final
        const cleanInput = input.trim();
        // Comparamos el hash Base64
        return btoa(cleanInput) === _0x5a1;
    } catch (e) {
        console.error("Auth Error:", e);
        return false;
    }
};

window.isSessionActive = function() {
    return localStorage.getItem('radiolog_auth_token') === _0x5a1;
};

window.setSessionActive = function() {
    localStorage.setItem('radiolog_auth_token', _0x5a1);
};
