var socket = io();

var params = new URLSearchParams(window.location.search);

var matriz;

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Validacion del usaurio
if (params.has('usu_id')) {
    usu_id = window.location.href.split("usu_id=")[1];
    socket.emit('ValidateUsuario', usu_id, function (usuario) {
        if (!usuario) {
            window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

// * Se conecta al servidor
socket.emit('direccionGrupoConnection', function (grupos) {
    matriz = new Array(2);
    matriz[0] = new Array(6);
    matriz[1] = new Array(6);

    if (grupos) {
        for (let i = 0; i < grupos.length; i++) {
            switch (grupos[i].gru_nom) {        //Ordena los grupos por grado y por grupo
                case "A":
                    matriz[0][grupos[i].gru_gra - 1] = grupos[i];
                    break;
                case "B":
                    matriz[1][grupos[i].gru_gra - 1] = grupos[i];
                    break;
                default:
                    alert('ERROR, hay grupos que no son A, B o C');
                    break;
            }
        }
        FillTable(matriz);
        document.getElementById('number_grupos').textContent = `Total: ${grupos.length} grupos`
    }
})

// * Asigna los alumnos a sus grupos
function GrupoAsignarAlumnos(){
    window.location = `./GrupoAsignarAlumnos.html?usu_id=${params.get('usu_id')}`;
}

// * Asigna los profesores a sus grupos
function GrupoAsignarProfesores(){
    window.location = `./GrupoAsignarProfesores.html?usu_id=${params.get('usu_id')}`;
}

// * LLena la tabla de grupos
function FillTable(matriz) {
    const table = document.querySelector('#table_grupos');

    for (let i = 0; i < 2; i++) {                   //Recorre la tabla por grupo
        let tr = document.createElement('tr');

        for (let j = 0; j < 6; j++) {               //Recorre la tabla por grado
            
            if (!matriz[i][j]) {                    //Si no existe un grupo
                let td = document.createElement('td');
                let button = document.createElement('button');
                button.textContent = `+`;
                button.id = i + " " + j;
                button.className = "consultar";
                button.addEventListener('click', create);
                td.appendChild(button);
                tr.appendChild(td);

            } else {                                //Si existe un grupo

                let td = document.createElement('td');
                let button = document.createElement('button');
                button.textContent = `${matriz[i][j].gru_gra}° ${matriz[i][j].gru_nom} `;
                button.id = matriz[i][j].gru_id;
                button.className = "consultar";
                button.addEventListener('click', information);

                td.appendChild(button);
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }
}

function Ancestro(ancestor, level) {
    if (level == 0) {
        return ancestor;
    } else {
        level--;
        return get_acenstors(ancestor.parentElement, level);
    }
}

// * Consulta la informacion del grupo
function information(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    window.location = `../../html/administrador/grupoInformacion.html?usu_id=${params.get('usu_id')}&gru_id=${id}`;
}

// * Crea un nuevo grupo
function create(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    var bandera = true;
    for (let i = 0; i < id.length; i++) {      
        //Si no tiene id
        if (id.charAt(i) == " ") {              
            bandera = false;
            break;
        }
    }

    //Si no tiene id
    if (!bandera) {                            
        coordenas = id.split(" ");
        y = parseInt(coordenas[0]);
        x = coordenas[1];
        x = parseInt(x) + 1;
        switch (y) {
            case 0:
                y = "A";
                break;
            case 1:
                y = "B";
                break;
        }
        ancestro.textContent = x + "° " + y;
        socket.emit('createGrupo', x, y, function (res) {
            ancestro.id = res;
            var y = parseInt(coordenas[0]) + 1;
            x--;
            var tr = document.getElementById(y + " " + x);

            if (tr) {
                let button = document.createElement('button');
                button.textContent = `+`;
                button.id = x + " " + y;
                button.className = "consultar";
                button.addEventListener('click', create);
                tr.appendChild(button);
            }
        })
    } else {
        window.location = `../../html/administrador/grupoInformacion.html?usu_id=${params.get('usu_id')}&gru_id=${ancestro.id}`;
    }
}
