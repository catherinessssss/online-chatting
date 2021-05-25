(async () => {
  const zulip = require("zulip-js");

  const isStudent = localStorage.getItem("is_student");
  const studentEmail = localStorage.getItem("student_email");
  const apiKey = localStorage.getItem("key");

  const pollyImg = document.getElementById("polly-img").value;
  const clientImg = document.getElementById("client-img").value;

  if (isStudent == "true") {
    let index;
    let stream = "";
    let staffEmail = "";

    botui.message.add({
      delay: 500,
      photo: pollyImg,
      content: "Please wait a moment, I am coming soon...",
    });

    const chatDiv = document.getElementById("send-message-div");
    chatDiv.style.visibility = "hidden";

    const renderStudentMessage = async (event) => {
      switch (event.type) {
        case "typing":
          if (event.sender.email !== studentEmail) {
            if (event.op === "start") {
              index = await botui.message.add({
                loading: true,
                human: false,
                photo: pollyImg,
              });
            } else {
              await botui.message.remove(index, {
                loading: false,
                human: false,
                photo: pollyImg,
              });
            }
          }
          break;
        case "message":
          if (event.message.sender_email !== studentEmail) {
            if (event.message.type === "stream") {
              if (!stream) {
                stream = event.message.display_recipient;
                staffEmail = stream.substr(stream.indexOf("_") + 1);
                window.location.hash = stream;
                chatDiv.style.visibility = "";
              }
              await botui.message.add({
                loading: false,
                human: false,
                photo: pollyImg,
                content: event.message.content,
              });
            }
          }
          break;
      }
    };

    const config = {
      username: studentEmail,
      apiKey: apiKey,
      realm: "https://zulip.cat",
    };
    const client = await zulip(config);

    const handleEvent = async (event) => {
      console.log("Got Event:", event);
      renderStudentMessage(event);
    };

    // send message
    $(document).on("click", "#send-message-btn", async () => {
      const text = document.getElementById("message-text");

      botui.message.human({
        photo: clientImg,
        content: text.value,
      });

      const params = {
        to: stream,
        type: "stream",
        topic: "chat",
        content: text.value,
      };
      await client.messages.send(params);

      text.value = "";
    });

    $(document).on("focus", "#message-text", async () => {
      console.log("staffEmail", staffEmail);
      await client.typing.send({
        to: [staffEmail],
        op: "start",
      });
    });

    $(document).on("blur", "#message-text", async () => {
      console.log("staffEmail", staffEmail);
      await client.typing.send({
        to: [staffEmail],
        op: "stop",
      });
    });
    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
    // counsellor part
    // counsellor part
    // counsellor part
    // counsellor part
    // counsellor part
    // counsellor part
  } else {
    let index;
    const renderCounsellorMessage = async (event) => {
      switch (event.type) {
        case "typing":
          if (event.sender.email === studentEmail) {
            if (event.op === "start") {
              index = await botui.message.add({
                loading: true,
                human: false,
              });
            } else {
              await botui.message.remove(index, {
                loading: false,
                human: false,
              });
            }
          }
          break;
        case "message":
          if (event.message.sender_email === studentEmail) {
            if (event.message.type === "stream") {
              await botui.message.add({
                loading: false,
                human: false,
                photo: clientImg,
                content: event.message.content,
              });
            }
          }
          break;
      }
    };

    const staffEmail = localStorage.getItem("staff_email");
    const config = {
      username: staffEmail,
      apiKey: apiKey,
      realm: "https://zulip.cat",
    };
    const client = await zulip(config);
    const stream_name = window.location.hash.substr(1);

    const handleEvent = async (event) => {
      console.log("Got Event:", event);
      renderCounsellorMessage(event);
    };

    // send message
    $(document).on("click", "#send-message-btn", async () => {
      const text = document.getElementById("message-text");

      botui.message.human({
        photo: pollyImg,
        content: text.value,
      });

      const params = {
        to: stream_name,
        type: "stream",
        topic: "chat",
        content: text.value,
      };
      await client.messages.send(params);

      text.value = "";
    });

    $(document).on("focus", "#message-text", async () => {
      await client.typing.send({
        to: [studentEmail],
        op: "start",
      });
    });

    $(document).on("blur", "#message-text", async () => {
      await client.typing.send({
        to: [studentEmail],
        op: "stop",
      });
    });

    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
  }
})();
