// =============================
// WhatsApp Status Monitor
// app.js
// =============================

async function cargarEstado() {

    try {

        const respuesta = await fetch("data/status.json?" + new Date().getTime());
        const estado = await respuesta.json();

        const indicador = document.getElementById("statusIndicator");
        const ultimaActualizacion = document.getElementById("lastUpdate");
        const incidente = document.getElementById("incidentInfo");

        indicador.className = "status";

        if (estado.status === "online") {
            indicador.classList.add("online");
            indicador.innerHTML = "🟢 OPERATIVO";
            incidente.innerHTML = "No hay incidentes activos.";
        }

        else if (estado.status === "warning") {
            indicador.classList.add("warning");
            indicador.innerHTML = "🟡 VERIFICANDO";
            incidente.innerHTML =
                "Se detectaron reportes. Esperando confirmación...";
        }

        else {
            indicador.classList.add("offline");
            indicador.innerHTML = "🔴 CAÍDA";

            incidente.innerHTML =
                `<strong>Inicio:</strong> ${estado.incident_start}<br>
                 <strong>Duración:</strong> ${estado.duration} minutos`;
        }

        ultimaActualizacion.innerHTML =
            "Última actualización: " + estado.last_update;

    }

    catch (error) {

        console.error(error);

        document.getElementById("statusIndicator").innerHTML =
            "⚠️ Error al obtener el estado";

    }

}

async function cargarHistorial() {

    try {

        const respuesta = await fetch("data/history.json?" + new Date().getTime());

        const historial = await respuesta.json();

        const tabla = document.getElementById("historyTable");

        tabla.innerHTML = "";

        historial.forEach(item => {

            tabla.innerHTML += `
                <tr>
                    <td>${item.start}</td>
                    <td>${item.end}</td>
                    <td>${item.duration} min</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

cargarEstado();
cargarHistorial();

// Actualiza cada minuto
setInterval(() => {

    cargarEstado();
    cargarHistorial();

}, 60000);
