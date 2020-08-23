import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
  
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

const casesTypeColors = {
    cases: {
        hex: '#0000FF',
        rgb: "rgb(0, 0, 255)",
        half_op: "rgb(0, 0, 255,0.5)",
        multiplier: 800
    },
    recovered: {
        hex: '#7dd71d',
        rgb: "rgb(125, 215, 29)",
        half_op: "rgb(125,215,29,0.5)",
        multiplier: 1200
    },
    deaths: {
        hex: '#fb4443',
        rgb: "rgb(251, 68, 67)",
        half_op: "rgb(251, 68, 67,0.5)",
        multiplier: 2000
    }
}

function LineGraph({ casesType='cases'}) {

    const [data, setData] = useState({})

    const buildChartData = (data) => {
        const chartData = []
        let lastDataPoint;
    
        for (let date in data.cases) {
            if(lastDataPoint){
                const newDatapoint ={
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDatapoint)
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData
    }

    useEffect(() => {
        
        const fetchData = async() => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(data => {
                    const chartData = buildChartData(data)
                    setData(chartData)
                })
            }
        fetchData()    
    }, [casesType])

    return (
        <div>
            {
                data?.length > 0 && (
                    <Line 
                        options={options}
                        data={{
                            datasets:[{
                                borderColor: casesTypeColors[casesType].hex,
                                backgroundColor: casesTypeColors[casesType].half_op,
                                data: data,
                            }]
                        }}    
                    />
                )
            }
            
        </div>
    )
}

export default LineGraph
