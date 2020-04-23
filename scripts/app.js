var datasource;
var myChart;

jQuery(document).ready(function() {

    getData();

    jQuery('#vmap').vectorMap(
        { 
            map: 'world_en',
            backgroundColor: 'linear-gradient(90deg, rgba(5,20,36,1) 0%, rgba(5,29,51,1) 50%, rgba(5,16,34,1) 100%)',
            color: '#042f4f',
            hoverOpacity: 0.7,
            selectedColor: '#4bb2e7',
            showTooltip: true,
            scaleColors: ['#042f4f', '#0c4e7e'],
            normalizeFunction: 'polynomial',
            onRegionClick: function(element, code, region)
            {
                var result;
                if(region == "Myanmar"){
                    result = datasource["Burma"];
                }
                else{
                    result = datasource[region];
                }

                showData(region, result)

            }
        }
    );
});

function getData() {
    
    $.ajax({
        url: "https://pomber.github.io/covid19/timeseries.json", 
        beforeSend: function(){

            $("#status").text("Loading ....")
            console.log("Loading");

        },
        success: function(result){
        
            datasource = result;
            console.log("Ready")
            $("#status").text("COVID - 19 Dashboard")

            //Show initial data
            showData("Myanmar", datasource["Burma"])

        }
    });
}

function showData(region, result){
    //Show detail list
    $("#right_table").empty();
    for(var v = result.length - 1; v>=0; v--){

        $("#right_table").append("<tr>"
            + "<td>"+result[v].date+"</td>"
            + "<td>"+result[v].confirmed+"</td>"
            + "<td>"+result[v].deaths+"</td>"
            + "<td>"+result[v].recovered+"</td>"
            + "</tr>");

    }

    //Show latest record only
    showLatest(region, result[result.length - 1]);

    //show chart
    showChart(result);
}

function showLatest(country, obj) {
    
    $("#country").text(country)
    $("#confirmed").text(obj.confirmed)
    $("#deaths").text(obj.deaths)
    $("#recovered").text(obj.recovered)
    $("#date").text(country + " - " +obj.date)

}

function showChart(data){

    if (myChart) {
        myChart.destroy();
    }

    console.log(data)
    var dates = [];
    var deaths = [];
    var confirms = [];
    var recovers = [];
    var dataset = [];
    

    for(var v = 0; v<data.length; v++){
        dates.push(data[v].date);
        deaths.push(data[v].deaths)
        confirms.push(data[v].confirmed)
        recovers.push(data[v].recovered)
    }

    dataset = [
                {
                    label: 'Confirmed',
                    data: confirms,
                    borderColor: [
                        'rgba(236,156,63,1)',
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Deaths',
                    data: deaths,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Recovered',
                    data: recovers,
                    borderColor: [
                        'rgba(75,178,231,1)',
                    ],
                    borderWidth: 1
                }
            ];


    var ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: dataset
        },
    });

}