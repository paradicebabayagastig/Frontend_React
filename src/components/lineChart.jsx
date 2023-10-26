import { Box, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import axios from "axios";

const LineChart = ({date}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data,setData] = useState([])
  
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
    // async function fetchData(){
    //     try {
    //       const { startDate, endDate } = getMonthStartAndEndDates(date);
          
    //       console.log('points : ',orderItem)
    //       console.log('stats', pertes)
    //       setData(stats)
    //     }
    //     catch (error) {
    //       console.log(error)
    //     }
    //   }
    //   useEffect(()=>{
    //     fetchData()
    //   },[date])


  return (
  
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
