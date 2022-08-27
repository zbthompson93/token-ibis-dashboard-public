import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import loadingGif from '../images/loading.gif'
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label
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


function DonationTrends() {
  let [search, setSearch] = useState("Token Ibis");
  let [month, setMonth] = useState(currentMonth);
  let [date, setDate] = useState(currentMonth + ":" + currentFullYear);

  let GetDonationInfo = gql`
  {
    allDonations(search: "${search}", orderBy: "-created") {
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
      allOrganizations {
        edges {
          node {
            id
            name
          }
        }
      }
  }`

  const { data, loading, error } = useQuery(GetDonationInfo);

  if (loading){
    return(
      <div>
        <h3 className="chart-title">Nonprofit Donation Trends</h3>
        <img src={loadingGif} id="loading-gif"/>
      </div>
    )
  }
  if (error){
    return <p>Error</p>;
  }

  let donationsList = data.allDonations.edges;

  let graphData = [];

  let dateList = date.split(":");

  let originList = origin.split(":");

  let stop = false;

  let monthCount = originList[0];
  let yearCount = originList[1];

  let firstEntry = monthObj[monthCount].name + " " + yearCount;
  graphData.push({month: firstEntry, ibis: 0})

  while(stop === false){
    monthCount++;

    let entry = monthObj[monthCount].name + " " + yearCount;
    graphData.push({month: entry, ibis: 0})
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
    let currentAmount = graphData[index]['ibis'];
    graphData[index]['ibis'] = Math.round(currentAmount + amount);
  }

  //console.log(graphData)

  let organizationsList = data.allOrganizations.edges;

  let dropdownEntries = []

  for(let j = 0; j < organizationsList.length; j++){
    let name = organizationsList[j].node.name;
    dropdownEntries.push(name)
  }

  var options = dropdownEntries
      .map(function(organizationName) {
        return (
          <option value={organizationName}>{organizationName}</option>
        );
      });



  return (
    <div style={{marginLeft:"20px"}}>
      <h3 className="chart-title">Nonprofit Donation Trends</h3>

      <Row>
        <Col>
          <div className="form-group">
            <label>Organization:</label>
            <select className="form-control" id="sel1" value={search} onChange={e=> setSearch(e.target.value)}>
              {options}
            </select>
          </div>
        </Col>
      </Row>

      <AreaChart
        width={800}
        height={400}
        data={graphData}
        margin={{
          top: 10, right: 30, left: 0, bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label value="Month" offset={5} position="bottom" />
        </XAxis>
        <YAxis label={{ value: "Dollars Donated", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Area type="monotone" dataKey="ibis" stroke="#84AB3F" fill="#414042" />
      </AreaChart>
    </div>
  );
}

export default DonationTrends;
