import React from "react";
import teamwork from "./images/teamwork.jpg";

function SectionFour() {
  return (
    <>
      <div className="maje">
        <div className="unitypic">
          <img src={teamwork} alt="unity" />
        </div>
        <div className="submaje">
          <h2 style={{ color: "#0891fa" }}>About us</h2>
          <h1
            style={{
                marginTop:"30px",
              color:"#542d2d",
              fontSize: "50px",
              fontFamily:
                "Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif",
              lineHeight:"65px",
              overflowY:"hidden"
            }}
          >
            Highest Form <br />Of Love
          </h1>
          <p>
          The best philosophy of charity is grounded in pragmatism, emphasizing efficacy and tangible impact above all else. This philosophy prioritizes the well-being and empowerment of those in need, seeking to address their immediate challenges while also fostering sustainable long-term solutions.
          </p>
          {/* <button id="button4">ABOUT US</button> */}
        </div>
      </div>
      <div className="subsubmaje"></div>
    </>
  );
}

export default SectionFour;