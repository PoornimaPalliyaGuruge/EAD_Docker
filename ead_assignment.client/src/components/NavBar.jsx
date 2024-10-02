// import React, { useContext, useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { Dropdown } from "react-bootstrap";
// import Container from "react-bootstrap/Container";
// import Navbar from "react-bootstrap/Navbar";
// import { UserContext } from "../context/UserContext";
// import Drawer from "react-modern-drawer";
// import "react-modern-drawer/dist/index.css";
// import UserProfile from "./UserProfile";

// function NavBar() {
//   const { userData } = useContext(UserContext);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setIsDrawerOpen((prevState) => !prevState);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("userData");
//     window.location.href = "/login";
//   };

//   const roleLabels = userData?.role?.filter((role) => role !== "user");

//   return (
//     <>
//       <Navbar
//         style={{
//           backgroundColor: "#23474a",
//           position: "fixed", // Make the NavBar fixed
//           top: 0,
//           width: "100%",
//           zIndex: 1000, // Ensure it stays above other content
//         }}
//         expand="lg"
//       >
//         <Container
//           fluid
//           style={{
//             color: "white",
//             paddingLeft: 15,
//             paddingRight: 15,
//             margin: 0,
//             maxWidth: "100%",
//           }}
//         >
//           <Navbar.Brand
//             href="/home"
//             style={{ color: "white", fontSize: "24px" }}
//           >
//             E-Commerce Application
//           </Navbar.Brand>
//           <Navbar.Collapse className="justify-content-end">
//             {userData && userData.userName && (
//               <Dropdown>
//                 <Dropdown.Toggle
//                   as="div"
//                   style={{
//                     color: "#bccbcc",
//                     display: "flex",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {/* display the role */}
//                   {roleLabels &&
//                     roleLabels.map((role, index) => (
//                       <div
//                         key={index}
//                         className="bg-primary text-white rounded px-2 me-2"
//                       >
//                         {role === "administrator"
//                           ? "Admin"
//                           : role.charAt(0).toUpperCase() + role.slice(1)}{" "}
//                       </div>
//                     ))}
//                   <p style={{ margin: 0 }}>{userData.userName}</p>
//                   <FaUserCircle
//                     style={{ fontSize: "35px", marginLeft: "5px" }}
//                   />
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={toggleDrawer}>Profile</Dropdown.Item>{" "}
//                   {/* Opens the drawer */}
//                   <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             )}
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Drawer for User Profile */}
//       <Drawer
//         open={isDrawerOpen}
//         onClose={toggleDrawer}
//         direction="right"
//         style={{
//           width: "400px",
//           backgroundColor: "RGB(34, 83, 87)",
//         }}
//       >
//         <button
//           style={{
//             position: "absolute",
//             top: "-8px",
//             right: "0px",
//             background: "none",
//             border: "none",
//             color: "white",
//             fontSize: "24px",
//             cursor: "pointer",
//           }}
//           onClick={toggleDrawer}
//         >
//           &times;
//         </button>
//         <UserProfile />
//       </Drawer>
//     </>
//   );
// }

// export default NavBar;

import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { UserContext } from "../context/UserContext";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import UserProfile from "./UserProfile";

function NavBar() {
  const { userData } = useContext(UserContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const roleLabels = userData?.role?.filter((role) => role !== "user");

  return (
    <>
      <Navbar style={{ backgroundColor: "#23474a" }} expand="lg">
        <Container
          fluid
          style={{
            color: "white",
            paddingLeft: 15,
            paddingRight: 15,
            margin: 0,
            maxWidth: "100%",
          }}
        >
          <Navbar.Brand
            href="/home"
            style={{ color: "white", fontSize: "24px" }}
          >
            E-Commerce Application
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            {userData && userData.userName && (
              <Dropdown>
                <Dropdown.Toggle
                  as="div"
                  style={{
                    color: "#bccbcc",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {/* display the role */}
                  {roleLabels &&
                    roleLabels.map((role, index) => (
                      <div
                        key={index}
                        className="bg-primary text-white rounded px-2 me-2"
                      >
                        {role === "administrator"
                          ? "Admin"
                          : role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                      </div>
                    ))}
                  <p style={{ margin: 0 }}>{userData.userName}</p>
                  <FaUserCircle
                    style={{ fontSize: "35px", marginLeft: "5px" }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={toggleDrawer}>Profile</Dropdown.Item>{" "}
                  {/* Opens the drawer */}
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Drawer for User Profile */}
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="right"
        style={{
          width: "400px",
          backgroundColor: "RGB(34, 83, 87)",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "-8px",
            right: "0px",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
          }}
          onClick={toggleDrawer}
        >
          &times;
        </button>
        <UserProfile />
      </Drawer>
    </>
  );
}

export default NavBar;
