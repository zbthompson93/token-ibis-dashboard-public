import React from 'react';
import '../App.css';
import loadingGif from '../images/loading.gif'
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList
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
let monthTitle = monthObj[currentMonth].name;

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


function TopTenOrganizations() {
  const { data, loading, error } = useQuery(GetDonationInfo);

  if (loading){
    return(
      <div>
        <h3 className="chart-title">Top 10 Organizations of {monthTitle}</h3>
        <img src={loadingGif} id="loading-gif"/>
      </div>
    )
  }
  if (error){
    return <p>Error</p>;
  }

  let organizationObj = {};

  let donationsList = data.allDonations.edges;

  let filteredDonationsList = []

  for(let i = 0; i < donationsList.length; i++){
    let created = donationsList[i].node.created;
    let donationDate = new Date(created);
    let donationDay = donationDate.getDate();
    let donationMonth = donationDate.getMonth();
    let donationYear = donationDate.getFullYear();
    if(donationMonth == currentMonth && donationYear == currentFullYear){
      let name = donationsList[i].node.target.name;
      let amount = donationsList[i].node.amount;
      amount = amount/100;

      if(organizationObj[name] === undefined){
        organizationObj[name] = amount;
      } else{
        organizationObj[name] += amount;
      }
    }
  }


  let graphDataUnsorted = [];

  const entries = Object.entries(organizationObj);

  const amountsList = Object.values(organizationObj);

  var topAmounts = [...amountsList].sort((a,b) => b-a).slice(0,10);


  for(let j = 0; j < entries.length; j++){
    let entriesName = entries[j][0];
    let entriesAmount = entries[j][1];
    for(let m = 0; m < topAmounts.length; m++){
      if(entriesAmount == topAmounts[m]){
        let obj = {
          Nonprofit: entriesName,
          Dollars: Math.round(entriesAmount)
        }
        graphDataUnsorted.push(obj);
        break;
      }
    }
  }

  const graphData = [...graphDataUnsorted].sort((a,b) => (b.Dollars - a.Dollars))


  const COLORS = ['#414042', '#84AB3F','#2F4F4F', '#006400','#C0C0C0', '#20B2AA','#000000', '#32CD32', '#000', '#111'];

  return (
    <div>
      <h3 className="chart-title">Top 10 Organizations of {monthTitle}</h3>

      <BarChart
        width={800}
        height={370}
        data={graphData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="Nonprofit" hide={false}>
          <Label value="Organization" offset={5} position="bottom" />
        </XAxis>
        <YAxis height={600} label={{ value: 'Donations', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="Dollars" fill="#84AB3F" barSize={50}>

        </Bar>
      </BarChart>
    </div>
  );
}

export default TopTenOrganizations;

//<LabelList dataKey="Dollars" position="top" />
