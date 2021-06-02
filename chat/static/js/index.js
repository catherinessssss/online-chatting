(async () => {
  if (!isSupervisorPage) {
    const zulip = require("zulip-js");

    const isStudent = localStorage.getItem("is_student");
    const studentEmail = localStorage.getItem("student_email");
    const apiKey = localStorage.getItem("key");

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
    if (isStudent === "True") {
      let index; // botui message id
      let stream = "";
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
                if (!stream) {
                  stream = event.message.display_recipient;
                  staffEmail = stream
                    .split("_")
                    .find((item) => item !== studentEmail);
                  window.location.hash = stream;
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
            to: stream,
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
      // counsellor part
      // counsellor part
      // counsellor part
      // counsellor part
      // counsellor part
      // counsellor part
    } else {
      let index; // botui message id
      const staffEmail = localStorage.getItem("staff_email");

      const renderCounsellorMessage = async (event) => {
        switch (event.type) {
          case "typing":
            if (event.sender.email !== staffEmail) {
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
            if (event.message.sender_email !== staffEmail) {
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
      $(document)
        .on("click", "#send-message-btn", async () => {
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
        })
        .on("focus", "#message-text", async () => {
          await client.typing.send({
            to: [studentEmail],
            op: "start",
          });
        })
        .on("blur", "#message-text", async () => {
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
  }
})();
