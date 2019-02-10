var cerrado = true;

// Helper para limpiar el formulario de movimientos y remover clases de validacion
const limpiarFormulario = () => {
    $("#concepto")
        .val("")
        .removeClass("is-valid")
        .removeClass("is-invalid");
    $("#fecha")
        .val("")
        .removeClass("is-valid")
        .removeClass("is-invalid");
    $("#cantidad")
        .val("")
        .removeClass("is-valid")
        .removeClass("is-invalid");
    $("#categoria")
        .val("Elegir...")
        .removeClass("is-valid")
        .removeClass("is-invalid");
};

// Datepicker
$(function() {
    const ano = $("#guardar-movimiento").data("ano");
    $("#seleccionfecha").datetimepicker({
        format: "L",
        format: "DD/MM/YYYY",
        defaultDate: new Date(ano, 0, 1)
        //maxDate: new Date(ano,11,31),
    });
    $("#seleccionfecha").datetimepicker("locale", "es");
});


$(document).ready(function() {
    const ano = $("#guardar-movimiento").data("ano");
    
    // Escucha evento del boton limpiar para limpiar el formulario de movimientos
    $("#limpiar-movimiento").click(function(e) {
        e.preventDefault();
        limpiarFormulario();
    });



    // Script pra cerrar-abrir menu lateral
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

    /* Validadción personalizada de la fecha pasando parametro 
    del año que se esta editando*/
    $.validator.addMethod(
        "datePerso",
        function(value, element, param) {
            console.log("param", param);

            var check = false,
                re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
                adata,
                gg,
                mm,
                aaaa,
                xdata;
            if (re.test(value)) {
                adata = value.split("/");
                gg = parseInt(adata[0], 10);
                mm = parseInt(adata[1], 10);
                aaaa = parseInt(adata[2], 10);
                xdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
                console.log(param === aaaa);
                if (
                    xdata.getUTCFullYear() === aaaa &&
                    xdata.getUTCMonth() === mm - 1 &&
                    xdata.getUTCDate() === gg &&
                    param === aaaa
                ) {
                    check = true;
                } else {
                    check = false;
                }
            } else {
                check = false;
            }
            return this.optional(element) || check;
        },
        $.validator.messages.date
    );

    /* Función de validacion principal utilizando validacion de jquery https://jqueryvalidation.org */
    $("#addMovimiento").validate({
        rules: {
            fecha: {
                required: true,
                datePerso: parseInt(ano)
            },
            concepto: {
                required: true,
                minlength: 6
            },
            cantidad: { required: true, currency: ["€", false] },
            categoria: "required"
        },
        messages: {
            fecha: {
                required: "Por favor introduzca una fecha.",
                datePerso: "Introduzca una fecha valida de " + ano + "."
            },
            concepto: {
                required: "El concepto es requerido.",
                minlength: "Longuitud mínima no alcanzada."
            },
            cantidad: {
                required: "Introduzca la cantidad.",
                currency: "Formato incorrecto."
            },
            categoria: "Por favor elija una categoría."
        },
        errorElement: "em",
        errorPlacement: function(error, element) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback");
            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element)
                .addClass("is-invalid")
                .removeClass("is-valid");
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element)
                .addClass("is-valid")
                .removeClass("is-invalid");
        },
        submitHandler: function() {
            const fechaTemp = $("#fecha").val();
            //console.log($(this).data('id'));
            const data = {};

            data.fecha = new Date(
                fechaTemp.substring(6),
                parseInt(fechaTemp.substring(3, 5)) - 1,
                fechaTemp.substring(0, 2)
            );
            data.concepto = $("#concepto").val();
            data.cantidad = parseFloat($("#cantidad").val());
            data.categoriaId = $("select option:selected").data("id");
            data.anoId = $("#guardar-movimiento").data("id");
            data.ano = $("#guardar-movimiento").data("ano");

            //console.log(data);

            $.post("/movimientos/" + data.ano + "/addmovimiento", data).done(
                dt => {
                    console.log(dt);
                    const claseCantidad = dt.esIngreso ? 'class="text-right text-success"' : 'class="text-left text-danger"';
                    const html = `<tr>
                    <td class="text-center">${fechaTemp}</td>
                    <td>${dt.concepto}</td>
                    <td ${claseCantidad}">${dt.cantidad}€</td>
                    <td class="text-center">${dt.codigoCategoria}</td>
                    </tr>`;

                    limpiarFormulario();

                    $('p#resumenSaldoActual').text(dt.resumen.saldoActual + ' €');
                    $('p#resumenSaldoInicial').text(dt.resumen.saldoInicial + ' €');
                    $('p#resumenTotalIngresos').text(dt.resumen.totalIngresos + ' €');
                    $('p#resumenTotalGastos').text(dt.resumen.totalGastos + ' €');
                    $(html).appendTo("#cuerpotabla");
                }
            );
        }
    });
});


