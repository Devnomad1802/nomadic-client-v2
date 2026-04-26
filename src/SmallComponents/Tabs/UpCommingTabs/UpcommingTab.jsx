import * as React from "react";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import January from "./January";
import { Button } from "@mui/material";
import { useGetTripsQuery } from "../../../services/TripApis";
import { useState } from "react";
import { useEffect } from "react";

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 70, // Ensure sufficient width for centering
    [theme.breakpoints.up("sm")]: {
      minWidth: 70,
    },
    // paddingRight: theme.spacing(0),
    paddingTop: 0,
    paddingBottom: 0,
    margin: "0px 10px",
    color: "#111827",
    fontWeight: "500 !important",
    height: "20px",
    display: "flex", // Flex display to center text
    alignItems: "center", // Vertical centering
    justifyContent: "center", // Horizontal centering
    textAlign: "center",
    mx: "auto",
    border: "1px solid #E5E7EB",
    borderRadius: "32px",
    "& .MuiTab-wrapper": {
      height: "20px",
      border: "1px solid #E5E7EB",
      borderRadius: "32px",
    },
    "&:hover": {
      color: "#CD482A",
      opacity: 1,
      border: "1px solid #E5E7EB",
      borderRadius: "32px",
    },
    "&.Mui-selected": {
      color: "#fff",
      background: "#CD482A",

      opacity: 1,
      textAlign: "center",
      mx: "auto",
      display: "flex", // Flex display to center text
      alignItems: "center", // Vertical centering
      justifyContent: "center", // Horizontal centering
      borderRadius: "32px",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
      border: "1px solid #E5E7EB",
      borderRadius: "32px",
    },
  })
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UpcomingTab() {
  const { isError, isFetching, isLoading, data } = useGetTripsQuery();
  const [monthTrips, setMonthTrips] = useState();
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    if (data) {
      console.log("data", data);
      const parsedData = data.data.map((trip) => ({
        ...trip,
        selectDate: JSON.parse(trip.selectDate),
        ratings: JSON.parse(trip.ratings),
      }));

      const monthTripsObj = {
        All: [], // Create "All" entry for all trips
        January: [],
        February: [],
        March: [],
        April: [],
        May: [],
        June: [],
        July: [],
        August: [],
        September: [],
        October: [],
        November: [],
        December: [],
      };

      parsedData.forEach((trip) => {
        const firstDate = new Date(trip.selectDate[0].BatchDate);
        const month = firstDate.toLocaleString("default", { month: "long" });
        monthTripsObj[month].push(trip);
        monthTripsObj["All"].push(trip); // Add each trip to "All"
      });

      const sortedMonths = Object.keys(monthTripsObj).sort((a, b) =>
        a === "All" ? -1 : new Date(a + " 1, 2000") - new Date(b + " 1, 2000")
      );

      const sortedMonthTripsObj = {};
      sortedMonths.forEach((month) => {
        sortedMonthTripsObj[month] = monthTripsObj[month];
      });

      setMonthTrips(sortedMonthTripsObj);
    }
  }, [data]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", ml: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "md",
          mx: "auto",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons
          sx={{
            mx: "auto",
            [`& .${tabsClasses.scrollButtons}`]: {
              color: "#000",
              fontWeight:"500 !important",
              "&.Mui-disabled": { opacity: 0.3 },
            },
            "& .MuiTabs-indicator": {
              display: "none",
              height: "20px",
            },
          }}
        >
          {monthTrips &&
            Object.keys(monthTrips)
              .filter((month) => monthTrips[month].length > 0)
              .map((month, index) => (
                <AntTab
                  key={index}
                  label={month}
                  {...a11yProps(index)}
                  // sx={{
                  //   textAlign: "center",
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  // }}
                />
              ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          my: { xs: 2, md: 0 },
          py: { xs: 1, md: 1 },
          px: { xs: 1, md: 2 },
          ml: { xs: -2, md: 0 },
        }}
      >
        {isLoading ? (
          <h1 style={{ color: "#000" }}>Loading...</h1>
        ) : (
          <>
            {monthTrips &&
              Object.keys(monthTrips)
                .filter((month) => monthTrips[month].length > 0)
                .map((month, index) => (
                  <TabPanel key={index} value={value} index={index}>
                    {value === index && (
                      <January
                        activeMonth={monthTrips[month]}
                        viewAll={viewAll}
                        setViewAll={setViewAll}
                      />
                    )}
                  </TabPanel>
                ))}
          </>
        )}
      </Box>
      <Button
        onClick={() => {
          setViewAll(!viewAll);
        }}
        variant="simplebtn"
        sx={{
          mt: { xs: -3, sm: 0 },
          width: "199px",
          border: "1.5px solid #EC3F18",
          background: "transparent",
          color: "#EC3F18",
          "&:hover": {
            border: "1.5px solid #fff",
            background: "#393938",
          },
        }}
      >
        {!viewAll ? "View All" : "View Less"}
      </Button>
    </Box>
  );
}
