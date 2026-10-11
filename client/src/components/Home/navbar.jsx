import React from 'react';
import post from '../images/post.png'
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

function Navbar({ loggedIn, setLoggedIn, loading, setLoading }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  async function logoutHandler() {
    const logoutUrl = `${API_URL}/api/users/logout`;

    setLoading(true);
    const response = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    setLoading(false);
    console.log(result);

    if (result.success) {
        toast.success(
            result.message.trim() || "User logged out successfully"
        );
        //update the global login state
        setLoggedIn(false);
    } else {
        toast.error(result.message.trim() || "Something went wrong");
    }
}

  React.useEffect(() => {
   
    function handleLogoDisplay() {
      if (window.innerWidth > 580) {
        console.log('Logo not visible');
        setIsMobile(false);
      } else {
        console.log('Logo should be visible');
        setIsMobile(true);
      }
    }

    window.addEventListener('resize', handleLogoDisplay);
    handleLogoDisplay();

    return () => {
      window.removeEventListener('resize', handleLogoDisplay);
    };
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      const header = document.querySelector('nav');
      if (window.scrollY > 10) {
        header.style.backgroundColor = '#fff6ea';
      } else {
        header.style.backgroundColor = 'transparent';
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav id="navigation">
      <input type="checkbox" id="check" />
      <label htmlFor="check" className="checkbtn">
        <i className="fas fa-bars"></i>
      </label>
      <label className="logo">
        <span
          className="textLogo"
          style={{
            color: 'black',
            fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
            color: '#542d2d',
          }}
        >
          {isMobile? <img src={logo} className="logo1"/> : 'CharityCompass'}
        </span>
      </label>

      <div className="nav-buttons">
      {loggedIn ? (
                <>
                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>
                    <button onClick={logoutHandler}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate("/registerUser")}>
                        Register
                    </button>
                    <button onClick={() => navigate("/loginUser")}>
                        Login
                    </button>
                </>
            )}
      </div>
      {/* <ul>
        <li style={{ overflowY: 'hidden' }}>
          <a  style={{ color: 'black' }}>
            {
              loggedIn ? 'Dashboard' : 'Register'
            }
          </a>
        </li>
        <li style={{ overflowY: 'hidden' }}>
          <a href="#" style={{ color: 'black', overflowY: 'hidden' }}>About</a>
        </li>
        <li style={{ overflowY: 'hidden' }}>
          <a href="#" style={{ color: 'black', overflowY: 'hidden' }}>Testimonial</a>
        </li>
      </ul> */}
    </nav>
    </>
    
  );
}

export default Navbar;