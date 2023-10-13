import { Box, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import axios from "axios";

const BarChart = ({date}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataStat,setDataStat] = useState([])
  
    const getMonthStartAndEndDates = (date) => {
        // Split the date string into year and month parts
        const [year, month] = date.split('-').map(Number);
      
        // Calculate the last day of the month
        const lastDay = new Date(year, month, 0).getDate();
      
        // Format the month and day as two digits
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedLastDay = lastDay < 10 ? `0${lastDay}` : `${lastDay}`;
      
        // Construct the start and end dates
        const startDate = `${year}-${formattedMonth}-01`;
        const endDate = `${year}-${formattedMonth}-${formattedLastDay}`;
      
        return { startDate, endDate };
      };
    async function fetchData(){
        try {
          const { startDate, endDate } = getMonthStartAndEndDates(date);
          const pointVentes = await axios.get('http://localhost:3000/api/v1/pointsVentes',{
            withCredentials:true,
            headers: {
              'Content-Type': 'application/json', 
            }
          })
          const stats = await Promise.all(pointVentes.data.map(async (point) => {
            const orderItem = await axios.get(`http://localhost:3000/api/v1/stats/orders/?startDate=${startDate}&endDate=${endDate}&pointVenteId=${point.idPointVente}`,{
              withCredentials:true,
              headers: {
                'Content-Type': 'application/json', 
              }
            })
            const stat = {
              index:point.nomPointVente,
              "P. commandé": orderItem.data
            }
            return stat
          }))
          console.log('points : ',pointVentes.data)
          console.log('stats', stats)
          setDataStat(stats)
        }
        catch (error) {
          console.log(error)
        }
      }
      useEffect(()=>{
        fetchData()
      },[date])


  return (
  
    <ResponsiveBar
      tooltip={(bar) => {
        const boxStyle = {
            width: '12px', // Set the width of the color box
            height: '12px', // Set the height of the color box
            backgroundColor: bar.color  , // Set the color based on the bar color
            display: 'inline-block', // Display the box inline with the text
            marginTop: '3px',
            marginLeft: '2px',
            // marginRight: '4px', // Add some spacing between the box and text
            borderRadius: '50%'
          };
        return (
            <Box
              sx={{
                gap:0.25,
                display:'flex',
                justifyContent:"center",
                backgroundColor: colors.primary[400], // Set your background color
                color: colors.primary[100], // Set your text color
                border: `1px solid ${colors.primary[400]}`, // Set your border style
                padding: '12px', // Adjust padding as needed
                borderRadius: '4px', // Add rounded corners
              }}
            >
              {/* Customize the tooltip content */}
              
              
              <div>{bar.value}</div>
              <div style={boxStyle}></div>
            </Box>
          );
      }}
      data={dataStat}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.pinkAccent[400],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.pinkAccent[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["P. commandé", "P. fabriqués", "P. perdus"]}
      indexBy="index"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "quantités", // changed
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
