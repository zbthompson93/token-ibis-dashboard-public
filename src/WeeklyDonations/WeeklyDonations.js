import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import loadingGif from '../images/loading.gif'
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const monthObj = {
  0: {name: "January", days: 31},
  1: {name: "February", days: 28},
  2: {name: "March", days: 31},
  3: {name: "April", days: 30},
  4: {name: "May", days: 31},
  5: {name: "June", days: 30},
  6: {name: "July", days: 31},
  7: {name: "August", days: 31},
  8: {name: "September", days: 30},
  9: {name: "October", days: 31},
  10: {name: "November", days: 30},
  11: {name: "December", days: 31}
}

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getYear();
let currentFullYear = currentDate.getFullYear();

const origin = "0:2020";


const GetDonationInfo = gql`
{
  allDonations {
    edges {
        node {
          id
          amount
          description
          created
          likeCount
          target {
              id
              name
              category {
                id
              }
          }
        }
      }
    }
}`

function WeeklyDonations() {
  let [date, setDate] = useState(currentMonth + ":" + currentFullYear);

  const { data, loading, error } = useQuery(GetDonationInfo);

  if (loading){
    return(
      <div>
        <h3 className="chart-title">Token Ibis Donation Trend</h3>
        <img src={loadingGif} id="loading-gif"/>
      </div>
    )
  }
  if (error){
    return <p>Error</p>;
  }

  let donationsList = data.allDonations.edges;

  const graphData = [];

  let originList = origin.split(":");

  let stop = false;

  let monthCount = originList[0];
  let yearCount = originList[1];

  let firstEntry = monthObj[monthCount].name + " " + yearCount;
  graphData.push({month: firstEntry, Target: 2000, Amount: 0})

  while(stop === false){
    monthCount++;

    let entry = monthObj[monthCount].name + " " + yearCount;
    graphData.push({month: entry, Target: 2000, Amount: 0})
    if(monthCount === currentMonth && yearCount === currentFullYear){
      stop = true;
    }
    if(monthCount === 11){
      monthCount = -1;
      yearCount++;
    }
  }

  for(let i = 0; i < donationsList.length; i++){
    let created = donationsList[i].node.created;
    let donationDate = new Date(created);
    let donationMonth = donationDate.getMonth();
    let donationYear = donationDate.getFullYear();
    let amount = donationsList[i].node.amount;
    amount = amount/100;

    let monthYear = monthObj[donationMonth].name + " " + donationYear;

    let obj = graphData.filter(e => e.month == monthYear);
    let index = graphData.findIndex(e => e.month == monthYear);
    let currentAmount = graphData[index]['Amount'];
    graphData[index]['Amount'] = Math.round(currentAmount + amount);
  }

  return (
    <div>
      <h3 className="chart-title">Token Ibis Donation Trend</h3>

      <LineChart
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "Dollars", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Amount" stroke="#84AB3F" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Target" stroke="#414042" />
      </LineChart>
    </div>
  );
}

export default WeeklyDonations;
