(function() {
    var elemento = document.getElementById("myChart");
    var elementoDos = document.getElementById("graficoDos");

    const url = "http://localhost:3005/api/data/";

    if (elementoDos && elemento) {
        var ctxIngreso = elementoDos.getContext("2d");
        var ctxGasto = elemento.getContext("2d");
        var ano = $("#myChart").data("ano");

        fetch(url + ano)
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);

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

                var ingresoChart = new Chart(ctxIngreso, {
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

                var gastoChart = new Chart(ctxGasto, {
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
    }
})();
