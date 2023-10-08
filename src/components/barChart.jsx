import React from 'react';
import { Bar,Line } from 'react-chartjs-2'
import {Chart as chartjs} from 'chart.js/auto'
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
const BarChart = ()=>{

    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    const yValues = [55, 49, 44, 24, 15];
    const barColors = ["red", "green","blue","orange","brown"];
    const myChart = {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: colors.primary[400],
            borderColor:"black",
            borderWidth:2,
            data: yValues
          }]
        },
        options: {
          legend: {display: true},
          title: {
            display: true,
            text: "World Wine Production 2018"
          }
        }
      };
    return (
        <Bar data={myChart.data} options={myChart.options}/>
    );
}

export default BarChart;