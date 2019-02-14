(function() {
    var elementoDos = document.getElementById("graficoDos");
    var elemento = document.getElementById("myChart");

    function addData(chart, labels, data) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data
        chart.update();
    }
    

    const url = "/api/data/";
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    };

    if (elementoDos && elemento) {
        var ctxIngreso = elementoDos.getContext("2d");
        var ctxGasto = elemento.getContext("2d");
        var ano = $("#myChart").data("ano");
        var gastoChart;
        var ingresoChart;

        fetch(url + ano, options)
            .then(res => {
                return res.json();
            })
            .then(data => {
                //console.log(data);

                let labelsIngreso = [];
                let datasetIngreso = [];
                let labelsGasto = [];
                let datasetGasto = [];

                data.ingresoPorCategoria.forEach(doc => {
                    // Excluir ingreso remanente
                    if (doc._id.codigo !== "a.8") {
                        labelsIngreso.push(doc._id.nombre);
                        datasetIngreso.push(
                            parseFloat(doc.total.$numberDecimal)
                        );
                    }
                });

                data.gastoPorCategoria.forEach(doc => {
                    labelsGasto.push(doc._id.nombre);
                    datasetGasto.push(parseFloat(doc.total.$numberDecimal));
                });

                ingresoChart = new Chart(ctxIngreso, {
                    type: "doughnut",
                    data: {
                        labels: labelsIngreso,
                        datasets: [
                            {
                                label: "# of Votes",
                                backgroundColor: [
                                    "rgb(194, 225, 194)",
                                    "rgb(70, 177, 201)",
                                    "rgb(214, 40, 57)",
                                    "rgb(239, 226, 79)",
                                    "rgb(127, 5, 95)",
                                    "rgb(132, 216, 255)",
                                    "rgb(232, 85, 158)",
                                    "rgb(255, 224, 91)",
                                    "rgb(107, 232, 197)",
                                    "rgb(199, 85, 255)",
                                    "rgb(255, 159, 64)"
                                ],
                                borderColor: "rgb(255, 255, 255)",
                                data: datasetIngreso
                            }
                        ]
                    },
                    options: {
                        legend: {
                            display: false,
                            position: "top",
                            fullWidth: false,
                            labels: {
                                fontSize: 10
                            }
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        display: false,
                                        beginAtZero: true
                                    },
                                    gridLines: {
                                        display: false,
                                        drawOnChartArea: false,
                                        drawBorder: false
                                    }
                                }
                            ]
                        },
                        title: {
                            display: true,
                            text: "Ingresos por Categoria"
                        }
                    }
                });

                gastoChart = new Chart(ctxGasto, {
                    type: "doughnut",
                    data: {
                        labels: labelsGasto,
                        datasets: [
                            {
                                label: "# of Votes",
                                backgroundColor: [
                                    "rgb(132, 216, 255)",
                                    "rgb(232, 85, 158)",
                                    "rgb(255, 224, 91)",
                                    "rgb(107, 232, 197)",
                                    "rgb(199, 85, 255)",
                                    "rgb(255, 159, 64)",
                                    "rgb(194, 225, 194)",
                                    "rgb(70, 177, 201)",
                                    "rgb(214, 40, 57)",
                                    "rgb(239, 226, 79)",
                                    "rgb(127, 5, 95)"
                                ],
                                borderColor: "rgb(255, 255, 255)",
                                data: datasetGasto
                            }
                        ]
                    },
                    options: {
                        legend: {
                            display: false,
                            position: "top",
                            fullWidth: false,
                            labels: {
                                fontSize: 10
                            }
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        display: false,
                                        beginAtZero: true
                                    },
                                    gridLines: {
                                        display: false,
                                        drawOnChartArea: false,
                                        drawBorder: false
                                    }
                                }
                            ]
                        },
                        title: {
                            display: true,
                            text: "Gastos por Categoria"
                        }
                    }
                });
            });

        elemento.addEventListener("actualizado", function() {
            let nuevasLabelsGasto = [];
            let nuevosdatasetGasto = [];
            let nuevasLabelsIngreso = [];
            let nuevosdatasetIngreso = [];

            fetch(url + ano, options)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    //console.log(data);

                    data.gastoPorCategoria.forEach(doc => {
                        nuevasLabelsGasto.push(doc._id.nombre);
                        nuevosdatasetGasto.push(
                            parseFloat(doc.total.$numberDecimal)
                        );
                    });

                    data.ingresoPorCategoria.forEach(doc => {
                        if (doc._id.codigo !== "a.8") {
                            nuevasLabelsIngreso.push(doc._id.nombre);
                            nuevosdatasetIngreso.push(
                                parseFloat(doc.total.$numberDecimal)
                            );
                        }
                    });

                    addData(gastoChart, nuevasLabelsGasto, nuevosdatasetGasto);
                    addData(ingresoChart, nuevasLabelsIngreso, nuevosdatasetIngreso);

                    /*gastoChart.data.labels = nuevasLabelsGasto;
                    gastoChart.data.datasets[0].data = nuevosdatasetGasto;
                    gastoChart.update();*/
                });
        });
    }

    //var graficoAnoCanvas = $("#graficoAno2018");

    let canvasGraficos = $(".graficos-resumen");
    let anos = [];
    let graficos = [];

    for (let i = 0; i < canvasGraficos.length; i++) {
        anos.push(canvasGraficos[i].attributes["data-ano"].value);
    }

    if (true) {
        anos.forEach(ano => {
            var ctx = document
                .getElementById("graficoAno" + ano)
                .getContext("2d");
            //var ano = graficoAnoCanvas.data("ano");

            fetch(url + ano, options)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log(data);

                    let labelsAno = [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre"
                    ];
                    let datasetAnoIngreso = new Array(12).fill(0);
                    let datasetAnoGasto = new Array(12).fill(0);

                    data.ingresoPorMes.forEach(doc => {
                        datasetAnoIngreso[doc._id.mes - 1] = parseFloat(
                            doc.total.$numberDecimal
                        );
                    });

                    data.gastoPorMes.forEach(doc => {
                        datasetAnoGasto[doc._id.mes - 1] = parseFloat(
                            doc.total.$numberDecimal
                        );
                    });

                    var anoChart = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: labelsAno,
                            datasets: [
                                {
                                    label: "Ingresos",
                                    backgroundColor: "rgb(107, 232, 197)",
                                    stack: "Stack 0",
                                    data: datasetAnoIngreso
                                },
                                {
                                    label: "Gastos",
                                    backgroundColor: "rgb(214, 40, 57)",
                                    stack: "Stack 1",
                                    data: datasetAnoGasto
                                }
                            ]
                        },
                        options: {
                            title: {
                                display: true,
                                text: "Resumen Gastos/Ingresos Año " + ano
                            },
                            tooltips: {
                                mode: "index",
                                intersect: false
                            },
                            responsive: true,
                            scales: {
                                xAxes: [
                                    {
                                        stacked: true
                                    }
                                ],
                                yAxes: [
                                    {
                                        stacked: true
                                    }
                                ]
                            }
                        }
                    });
                    graficos.push(anoChart);
                });
        });
    }
})();
