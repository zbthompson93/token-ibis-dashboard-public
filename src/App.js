import React, { Component } from 'react';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import ibisLogo from './images/ibis-logo-large.png'
import TopTenOrganizations from './TopTenOrganizations/TopTenOrganizations.js'
import DonationsPieChart from './DonationsPieChart/DonationsPieChart.js'
import DonationTrends from './DonationTrends/DonationTrends.js'
import WeeklyDonations from './WeeklyDonations/WeeklyDonations.js'
//import TrendingNews from './TrendingNews/TrendingNews.js'
import axios from "axios";

const config = require('./config.json');

class App extends Component {
    state = { authenticated: true };

    // componentDidMount() {
    //  	axios('/ibis/login-pass/', {
    //  	    method: 'post',
    //  	    withCredentials: true,
    //  	    data: {
    //      		username: config.ibis.username,
    //      		password: config.ibis.password,
    //  	    },
    //  	}).then(response => {
    //  console.log(response.data)
    //  	    this.setState({ authenticated: !!response.data.user_id });
    //  	}).catch(error => {
    //  	    console.log(error);
    //  	    this.setState({ authenticated: false });
    //  	})
    //  }


    render() {
    	let { authenticated } = this.state;

    	switch (authenticated) {
    	    case null:
    		return ('Loading...')
    	    case false:
    		return ('Could not authenticate')
    	    case true:

  		return (
  		    <div>
  		      <div className="nav-bar">
        			<div><img src={ibisLogo} id="ibis-logo" /></div>
        			<div className="nav-bar-title">Token Ibis Data Dashboard</div>
  		      </div>
  		      <Row className="graphs">z
        			<Col><TopTenOrganizations /></Col>
        			<Col><DonationsPieChart /></Col>
  		      </Row>
            <Row>
              <Col><DonationTrends /></Col>
              <Col><WeeklyDonations /></Col>  			
            </Row>
  		      {/*<div className="news">
  			       <TrendingNews />
  		      </div>*/}
  		    </div>
  		);
  		return ('Loading...')
  	}
  }
}

export default App;
