import React from "react";
import {Helmet} from "react-helmet";

function SecondSection() {
    return (
      <div className="second">
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Helmet>
        <div className="firsthead">
          <h2>OUR FEATURES</h2>
        </div>
        <div className="circle"></div>
        <div className="circle2"></div>
        <div id="secondhead">
          <h1>You can make a difference by a charity</h1>
          <h1 style={{ marginLeft: '150px' }}>you care about</h1>
          <h1>Your donation can help to change lives</h1>
        </div>
  
        <div className="cards1">
          <div className="card">
            <div className="card1head">
              <span className="material-symbols-outlined" style={{fontSize:'50px'}}> blind </span>
  
              <h3>Direct Help</h3>
            </div>
  
            <div className="contentofcard">
              <p>
                Charity empower people to make a difference <br />
                even if it is just in a small way.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(223, 198, 164)',
                fontSize:'50px'}}
              >
                info
              </span>
  
              <h3>Giving Infomation</h3>
            </div>
  
            <div className="contentofcard">
              <p>
                People who are passionate about a cause are the<br />
                one who can make the most difference.
              </p>
            </div>
          </div>
        </div>
  
        <div className="cards2">
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(64, 115, 192)',
                fontSize:'50px'}}
              >
                bring_your_own_ip
              </span>
  
              <h3>Raising Awareness</h3>
            </div>
  
            <div className="contentofcard">
              <p>
                Your voice and your actions matters,and you<br />
                can make a difference in the world.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(76, 223, 108)', 
                fontSize:'50px' }}
              >
                potted_plant
              </span>
  
              <h3>Reilieving Poverty</h3>
            </div>
  
            <div className="contentofcard">
              <p>
                Your voice and your action matters and <br />
                you can make a difference in the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default SecondSection;