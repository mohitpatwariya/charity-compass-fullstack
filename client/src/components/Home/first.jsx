import React from "react";
import Navbar from "./navbar";
import post from "../images/post.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

function FirstSection({ loggedIn, setLoggedIn, loading, setLoading }) {
  const navigate = useNavigate();
    return (
      <div className="first">
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} loading={loading} setLoading={setLoading}/>
        <div className="firsttext">
          <h1 id="heading">Offering aid to the less fortunate</h1>
          <p id="text2">
            it is about giving back to the community, and<br />making the world a
            better place
          </p>
          <button className="firstbutton" style={{ verticalAlign: 'middle' }}>
            <span onClick={() => {
              if(loggedIn) {
                navigate('/charities');
              } else {
                navigate('/registerUser');
              }
            }}>SUPPORT A CAUSE</span>
          </button>
        </div>
        <div className="circularcharity">
          <img src={post} alt="charity" />
        </div>
      </div>
    );
  }

export default FirstSection;