var params = new URLSearchParams(window.location.search);

function index() {
    window.location = `./index.html?usu_id=${params.get('usu_id')}`;
}

function ProfesorAdministrar() {
    window.location = `./ProfesorAdministrar.html?usu_id=${params.get('usu_id')}`;
}

function GrupoAdministrar() {
    window.location = `./GrupoAdministrar.html?usu_id=${params.get('usu_id')}`;
}

function AlumnoAdministrar() {
    window.location = `./AlumnoAdministrar.html?usu_id=${params.get('usu_id')}`;
}

function PasswordAdministrador() {
    window.location = `./PasswordAdministrador.html?usu_id=${params.get('usu_id')}`;
}

function SoporteAdministrador() {
    window.location = `./SoporteAdministrador.html?usu_id=${params.get('usu_id')}`;
}