import { Box, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { AuthContext } from "../contexts/Auth";
import { mockBarData as data } from "../data/mockData";
import { useEffect, useState ,useContext} from "react";
import axios from "axios";

const BarChart = ({date}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataStat,setDataStat] = useState([])
    const authCtx = useContext(AuthContext)
    const token = authCtx.isAuthenticated;
  
    const getMonthStartAndMiddleDates = (date) => {
      const [year, month] = date.split('-').map(Number);
    
      // Calculate the last day of the month
      const lastDay = new Date(year, month, 0).getDate();
    
      // Calculate the middle day of the month
      const middleDay = Math.ceil(lastDay / 2);
    
      // Format the month, middle day, and last day as two digits
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedMiddleDay = middleDay < 10 ? `0${middleDay}` : `${middleDay}`;
      const formattedLastDay = lastDay < 10 ? `0${lastDay}` : `${lastDay}`;
    
      // Construct the start and middle dates
      const startDate = `${year}-${formattedMonth}-01`;
      const middleDate = `${year}-${formattedMonth}-${formattedMiddleDay}`;
      const endDate = `${year}-${formattedMonth}-${formattedLastDay}`;
    
      return { startDate, middleDate, endDate };
    };
    
  
    async function fetchData() {
      try {
        const { startDate, middleDate, endDate } = getMonthStartAndMiddleDates(date);
    
        const pointVentes = await axios.get('http://localhost:3000/api/v1/pointsVentes', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
          }
        });
    
        const stats = await Promise.all(pointVentes.data.map(async (point) => {
          const firstHalfEndDate = middleDate; 
          const secondHalfStartDate = endDate;
    
          const orderItemFirstHalf = await axios.get(`http://localhost:3000/api/v1/stats/real-consumption/?startDate=${startDate}&endDate=${firstHalfEndDate}&pointVenteId=${point.idPointVente}`);
          const orderItemSecondHalf = await axios.get(`http://localhost:3000/api/v1/stats/real-consumption/?startDate=${firstHalfEndDate}&endDate=${endDate}&pointVenteId=${point.idPointVente}`);

          const stat = {
            index: point.nomPointVente,
            "consommation-réel-first-half": orderItemFirstHalf.data,
            "consommation-réel-second-half": orderItemSecondHalf.data,
          };
          
    console.log('stat' , stat)
          return stat;
        }));
    
        console.log("stat", stats, "start date ", middleDate, "end date ", endDate);
        setDataStat(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    
useEffect(() => {
    fetchData();
  }, [date]);


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
      keys={["consommation-réel-first-half", "consommation-réel-second-half"]}

      indexBy="index"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      // colors={{ scheme: "nivo" }}
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