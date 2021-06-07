(async () => {
  if (!!isSupervisorPage) {
    const zulip = require("zulip-js");

    const supervisorEmail = localStorage.getItem("supervisor_email");
    const apiKey = localStorage.getItem("key");
    const stream_name = localStorage.getItem("stream_name");

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

    const renderSupervisorMessage = async (event) => {
      switch (event.type) {
        case "typing":
          if (event.sender.email !== supervisorEmail) {
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
          if (event.message.sender_email !== supervisorEmail) {
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
        default:
          console.log("event", event);
      }
    };

    const config = {
      username: supervisorEmail,
      apiKey: apiKey,
      realm: "https://zulip.cat",
    };
    const client = await zulip(config);

    const handleEvent = async (event) => {
      console.log("Got Event:", event);
      renderSupervisorMessage(event);
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
          to: [stream_id],
          op: "start",
          topic: "sao",
          type: "stream",
        });
      })
      .on("blur", "#message-text", async () => {
        await client.typing.send({
          to: [stream_id],
          op: "stop",
          topic: "sao",
          type: "stream",
        });
      });

    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
  }
})();
