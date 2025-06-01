// Se obtienen los elementos del DOM
const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista-transacciones");
const total = document.getElementById("total");
const botonEliminar = document.getElementById("eliminar-todas");
const botonExportarCSV = document.getElementById("exportar-csv");
const botonExportarPDF = document.getElementById("exportar-pdf");

let transacciones = [];

// Evento para manejar el envío del formulario
formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    // Se obtienen los valores del formulario
    const nombre = document.getElementById("descripcion").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const fecha = document.getElementById("fecha").value;
    const tipo = document.getElementById("tipo").value;

    // Se verifica que los campos no estén vacíos y que el monto sea un número válido
    if (nombre === "" || isNaN(monto)) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Objeto que representa la transacción
    const transaccion = {
        nombre: nombre,
        monto: tipo === "gasto" ? -monto : monto, // Se ajusta el monto según el tipo de transacción
        fecha: fecha,
        tipo: tipo
    };

    // Agrega la transacción y actualiza la lista en pantalla
    transacciones.push(transaccion);
    actualizarLista();
    
    formulario.reset();
});

// Función para actualizar la lista de transacciones 
function actualizarLista() {
    lista.innerHTML = ""; 
    let suma = 0;

    // Se recorre el arreglo de transacciones y se crea un elemento de lista por cada transacción 
    transacciones.forEach((transaccion) => {
        const li = document.createElement("li");
        li.textContent = `${transaccion.nombre}: $${transaccion.monto} | ${transaccion.fecha}`;
        lista.appendChild(li);
        suma += transaccion.monto; // Actualiza el total
    });

    total.textContent = `Total: $${suma}`;
}

// Función para exportar en formato CSV
function exportarCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
        transacciones.map(e => `${e.nombre},${e.monto},${e.fecha}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    // Se crea un enlace para descargar el archivo CSV
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_transacciones.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para exportar en formato PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fechaHora = new Date().toLocaleString();
    let y = 20;

    // Titulo del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Rendición de Cuentas", 105, y, { align: "center" });

    y += 10;
    doc.setDrawColor(100);
    doc.line(20, y, 190, y); // Línea separadora
    y += 10;

    // Encabezado de columnas de la tabla
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nombre", 20, y);
    doc.text("Monto", 90, y);
    doc.text("Fecha", 140, y);

    y += 5;
    doc.setDrawColor(180);
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFont("helvetica", "normal");

    // Se agregan las transacciones al documento
    transacciones.forEach(transaccion => {
        if (y > 270) { // Genera una nueva página si es necesario
            doc.addPage();
            y = 20;
        }

        doc.text(transaccion.nombre, 20, y);
        doc.text(`${transaccion.monto.toLocaleString("es-CL")}`, 90, y);
        doc.text(transaccion.fecha, 140, y);
        y += 8;
    });

    // Línea separadora antes del total
    y += 5;
    doc.setDrawColor(150);
    doc.line(20, y, 190, y);
    y += 10;

    // Muestra el saldo actual
    const total = transacciones.reduce((acc, t) => acc + t.monto, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Saldo Total: $${total.toLocaleString("es-CL")}`, 20, y);

    y += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Reporte generado el ${fechaHora}`, 20, y);

    doc.save("rendicion_cuentas.pdf");
}

// Eventos para exportar en PDF y CSV al hacer clic en los botones
botonExportarPDF.addEventListener("click", exportarPDF);
botonExportarCSV.addEventListener("click", exportarCSV);

// Evento para eliminar todas las transacciones
botonEliminar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de eliminar todas las transacciones?")) {
        transacciones = [];
        actualizarLista();
    }
});