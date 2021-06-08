(async () => {
  if (isCounsellorPage) {
    const zulip = require("zulip-js");

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

    let index; // botui message id
    // const staffEmail = localStorage.getItem("staff_email");

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

    const handleEvent = async (event) => {
      console.log("Got Event:", event);
      renderCounsellorMessage(event);
    };

    // send message
    $(document)
      .on("click", "#send-message-btn", async () => {
        const text = document.getElementById("message-text");

        if (!text.value) {
          text.focus();
          return;
        }

        botui.message.human({
          photo: pollyImg,
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
      .on("click", "#counsellor-leave-chatroom-btn", async () => {
        const result = confirm(
          "Are you sure you want to end the conversation?"
        );
        if (result == true) {
          const response = await $.ajax({
            url: "/chat/unsubscribe_stream",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
              unsubscribers_netid: [studentNetid],
              staff_netid: staffNetid,
            }),
          });

          if (response.status == "success") {
            alert("You have successfully end the conversation.");
          } else {
            alert("Ops, Something wrong happened.");
          }
        }
      })
      .on("focus", "#message-text", async () => {
        await client.typing.send({
          type: "stream",
          to: [studentEmail],
          op: "start",
          topic: "chat",
        });
      })
      .on("blur", "#message-text", async () => {
        await client.typing.send({
          type: "stream",
          to: [studentEmail],
          op: "stop",
          topic: "chat",
        });
      });

    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
  }
})();
