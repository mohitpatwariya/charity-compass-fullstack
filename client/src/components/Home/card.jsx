import React from "react";

const Card = (props) => {
  return (
    <div className={props.className}>
      <img src={props.image} alt={props.title}/>
      <h3>{props.title}</h3>
      <div className="para">
      <p>{props.category}</p>
      </div>
      <button>Make a Donation</button>
    </div>
  );
}

export default Card;