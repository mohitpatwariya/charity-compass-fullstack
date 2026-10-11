import React from "react";
import VolunteerCard from "./volunteerCard";

import rupesh from '../Home/images/rupesh.jpeg';

function SectionSix() {
  return (
    <div className="six">
      <h3>CONTRIBUTORS</h3>
      <h1>OUR CONTRIBUTORS</h1>
      <div className="sixcards">
        <VolunteerCard
          className="cardsix"
          image={rupesh}
          name="Rupesh Patel"
          description="Contributor"
        />
      </div>
      <h4>for expanding</h4>
    </div>
  );
}
export default SectionSix;
