import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import FirstSection from "../components/Home/first";
import SecondSection from "../components/Home/second";
import SectionThree from "../components/Home/three";
import SectionFour from "../components/Home/four";
import FiveSection from "../components/Home/fifth";
import SectionSix from "../components/Home/sixth";
import Footer from "../components/Home/footer";

function Home({ loggedIn, setLoggedIn }) {
    const [loading, setLoading] = useState(false);

    if(loading) return <div className="loading"><Loading /></div>
    return (
        // < className="home">
        //     Let the charity begin
        //     {loggedIn ? (
        //         <>
        //             <button onClick={() => navigate("/dashboard")}>
        //                 Dashboard
        //             </button>
        //             <button onClick={logoutHandler}>Logout</button>
        //         </>
        //     ) : (
        //         <>
        //             <button onClick={() => navigate("/registerUser")}>
        //                 Register
        //             </button>
        //             <button onClick={() => navigate("/loginUser")}>
        //                 Login
        //             </button>
        //         </>
        //     )}
        //     <button onClick={() => navigate("/charities")}>
        //         Support A Cause
        //     </button>
        <div className="home">
            <FirstSection loggedIn={loggedIn} setLoggedIn={setLoggedIn} loading={loading} setLoading={setLoading}/>
            <SecondSection />
            <SectionThree loggedIn={loggedIn} />
            <SectionFour loggedIn={loggedIn} />    
            <FiveSection loggedIn={loggedIn}/>
            <SectionSix />
            <Footer />
        </div>
    );
}

export default Home;

// import React from "react";
// import FirstSection from "./first";
// import SecondSection from "./second";
// import SectionThree from "./three";
// import SectionFour from "./four";
// import FiveSection from "./fifth";
// import SectionSix from "./sixth";
// import Footer from "./footer"

// function App(){
//     return <div>
//         <FirstSection />
//         <SecondSection />
//         <SectionThree />
//         <SectionFour />    
//         <FiveSection />
//         <SectionSix />
//         <Footer />

//     </div>

// }
// export default App;
