(async () => {
  const zulip = require("zulip-js");

  const isStudent = localStorage.getItem("is_student");
  const studentEmail = localStorage.getItem("student_email");
  const apiKey = localStorage.getItem("key");

  const pollyImg = document.getElementById("polly-img").value;
  const clientImg = document.getElementById("client-img").value;

  // mock data
  botui.message.human({
    delay: 500,
    photo: clientImg,
    content: "No",
  });
  botui.message.add({
    delay: 500,
    photo: pollyImg,
    content: "No",
  });

  if (isStudent == "true") {
    let index;
    const renderStudentMessage = async (event) => {
      switch (event.type) {
        case "typing":
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
    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
  } else {
    let index;
    const renderTeacherMessage = async (event) => {
      switch (event.type) {
        case "typing":
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
    };
    const staffEmail = localStorage.getItem("staff_email");
    const config = {
      username: staffEmail,
      apiKey: apiKey,
      realm: "https://zulip.cat",
    };
    const client = await zulip(config);

    const handleEvent = async (event) => {
      console.log("Got Event:", event);
      renderTeacherMessage(event);
    };
    try {
      await client.callOnEachEvent(handleEvent, ["streams"]);
    } catch (error) {
      console.log("error", error.message);
    }
  }

  // The zulip object now contains the API Key
  // console.log(await client.streams.subscriptions.retrieve());
})();
