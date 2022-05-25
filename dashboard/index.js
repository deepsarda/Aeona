const Discord = require("discord.js");
const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const config = require("../utils/config");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Strategy = require("passport-discord").Strategy;
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { WebhookClient, MessageEmbed } = require("discord.js");
const DBL = require("@top-gg/sdk");
const mongoose = require("mongoose");
const webhook = new DBL.Webhook("");
const fetch = require("node-fetch");

//dont touch here
const Hook = new WebhookClient({
  url: config.webhook_url,
});
//

let rgx =
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

//schemas;


//important
const domain = config.domain;
const clientID = config.client_id;
const secret = config.secret;

const app = express();
app.use(express.static("dashboard/static"));

module.exports = async (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(
    new Strategy(
      {
        clientID: `${clientID}`,
        clientSecret: `${secret}`,
        callbackURL: `${domain}/callback`,
        scope: ["identify", "guilds"],
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );

  app.use(
    session({
      secret: "asdasdasda7734r734753ererfretertdf43534wfefrrrr4awewdasdadadad",
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: config.mongodb_url }),
    })
  );

  // We initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.domain = config.domain.split("//")[1];

  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  const renderTemplate = (res, req, template, data = {}) => {
    var hostname = req.headers.host;
    var pathname = url.parse(req.url).pathname;
    const baseData = {
      https: hostname.includes("localhost") ? "http://" : "https://",
      domain: domain,
      bot: client,
      hostname: hostname,
      pathname: pathname,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null,
      verification: config.verification,
      description: config.description,
      url: res,
      req: req,
      image: `${domain}/logo.png`,
      name: client.username,
      tag: client.tag,
      arc: config.arc,
      analitics: config.google_analitics,
    };
    res.render(
      path.resolve(`${templateDir}${path.sep}${template}`),
      Object.assign(baseData, data)
    );
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  };

  // Login endpoint.
  app.get(
    "/login",
    (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      // Forward the request to the passport middleware.
      next();
    },
    passport.authenticate("discord")
  );

  // Callback endpoint.
  app.get(
    "/callback",
    passport.authenticate("discord", {
      failWithError: true,
      failureFlash: "There was an error logging you in!",
      failureRedirect: "/",
    }),
    async (req, res) => {
      const loginLogs = new Discord.WebhookClient({ url: config.webhook_url });

      try {
        if (req.session.backURL) {
          const url = req.session.backURL;
          req.session.backURL = null;
          res.redirect(url);

          const member = await client.users.fetch(req.user.id);
          if (member) {
            const login = new MessageEmbed()
              .setColor("GREEN")
              .setTitle(`Login Logs`)
              .setDescription(
                `\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(
                  new Date()
                ).format("dddd, MMMM Do YYYY HH:mm:ss")} `
              );

            loginLogs.send({
              username: "Login Logs",
              avatarURL: `${domain}/logo.png`,
              embeds: [login],
            });
          }
        } else {
          const member = await client.users.fetch(req.user.id);
          if (member) {
            const login = new MessageEmbed()
              .setColor("GREEN")
              .setTitle(`Login Logs`)
              .setDescription(
                `\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(
                  new Date()
                ).format("dddd, MMMM Do YYYY HH:mm:ss")} `
              );

            loginLogs.send({
              username: "Login Logs",
              avatarURL: `${domain}/logo.png`,
              embeds: [login],
            });
          }

          res.redirect("/");
        }
      } catch (err) {
        res.redirect("/");
      }
    }
  );

  app.get("/faq", (req, res) => {
    renderTemplate(res, req, "faq.ejs");
  });

  app.get("/stats", (req, res) => {
    renderTemplate(res, req, "stats.ejs");
  });

  app.get("/variables", (req, res) => {
    renderTemplate(res, req, "variables.ejs");
  });

  app.get("/embeds", (req, res) => {
    renderTemplate(res, req, "embeds.ejs");
  });

  app.get("/support", (req, res) => {
    res.redirect(`https://discord.gg/SPcmvDMRrP`);
  });

  app.get("/server", (req, res) => {
    res.redirect(`https://discord.gg/SPcmvDMRrP`);
  });

  app.get("/invite", function (req, res) {
    res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${clientID}&redirect_uri=${domain}/thanks&response_type=code&scope=bot&permissions=1644971818487`
    );
  });

  app.get("/thanks", function (req, res) {
    renderTemplate(res, req, "thanks.ejs");
  });

  app.get("/policy", (req, res) => {
    renderTemplate(res, req, "policy.ejs");
  });

  // Logout endpoint.
  app.get("/logout", async function (req, res) {
    if (req.user) {
      const member = await client.users.fetch(req.user.id);
      if (member) {
        const logoutLogs = new WebhookClient({ url: config.webhook_url });

        const logout = new MessageEmbed()
          .setColor("RED")
          .setTitle(`Logout Logs`)
          .setDescription(
            `\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(
              new Date()
            ).format("dddd, MMMM Do YYYY HH:mm:ss")} `
          );

        logoutLogs.send({
          username: "Logout Logs",
          avatarURL: `${domain}/logo.png`,
          embeds: [logout],
        });
      }
    }

    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });
  app.get("/window", (req, res) => {
    renderTemplate(res, req, "window.ejs");
  });

  app.get("/premium", (req, res) => {
    renderTemplate(res, req, "premium.ejs");
  });

  // Index endpoint.
  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
  });



  app.get("/redeem", checkAuth, (req, res) => {
    renderTemplate(res, req, "redeem.ejs", {
      perms: Discord.Permissions,
    });
  });
  // Dashboard endpoint.
  app.get("/dashboard", checkAuth, (req, res) => {
    const server = client.guilds.cache.get("942062344840822824");
    let user = server.members.cache.has(req.user.id);

    renderTemplate(res, req, "dashboard.ejs", {
      perms: Discord.Permissions,
      userExists: user,
    });
  });


  //

  app.get("/dblwebhook", async (req, res) => {
    res.send(`Top.gg API is currently working!`);
  });

  app.post("/dblwebhook", webhook.middleware(), async (req) => {
    let credits = req.vote.isWeekend ? 2000 : 1000;

    const apiUser = await fetch(
      `https://discord.com/api/v8/users/${req.vote.user}`,
      {
        headers: { Authorization: `Bot ${process.env.BOTTOKEN}` },
      }
    ).then((res) => res.json());

    const msg = new Discord.MessageEmbed()
      .setAuthor("Voting System", `${domain}/logo.png`)
      .setColor("#7289DA")
      .setTitle(`${apiUser.username} Just Voted`)
      .setDescription(
        `Thank you **${apiUser.username}#${apiUser.discriminator}** (${apiUser.id}) for voting **aeona**!`
      );
    Hook.send({ embeds: [msg] });

    const userSettings = await User.findOne({ discordId: req.vote.user });
    if (!userSettings)
      return User.create({
        discordId: req.vote.user,
        votes: 1,
        lastVoted: Date.now(),
      });

    let voteUser = await client.users.fetch(apiUser.id);

    let voteNumber = userSettings.votes;
    if (!voteNumber) voteNumber = 0;
    if (voteUser) {
      voteUser.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(`Thanks for Voting!`)
            .setDescription(
              `Thank you **${apiUser.username}#${apiUser.discriminator}** (${
                apiUser.id
              }) for voting **aeona**! \n\nVote #${voteNumber + 1}`
            ),
        ],
      });
    }

    await userSettings.updateOne({
      votes: userSettings.votes + 1 || 1,
      lastVoted: Date.now(),
    });
  });


  app.get("*", (req, res) => {
    var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    if (
      fullUrl == domain ||
      fullUrl == `${domain}/style.css` ||
      fullUrl == `${domain}/style.css` ||
      fullUrl == `${domain}/favico.ico`
    ) {
      renderTemplate(res, req, "index.ejs");
    } else {
      renderTemplate(res, req, "404.ejs");
    }
  });



  app.listen(config.port, null, null, () =>
    console.log(
      `Dashboard is up and running on port http://localhost:${config.port}.`
    )
  );
};
