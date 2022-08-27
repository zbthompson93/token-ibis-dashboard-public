import React from 'react';
import '../App.css';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


const GetPostsInfo = gql`
{
  allPosts {
    edges {
        node {
          id
          title
          created
          description
          likeCount
          user {
    		    id
    		    name
    		    username
    		    avatar
    		    person {
      			     id
      		  }
      		}
        }
      }
    }
}`


function TrendingPosts() {
  const { data, loading, error } = useQuery(GetPostsInfo);

  if (loading){
    console.log("Loading...");
    return <p></p>;
  }
  if (error){
    console.log(error);
    return <p>Error</p>;
  }

  let postsData = data.allPosts.edges;

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
  let allPostsObj = {};

  for(let m = 0; m < postsData.length; m++){
    let id = postsData[m].node.id;
    let likeCount = postsData[m].node.likeCount;

    let date = new Date(postsData[m].node.created);
    let fullDate = monthObj[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

    likesObj[id] = likeCount;
    allPostsObj[id] = {
      title: postsData[m].node.title,
      username: postsData[m].node.user.username,
      avatar: postsData[m].node.user.avatar,
      created: fullDate,
      likeCount: postsData[m].node.likeCount,
      description: postsData[m].node.description
    }
  }


  let postList = [];

  const entries = Object.entries(likesObj);

  var topLikes = [...entries].sort((a,b) => b[1]-a[1]).slice(0,10);

  for(let k = 0; k < topLikes.length; k++){
    let topLikesId = topLikes[k][0];
    let topPostsObj = allPostsObj[topLikesId];
    postList.push(topPostsObj);
  }

  var posts = postList
      .map(function(postObj, i) {
        return (
          <div key={i}>
            <div>
              <img src={postObj.avatar} className="user-img" />
              <p className="post-title">{postObj.title}</p>
              <p className="post-content"><span>@{postObj.username} - </span><span>{postObj.created} - </span><span className="like-count">{postObj.likeCount} likes</span></p>
            </div>
            <p className="post-content">
              {postObj.description}
            </p>
            <hr />
          </div>
        );
      });


  return(
    <div className="posts0">
      <div className="post-header">
        <h2>Trending Posts</h2>
      </div>
      {posts}
    </div>
  );

}

export default TrendingPosts;
