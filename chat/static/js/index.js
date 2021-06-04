(async () => {
  if (isStudentPage) {
    const zulip = require("zulip-js");

    // const isStudent = localStorage.getItem("is_student");
    // const studentEmail = localStorage.getItem("student_email");
    // const apiKey = localStorage.getItem("key");

    const pollyImg = document.getElementById("polly-img").value;
    const clientImg = document.getElementById("client-img").value;

    // Listen 'Enter' key press
    $(document).on("keyup", "#message-text", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.target.blur();
        document.getElementById("send-message-btn").click();
      }
    });

    // student
    let index; // botui message id
    let streamName = "";
    let streamId = "";
    let staffEmail = "";

    botui.message.add({
      delay: 500,
      photo: pollyImg,
      content: "Please wait a moment, I am coming soon...",
    });

    // hide the input area in case student send a message before connecting to a counsellor
    const chatDiv = document.getElementById("send-message-div");
    chatDiv.style.visibility = "hidden";

    // render student message when there is a event received
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
              // For the first time, retrive stream name
              if (!streamName) {
                streamName = event.message.display_recipient;
                staffEmail = streamName
                  .split("_")
                  .find((item) => item !== studentEmail);
                window.location.hash = streamName;
                stream_id = event.message.stream_id;
                chatDiv.style.visibility = "";
              }

              // append the message
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
    $(document)
      .on("click", "#send-message-btn", async () => {
        const text = document.getElementById("message-text");

        botui.message.human({
          photo: clientImg,
          content: text.value,
        });

        const params = {
          to: streamName,
          type: "stream",
          topic: "chat",
          content: text.value,
        };
        await client.messages.send(params);

        text.value = "";
      })
      .on("focus", "#message-text", async () => {
        console.log("staffEmail", staffEmail);
        await client.typing.send({
          // TODO update recipient
          to: [staffEmail],
          op: "start",
        });
      })
      .on("blur", "#message-text", async () => {
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
  }
})();
