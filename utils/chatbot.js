const http = require("https");
const Discord = require("discord.js");
async function executeChatBot(message, prefix, i, chatbot) {
  if (i == 5) {
    return;
  }

  i++;
  try {
    let bot = message.client;
    message.channel.sendTyping();

    let context = undefined;
    let context1 = undefined;
    let context2 = undefined;
    let context3 = undefined;
    let context4 = undefined;
    let context5 = undefined;

    if (message.reference) {
      let message2 = await message.fetchReference();
      if (!message2) {
        return;
      }
      context = message2.content;
      if (message2.reference) {
        let message3 = await message2.fetchReference();
        context1 = message3.content;
        if (message3.reference) {
          let message4 = await message3.fetchReference();
          context2 = message4.content;
          if (message4.reference) {
            let message5 = await message4.fetchReference();
            context3 = message5.content;
            if (message5.reference) {
              let message6 = await message5.fetchReference();
              context4 = message6.content;
              if (message6.reference) {
                let message7 = await message6.fetchReference();
                context5 = message7.content;
              }
            }
          }
        }
      }
    }
    message.content = message.content.slice(prefix.length).trim();
    if (message.content.trim() == "") {
      message.content = "UDC";
    }
    const options = {
      method: "GET",
      hostname: "aeona3.p.rapidapi.com",
      port: null,
      path: encodeURI(
        "/?" +
          `text=${message.content}&userId=${message.author.id}${
            context ? `&context=${context}` : ""
          }${context1 ? `&context1=${context1}` : ""} ${
            context2 ? `&context2=${context2}` : ""
          } ${context3 ? `&context3=${context3}` : ""} ${
            context4 ? `&context4=${context4}` : ""
          } ${context5 ? `&context5=${context5}` : ""} ${
            chatbot ? `&chatbot=${chatbot}` : ""
          }`
      ),
      headers: {
        "X-RapidAPI-Host": "aeona3.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.apiKey,
        useQueryString: true,
      },
    };
    const req = http.request(options, function (res) {
      const chunks = [];
      req.on("error", function (e) {
        console.log(e);
        executeChatBot(message, "", i, chatbot);
      });

      req.on("timeout", function () {
        console.log("timeout");
        req.abort();
        executeChatBot(message, "", i, chatbot);
      });
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", async function () {
        const body = Buffer.concat(chunks);
        let reply = body.toString();

        //If reply is not a json
        if (
          reply.toLowerCase().includes("<html>") ||
          reply.toLowerCase().includes("<body>") ||
          reply.toLowerCase().includes("error")
        ) {
          executeChatBot(message, "", i, chatbot);
          return;
        }
        if (reply != "" && !reply.includes("!!!!")) {
          const command = message.client.commands.get(reply.toLowerCase());
          let comp = [];
          if (Math.random() * 100 < 15) {
            comp = [
              new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                  .setLabel("Invite")
                  .setURL(
                    "https://discord.com/api/oauth2/authorize?client_id=931226824753700934&permissions=8&scope=applications.commands%20bot"
                  )
                  .setStyle("LINK"),
                new Discord.MessageButton()
                  .setLabel("Vote")
                  .setURL("https://top.gg/bot/931226824753700934/vote")
                  .setStyle("LINK")
              ),
            ];
          }
          try {
            let p = await message
              .reply({
                content: reply,
                components: comp,
                embeds: [],
              })
              .catch((e) => {
                return;
              });

            if (command) {
              console.log(command);
              command.run(p, [], message.client);
            }

            return;
          } catch (e) {
            console.log(e);
            executeChatBot(message, "", i, chatbot);
            return;
          }
        }
        message.content = "UDC";
        executeChatBot(message, "", i, chatbot);
        return;
      });
    });
    req.end();
  } catch (e) {
    console.log(e);
    executeChatBot(message, "", i, chatbot);
  }
}

module.exports = executeChatBot;
