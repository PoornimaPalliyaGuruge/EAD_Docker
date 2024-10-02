import React from "react";
import { Image } from "react-bootstrap";

const RightSide = () => {
  return (
    <div>
      <Image
        src="/img/3.png"
        thumbnail
        style={{
          border: "none",
          // marginTop: "30px",
          width: "80%",
          height: "80%",
        }}
      />
    </div>
  );
};

export default RightSide;
