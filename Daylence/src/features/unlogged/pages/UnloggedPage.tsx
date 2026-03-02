import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../css/UnloggedPageStyle.css";

export default function UnloggedPage() {
  return (
    <div>
      <div className="wall-container">
        <div className="wall-element">
          <Header />
          <h1>Daylence</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <img
                src="/3d_daylence_logo.png"
                alt="Daylence Logo"
                style={{ width: "900px", height: "auto" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2 style={{ textAlign: "right", fontWeight: "bold", fontStyle: "italic", fontSize: "2rem", color: "#333" }}>
                Welcome to Daylence, your ultimate time management solution!{" "}
                <br />
                Our app is designed to help you take control of your schedule
                and boost your productivity. <br />
                With Daylence, you can easily organize your tasks, set
                reminders, and track your progress. <br />
                Say goodbye to missed deadlines and hello to a more efficient
                and balanced life with Daylence!
              </h2>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
