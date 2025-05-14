const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista-transacciones");
const total = document.getElementById("total");
const botonExportar = document.getElementById("exportar");
const botonEliminar = document.getElementById("eliminar-todas");

let transacciones = [];

formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const nombre = document.getElementById("descripcion").value;
    const cantidad = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    
    if (nombre === "" || isNaN(cantidad)) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    const transaccion = {
        nombre,
        cantidad: tipo === "ingreso" ? cantidad : -cantidad,
    };
    
    transacciones.push(transaccion);
    actualizarLista();
    formulario.reset();
});  

function actualizarLista() {
    lista.innerHTML = "";
    let suma = 0;

    transacciones.forEach((transaccion, index) => {
        const li = document.createElement("li");
        li.textContent = `${transaccion.nombre}: $${transaccion.cantidad}`;
        lista.appendChild(li);
        suma += transaccion.cantidad;
    });

    total.textContent = `Total: $${suma}`;
}

function exportarCSV() {
    const csvContent = "data:text/csv;charset=utf-8," + transacciones.map(e => `${e.nombre},${e.cantidad}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_transacciones.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


botonExportar.addEventListener("click", exportarCSV);

botonEliminar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de eliminar todas las transacciones?")) {
        transacciones = [];
        actualizarLista();
    }
});