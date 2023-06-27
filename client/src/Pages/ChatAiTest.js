import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatAiTest() {
  const BASE_URL = "http://localhost:5000/";
  const [value, setValue] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [prog, setProg] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (value === "") {
      return;
    }
    const timer = setTimeout(() => {
      callGpt(value);
    }, 2000);

    return () => clearTimeout(timer);
  }, [value]);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  const callGpt = async (value) => {
    console.log(value, "my val");

    const updatedArr = [...allMessage, { role: "user", content: value }];
    setAllMessage(updatedArr);
    scrollToBottom();

    setProg(true);

    try {
      const response = await axios.post(BASE_URL + "AiTest/getGTPText", {
        message: updatedArr,
      });

      console.log("Response:", response.data.value);

      if (response.data.status === 200) {
        const resMsg = response.data.value.choices[0].message;

        const tempArr = [...updatedArr, resMsg];
        console.log(tempArr, "my sms2");
        setAllMessage(tempArr);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error:-", error);
    }

    setProg(false);
  };

  return (
    <div>
      <div className="chat-container" ref={chatContainerRef}>
        {allMessage.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "40px" }}>
              Welcome to GPT
            </div>
          </div>
        )}
        {allMessage.map((msg, index) => (
          <div style={{ display: "flex", padding: "10px" }} key={index}>
            <div style={{ minWidth: "100px" }}>{msg.role} : </div>
            <div style={{ marginLeft: "8px", textAlign: "left" }}>
              {msg.content}
            </div>
            <br />
          </div>
        ))}
        {prog && <p style={{ paddingTop: "10px" }}> Processing... </p>}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{ width: "70%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatAiTest;