$(function() {
    $("#seleccionfecha").datetimepicker({
        format: "L",
        format: "DD/MM/YYYY"
    });
    $("#seleccionfecha").datetimepicker("locale", "es");
});

$("#guardar-movimiento").click(function(e) {
    e.preventDefault();
    //console.log("click");

    const fechaTemp = $("#fecha").val();
    const data = {};

    data.fecha = new Date(
        fechaTemp.substring(6),
        fechaTemp.substring(3, 5),
        fechaTemp.substring(0, 2)
    );
    data.concepto = $("#concepto").val();
    data.cantidad = parseFloat($("#cantidad").val());
    data.categoria = $("select option:selected").data("id");
    data.anoId = $(this).data("id");
    data.ano = $(this).data("ano");

    // console.log(data);

    $.post("/movimientos/" + data.ano + "/addmovimiento", data).done(dt => {
        // console.log(dt);
        const html = `<tr>
        <td>${fechaTemp}</td>
        <td>${data.concepto}</td>
        <td>${data.cantidad}</td>
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

$("#eliminarAno").click(function(e) {
    // console.log('click');
    e.preventDefault();

    const anoId = $(this).data("id");

    $.post("/anos/delete/" + anoId).done(dt => {
        // console.log('done');
        window.location.href = "/anos";
    });
});
