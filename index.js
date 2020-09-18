const http = require("https");
const core = require('@actions/core');

function render() {
  var options = {
    method: "GET",
    hostname: "api.github.com",
    port: null,
    path: `/repos/${process.env.GITHUB_REPOSITORY}/readme`,
    headers: {
      "user-agent": "KNawm",
      accept: "application/vnd.github.VERSION.html",
    },
  };

  return new Promise((resolve, reject) => {
    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        try {
          resolve(Buffer.concat(chunks));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.end();
  });
}

function createSingleSend(payload) {
    var options = {
      method: "POST",
      hostname: "api.sendgrid.com",
      port: null,
      path: "/v3/marketing/singlesends",
      headers: {
        authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
    };

    return new Promise((resolve, reject) => {
      var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          try {
            resolve(Buffer.concat(chunks));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.write(payload);
      req.end();
    });
}

function scheduleSingleSend(id) {
    var options = {
      method: "PUT",
      hostname: "api.sendgrid.com",
      port: null,
      path: `/v3/marketing/singlesends/${id}/schedule`,
      headers: {
        authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
    };

    return new Promise((resolve, reject) => {
      var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          try {
            resolve(Buffer.concat(chunks));
          } catch (e) {
            reject(e);
          }
        });
      });

      var now = new Date();
      var scheduledDate = new Date(now.getTime() + 300000); // 5 minutes later.

      req.write(`{"send_at":"${scheduledDate.toISOString()}"}`);
      req.end();
    });
}

async function run() {
  try {
    const subjectLine = core.getInput("subject");
    const contactList = core.getInput("list_id");
    const unsubscribeGroup = core.getInput("suppression_group_id");
    const sender = core.getInput("sender_id");

    const html = await render();
    console.log(html.toString());

    const payload = JSON.stringify({
      name: subjectLine,
      send_to: {
        list_ids: [contactList],
      },
      email_config: {
        subject: subjectLine,
        html_content: html.toString(),
        generate_plain_content: true,
        suppression_group_id: unsubscribeGroup,
        sender_id: sender,
      },
    });

    const create = await createSingleSend(payload);
    console.log(create.toString());
    const singleSendId = JSON.parse(create)["id"];
    const schedule = await scheduleSingleSend(singleSendId);
    console.log(schedule.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
