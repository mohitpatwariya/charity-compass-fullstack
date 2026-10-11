import React from "react";
import { useNavigate } from 'react-router-dom';

function FiveSection({loggedIn}) {
  const navigate = useNavigate();
    return (
      <div className="five">
        <p className="fivehead"><strong>OUR SERVICES</strong></p>
        <h1>Services We Provide</h1>
        <div className="cardFive">
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(196, 132, 83)',
                fontSize:'50px' }}
              >
                menu_book
              </span>
              <h3>Education</h3>
            </div>
            <hr />
            <div className="contentofcard">
              <p>
              Empower minds, transform lives: donate to education and unlock boundless potential
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(208, 190, 125)', fontSize:'50px' }}
              >
                lunch_dining
              </span>
  
              <h3>Food</h3>
            </div>
            <hr />
  
            <div className="contentofcard">
              <p>
              Nourish bodies, feed souls: donate to food aid and cultivate a hunger-free world
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card1head">
              <span
                className="material-symbols-outlined"
                style={{ color: 'rgb(128, 186, 238)', 
                fontSize:'50px' }}
              >
                water_drop
              </span>
  
              <h3>Water</h3>
            </div>
            <hr />
  
            <div className="contentofcard">
              <p>
              Ignite minds, shape futures: donate to education and light the path to knowledge for all
              </p>
            </div>
          </div>
        </div>
        <button id="button5" onClick={() => loggedIn ? navigate('charities') : navigate('loginUser')}>EXPLORE ALL</button>
      </div>
    );
  }

  export default FiveSection;