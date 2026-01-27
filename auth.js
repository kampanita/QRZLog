// AUTHENTICATION MODULE
// Separado del HTML para evitar lectura directa en View Source.

const _0x5a1 = "VHhpbmd1cnJp"; // Base64 encoded hash

window.checkPassword = function(input) {
    try {
        // Simple encoding check to avoid plain text comparison in memory
        return btoa(input) === _0x5a1;
    } catch (e) {
        return false;
    }
};

window.isSessionActive = function() {
    return sessionStorage.getItem('radiolog_auth_token') === _0x5a1;
};

window.setSessionActive = function() {
    sessionStorage.setItem('radiolog_auth_token', _0x5a1);
};
