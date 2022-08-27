import React from 'react';
import '../App.css';
import loadingGif from '../images/loading.gif'
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Accordion, AccordionItem } from 'react-sanfona';


const GetNewsInfo = gql`
{
  allNews {
    edges {
        node {
          id
          title
          image
          description
          created
          likeCount
          user {
    		    id
    		    name
    		    username
    		    avatar
      		}
        }
      }
    }
}`

// nonprofit {
//      id
//      category {
//        id
//      }
// }


function TrendingNews() {
  const { data, loading, error } = useQuery(GetNewsInfo);

  if (loading){
    return(
      <div>
        <div className="news-header">
          <h2>Trending News</h2>
          <img src={loadingGif} id="loading-gif"/>
        </div>
      </div>
    )
  }
  if (error){
    console.log(error);
    return <p>Error</p>;
  }

  let newsData = data.allNews.edges;

  const monthObj = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  }

  let likesObj = {};
  // let allNewsObj = {};

  let newsList = [];

  //for(let m = 0; m < newsData.length; m++){
  for(let m = 0; m < 15; m++){
    let id = newsData[m].node.id;
    let likeCount = newsData[m].node.likeCount;

    let date = new Date(newsData[m].node.created);
    let fullDate = monthObj[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

    let allNewsObj = {};

    likesObj[id] = likeCount;
    //allNewsObj[id] = {
    allNewsObj = {
      title: newsData[m].node.title,
      image: newsData[m].node.image,
      username: newsData[m].node.user.username,
      avatar: newsData[m].node.user.avatar,
      created: fullDate,
      likeCount: newsData[m].node.likeCount,
      description: newsData[m].node.description
    }

    newsList.push(allNewsObj);
  }


  // let newsList = [];
  //
  // const entries = Object.entries(likesObj);
  //
  // var topLikes = [...entries].sort((a,b) => b[1]-a[1]).slice(0,10);
  //
  // for(let k = 0; k < topLikes.length; k++){
  //   let topLikesId = topLikes[k][0];
  //   let topNewsObj = allNewsObj[topLikesId];
  //   newsList.push(topNewsObj);
  // }

  var news = newsList
      .map(function(newsObj, i) {
        let backgroundImg = {
          backgroundImage: 'url(' + newsObj.image + ')',
          height: '300px'
        };
        let paddingStyle = {
          paddingLeft: '5px'
        }
        return (
          <AccordionItem key={i} title={newsObj.title}>
            <div key={i} style={paddingStyle}>
              <Row>
                <Col xs={2}><img src={newsObj.avatar} className="user-img" /></Col>
                <Col className="news-info">
                  <p>
                    <span>@{newsObj.username} - </span>
                    <span>{newsObj.created} - </span>
                    <span className="like-count">{newsObj.likeCount} likes</span>
                  </p>
                </Col>
              </Row>
              <div className="MuiCardMedia-root" style={backgroundImg}></div>
              <p className="news-content">
                {newsObj.description}
              </p>
            </div>
          </AccordionItem>
        );
      });


  return(
    <div className="news-container">
      <div className="news-header">
        <h2>Trending News</h2>
      </div>
      <Accordion allowMultiple={true}>
        {news}
      </Accordion>
    </div>
  );

}

export default TrendingNews;

//<img src={newsObj.image} className="news-img" /><p className="news-title">{newsObj.title}</p>
//(first: 15, orderBy: "-created")
