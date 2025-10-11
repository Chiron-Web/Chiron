import React from "react";
import ReactLoading from "react-loading";
const Loader = () => (
 <div>
   <h2>Loading...</h2>
   <ReactLoading type="spin" color="#0000FF" height={100} width={50} />
 </div>
);
export default Loader;