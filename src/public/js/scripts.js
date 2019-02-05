var cerrado = true;

$(function () {
    $("#seleccionfecha").datetimepicker({
        format: "L",
        format: "DD/MM/YYYY"
    });
    $("#seleccionfecha").datetimepicker("locale", "es");
});

$(document).ready(function() {
    $("#sidebarCollapse").on("click", function() {
        
        $("#sidebar").toggleClass("active");
        if (cerrado) {
            this.children[1].innerText = "Abrir Menu";
            cerrado = false;
        } else {
            this.children[1].innerText = "Cerrar Menu";
            cerrado = true;
        }
    });
});

$("#guardar-movimiento").click(function(e) {
    e.preventDefault();
    //console.log("click");

    const fechaTemp = $("#fecha").val();
    console.log(fechaTemp);
    const data = {};

    data.fecha = new Date(
        fechaTemp.substring(6),
        parseInt(fechaTemp.substring(3, 5)) - 1,
        fechaTemp.substring(0, 2)
    );
    data.concepto = $("#concepto").val();
    data.cantidad = parseFloat($("#cantidad").val());
    data.categoriaId = $("select option:selected").data("id");
    data.anoId = $(this).data("id");
    data.ano = $(this).data("ano");

    // console.log(data);

    $.post("/movimientos/" + data.ano + "/addmovimiento", data).done(dt => {
        const html = `<tr>
        <td>${fechaTemp}</td>
        <td>${dt.concepto}</td>
        <td>${dt.cantidad}€</td>
        <td>${dt.codigoCategoria}</td>
        </tr>`;

        limpiarFormulario();

        $(html).appendTo("#cuerpotabla");
    });
});

$("#limpiar-movimiento").click(function(e) {
    e.preventDefault();
    limpiarFormulario();
});

const limpiarFormulario = () => {
    $("#concepto").val("");
    $("#fecha").val("");
    $("#cantidad").val("");
    $("#categoria").val("Elegir...");
};

/*$("#editarAno").click(function(e) {
    // console.log('click');
    e.preventDefault();

    const anoId = $(this).data("id");
    const data = {};

    data.ano   = $("#seleccionAno").val();
    data.saldoinicial = $("#inputSaldo").val();

  $.post("/anos/edit/" + anoId, data, (resp) => {
    console.log(resp);
    //window.location.href = "/anos";
    })
});*/

/*$("#eliminarAno").click(function(e) {
    // console.log('click');
    e.preventDefault();

    const anoId = $(this).data("id");

    $.post("/anos/delete/" + anoId).done(dt => {
        // console.log('done');
        window.location.href = "/anos";
    });
});*/
