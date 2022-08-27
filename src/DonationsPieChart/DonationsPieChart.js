import React from 'react';
import '../App.css';
import loadingGif from '../images/loading.gif'
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import {
  PieChart, Pie, Sector, Cell, Legend
} from 'recharts';

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
    allOrganizationCategories {
      edges {
        node {
          id
          title
        }
      }
    }
}`

const GetOrganizationCategories = gql`
{
  allOrganizationCategories {
    edges {
      node {
        id
        title
      }
    }
  }
}`


function DonationsPieChart() {
  const { categoryData } = useQuery(GetOrganizationCategories)

  const { data, loading, error } = useQuery(GetDonationInfo);

  if (loading){
    return(
      <div id="donations-pie-chart">
        <h3 className="chart-title">Donations by Category</h3>
        <img src={loadingGif} id="loading-gif"/>
      </div>
    )
  }
  if (error){
    console.log(error);
    return <p>Error</p>;
  }

  let categoriesList = data.allOrganizationCategories.edges;
  let categoryNameObj = {};
  for(let m = 0; m < categoriesList.length; m++){
    let categoryId = categoriesList[m].node.id;
    let categoryName = categoriesList[m].node.title;

    categoryNameObj[categoryId] = categoryName;
  }

  let donationObj = {};
  let totalDonationAmount = 0;

  let donationsList = data.allDonations.edges;

  for(let i = 0; i < donationsList.length; i++){
    let name = donationsList[i].node.target.name;
    let amount = donationsList[i].node.amount;
    amount = amount/100;

    let categoryId = donationsList[i].node.target.category.id;
    let categoryName = categoryNameObj[categoryId];

    if(donationObj[categoryName] === undefined){
      donationObj[categoryName] = amount;
    } else{
      donationObj[categoryName] += amount;
    }

    totalDonationAmount += amount;
  }

  const graphData = [];

  const entries = Object.entries(donationObj);

  for(let j = 0; j < entries.length; j++){
    let entriesName = entries[j][0];
    let entriesValue = entries[j][1];

    let obj = {
      name: entriesName,
      value: entriesValue
    }
    graphData.push(obj);
  }

  const COLORS = ['#414042', '#84AB3F','#2F4F4F', '#006400','#C0C0C0', '#20B2AA','#000000', '#32CD32'];


  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
   	const radiusX = innerRadius + (outerRadius - innerRadius) * 0.6;
    const radiusY = innerRadius + (outerRadius - innerRadius) * 0.8;
    const x = cx + radiusX * Math.cos(-midAngle * RADIAN);
    const y = cy + radiusY * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
      	{`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div id="donations-pie-chart">
      <h3 className="chart-title">Donations by Category</h3>

      <PieChart width={500} height={300}>
        <Pie
          data={graphData}
          dataKey="value"
          cx={100}
          cy={100}
          outerRadius={100}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#414042"
          margin={{
            top: 20, right: 0, left: 0, bottom: 0,
          }}
        >
          {
            graphData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
        <Legend align='right' verticalAlign='top' layout='vertical' />
      </PieChart>
    </div>
  );
}

export default DonationsPieChart;
