import React from "react";

function VolunteerCard(props){
    return (
        <div className={props.className}>
          <img src={props.image} alt={props.title}/>
          <h2>{props.name}</h2>
          <p>{props.description}</p>
        </div>
        
      );


}
export default VolunteerCard;