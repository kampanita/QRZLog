const HASH = "e2667d61d7936e8ba44ce999e3f45d0381fa058e56feb00797268ced86bc2a22";
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
window.validatePass = async function (p) {
    try {
        if (!p) return false;
        const h = await sha256(p);
        return h === HASH;
    } catch (e) { console.error(e); return false; }
};
window.doLogin = async function () {
    const p = document.getElementById('login-pass').value;
    if (await window.validatePass(p)) {
        sessionStorage.setItem('auth', 'true');
        document.getElementById('login-overlay').classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => document.getElementById('login-overlay').style.display = 'none', 500);
    } else {
        document.getElementById('login-msg').innerText = "ACCESO DENEGADO";
        document.getElementById('login-pass').value = '';
    }
};
if (sessionStorage.getItem('auth') === 'true') {
    document.getElementById('login-overlay').style.display = 'none';
}
