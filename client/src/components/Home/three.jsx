import React from "react";
import Card from "./card";
import food from "./images/foodpoverty.jpeg";
import water from "./images/waterpoverty.jpeg";
import education from "./images/educationpoverty.jpeg";
import { useNavigate } from 'react-router-dom';


function SectionThree({ loggedIn }){
    const navigate = useNavigate();
    return <>
        <div className="three">
        <p><strong></strong></p>
        <h1>OUR RECENT CAUSES</h1>
        </div>
        <div className="threecards">
        <Card 
            className="cardthree"
            image={food}
            category="FOOD"
            title="Feeding Families Foundation" 
        />
        <Card 
            className="cardthree"
            image={water}
            category="WATER"
            title="Clean Water Initiative" 
        />
        <Card 
            className="cardthree"
            image={education}
            category="EDUCATION"
            title="Bright Futures Education" 
        />
        </div>
        <button className="button3" onClick={() => loggedIn ? navigate('/charities') : navigate('/loginUser')}>EXPLORE ALL</button>
    </>


}
export default SectionThree;