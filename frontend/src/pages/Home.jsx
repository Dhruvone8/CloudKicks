import React from "react";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSeller from "../components/BestSeller";
import Policies from "../components/Policies";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <div>
      <Hero />
      {/* Content sections with proper padding */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw]">
        <LatestCollections />
        <BestSeller />
        <Policies />
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
