const customCommand = require("../../database/schemas/customCommand.js");
let rgx =
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
let embedstarted = new Set();

const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "embed",
  description: "Create an embed",
  usage: "+embed ",
  category: "utility",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    if (embedstarted.has(message.author.id))
      return message
        .replyError({
          title: "EMBEDS",
          description: "You already have an Embed Builder running.",
        })
        .catch(() => {});
    message
      .replyError({
        title: "EMBEDS",
        description:
          "Starting Embed Builder. \n Type `start` to start the Embed Builder.",
      })
      .catch(() => {});

    message.channel
      .awaitMessages({
        filter: (m) => m.author.id == message.author.id,
        max: 1,
        time: 30000,
      })
      .then((collected) => {
        if (collected.first().content.toLowerCase() == "start") {
          embedstarted.add(message.author.id);
          message.delete();
          message.channel
            .send(
              "Enter a **title** `limit: 256 characters` **[type cancel to cancel the process]**"
            )
            .catch(() => {});
          message.channel
            .awaitMessages({
              filter: (m) => m.author.id == message.author.id,
              max: 1,
              time: 30000,
            })
            .then((collected) => {
              let title = collected.first().content;
              if (collected.first().content.length < 255) {
                if (collected.first().content == "cancel")
                  return (
                    message
                      .replyError({
                        title: "EMBEDS",
                        description: "Embed Builder cancelled.",
                      })
                      .catch(() => {}) + embedstarted.delete(message.author.id)
                  );
                message.channel
                  .send(
                    "Enter a **description** `limit: 2048 characters`  **[type cancel to cancel the process]**"
                  )
                  .catch(() => {});
                message.channel
                  .awaitMessages({
                    filter: (m) => m.author.id == message.author.id,
                    max: 1,
                    time: 30000,
                  })
                  .then((collected) => {
                    if (collected.first().content.length < 2048) {
                      if (collected.first().content == "cancel")
                        return (
                          message
                            .replyError({
                              title: "EMBEDS",
                              description: "Embed Builder cancelled.",
                            })
                            .catch(() => {}) +
                          embedstarted.delete(message.author.id)
                        );

                      let description = collected.first().content;
                      message.channel
                        .send(
                          "Enter a **color hex** `format: #000000`.\nType `Default` to use the bot's default color!\n\n**[type cancel to cancel the process]**"
                        )
                        .catch(() => {});
                      message.channel
                        .awaitMessages({
                          filter: (m) => m.author.id == message.author.id,
                          max: 1,
                          time: 30000,
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.length < 8 ||
                            collected.first().content.toLowerCase() == "default"
                          ) {
                            if (collected.first().content == "cancel")
                              return (
                                message
                                  .replyError({
                                    title: "EMBEDS",
                                    description: "Embed Builder cancelled.",
                                  })
                                  .catch(() => {}) +
                                embedstarted.delete(message.author.id)
                              );

                            let color = collected.first().content;
                            if (
                              collected.first().content.toLowerCase() ==
                              "default"
                            )
                              color = `default`;

                            message.channel
                              .send(
                                "Enter a `thumbnail URL` for your embed **(OPTIONAL)**. Type `none` to skip this step.\n**[type cancel to cancel the process]**"
                              )
                              .catch(() => {});

                            message.channel
                              .awaitMessages({
                                filter: (m) => m.author.id == message.author.id,
                                max: 1,
                                time: 30000,
                              })
                              .then((collected) => {
                                if (
                                  rgx.test(collected.first().content) ||
                                  collected.first().content.toLowerCase() ==
                                    "none"
                                ) {
                                  let thumbnail = collected
                                    .first()
                                    .content.toLowerCase();
                                  message.channel
                                    .send(
                                      "Enter a image URL for your embed **(OPTIONAL)**. Type `none` to skip this step. \n*Only valid image URLs will work*\n\n**[type cancel to cancel the process]**"
                                    )
                                    .catch(() => {});

                                  message.channel
                                    .awaitMessages({
                                      filter: (m) =>
                                        m.author.id == message.author.id,
                                      max: 1,
                                      time: 30000,
                                    })
                                    .then((collected) => {
                                      if (
                                        rgx.test(collected.first().content) ||
                                        collected
                                          .first()
                                          .content.toLowerCase() == "none"
                                      ) {
                                        let image = collected
                                          .first()
                                          .content.toLowerCase();

                                        message.channel
                                          .send(
                                            "Enter a footer for your embed **(OPTIONAL)**. Type `none` to skip this step.  \n**[type cancel to cancel the process]**"
                                          )
                                          .catch(() => {});

                                        message.channel
                                          .awaitMessages({
                                            filter: (m) =>
                                              m.author.id == message.author.id,
                                            max: 1,
                                            time: 30000,
                                          })
                                          .then((collected) => {
                                            if (
                                              collected.first().content.length <
                                                2048 ||
                                              collected
                                                .first()
                                                .content.toLowerCase() == "none"
                                            ) {
                                              if (
                                                collected.first().content ==
                                                "cancel"
                                              )
                                                return (
                                                  message
                                                    .replyError({
                                                      title: "EMBEDS",
                                                      description:
                                                        "Embed Builder cancelled.",
                                                    })
                                                    .catch(() => {}) +
                                                  embedstarted.delete(
                                                    message.author.id
                                                  )
                                                );

                                              let footer =
                                                collected.first().content;
                                              let mainfooter =
                                                collected.first().content;

                                              if (
                                                collected
                                                  .first()
                                                  .content.toLowerCase() ==
                                                "none"
                                              )
                                                footer = `none`;

                                              message.channel.send(
                                                "Would you like to have a timestamp in the embed? <yes / no>  \n**[type cancel to cancel the process]**"
                                              );
                                              message.channel
                                                .awaitMessages({
                                                  filter: (m) =>
                                                    m.author.id ==
                                                    message.author.id,
                                                  max: 1,
                                                  time: 30000,
                                                })
                                                .then((collected) => {
                                                  if (
                                                    collected
                                                      .first()
                                                      .content.toLowerCase() ==
                                                      "yes" ||
                                                    collected
                                                      .first()
                                                      .content.toLowerCase() ==
                                                      "no"
                                                  ) {
                                                    if (
                                                      collected.first()
                                                        .content == "cancel"
                                                    )
                                                      return (
                                                        message
                                                          .replyError({
                                                            title: "EMBEDS",
                                                            description:
                                                              "Embed Builder cancelled.",
                                                          })
                                                          .catch(() => {}) +
                                                        embedstarted.delete(
                                                          message.author.id
                                                        )
                                                      );

                                                    let timestamp = `no`;
                                                    if (
                                                      collected
                                                        .first()
                                                        .content.toLowerCase() ==
                                                      "yes"
                                                    )
                                                      timestamp = `yes`;

                                                    //here
                                                    message.channel
                                                      .send(
                                                        "Would you like to save the embed as a `Custom Command?` <yes / no>  \n**[type cancel to cancel the process]**"
                                                      )
                                                      .catch(() => {});
                                                    message.channel
                                                      .awaitMessages({
                                                        filter: (m) =>
                                                          m.author.id ==
                                                          message.author.id,
                                                        max: 1,
                                                        time: 30000,
                                                      })
                                                      .then((collected) => {
                                                        if (
                                                          collected
                                                            .first()
                                                            .content.toLowerCase() ==
                                                            "yes" ||
                                                          collected
                                                            .first()
                                                            .content.toLowerCase() ==
                                                            "no"
                                                        ) {
                                                          if (
                                                            collected.first()
                                                              .content ==
                                                            "cancel"
                                                          )
                                                            message
                                                              .replyError({
                                                                title: "EMBEDS",
                                                                description:
                                                                  "Embed Builder cancelled.",
                                                              })
                                                              .catch(() => {}) +
                                                              embedstarted.delete(
                                                                message.author
                                                                  .id
                                                              );

                                                          if (
                                                            collected
                                                              .first()
                                                              .content.toLowerCase() ==
                                                            "yes"
                                                          ) {
                                                            message.channel
                                                              .send(
                                                                "What would you like to name your custom command?  `[Max: 30 characters / 1 word]`\n  **[type cancel to cancel the process]**"
                                                              )
                                                              .catch(() => {});
                                                            //   do stuff

                                                            message.channel
                                                              .awaitMessages({
                                                                filter: (m) =>
                                                                  m.author.id ==
                                                                  message.author
                                                                    .id,
                                                                max: 1,
                                                                time: 30000,
                                                              })
                                                              .then(
                                                                (collected) => {
                                                                  let argword =
                                                                    collected.first()
                                                                      .content;
                                                                  let myArray =
                                                                    argword.split(
                                                                      " "
                                                                    );

                                                                  if (
                                                                    myArray.length >
                                                                    1
                                                                  )
                                                                    return (
                                                                      message
                                                                        .replyError(
                                                                          {
                                                                            title:
                                                                              "EMBEDS",
                                                                            description:
                                                                              "Embed Builder cancelled.",
                                                                          }
                                                                        )
                                                                        .catch(
                                                                          () => {}
                                                                        ) +
                                                                      embedstarted.delete(
                                                                        message
                                                                          .author
                                                                          .id
                                                                      )
                                                                    );
                                                                  if (
                                                                    this.client.commands.get(
                                                                      argword.toLowerCase()
                                                                    )
                                                                  )
                                                                    return (
                                                                      message.channel.send(
                                                                        `That command is already an existing bot command!`
                                                                      ) +
                                                                      embedstarted.delete(
                                                                        message
                                                                          .author
                                                                          .id
                                                                      )
                                                                    );
                                                                  if (
                                                                    collected.first()
                                                                      .content
                                                                      .length <
                                                                    30
                                                                  ) {
                                                                    let name =
                                                                      collected
                                                                        .first()
                                                                        .content.toLowerCase();
                                                                    let content = `embed`;
                                                                    customCommand.findOne(
                                                                      {
                                                                        guildId:
                                                                          message
                                                                            .guild
                                                                            .id,
                                                                        name,
                                                                      },
                                                                      async (
                                                                        err,
                                                                        data
                                                                      ) => {
                                                                        if (
                                                                          !data
                                                                        ) {
                                                                          customCommand.create(
                                                                            {
                                                                              guildId:
                                                                                message
                                                                                  .guild
                                                                                  .id,
                                                                              name,
                                                                              content,
                                                                              title:
                                                                                title,
                                                                              description:
                                                                                description,
                                                                              color:
                                                                                color,
                                                                              image:
                                                                                image,
                                                                              thumbnail:
                                                                                thumbnail,
                                                                              footer:
                                                                                footer,
                                                                              timestamp:
                                                                                timestamp,
                                                                            }
                                                                          );
                                                                          embedstarted.delete(
                                                                            message
                                                                              .author
                                                                              .id
                                                                          );
                                                                          message.channel.send(
                                                                            {
                                                                              title:
                                                                                "EMBEDS",
                                                                              description:
                                                                                "I have created your custom command! Usage:" +
                                                                                `\`${prefix}${name}\``,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          return (
                                                                            message
                                                                              .replyError(
                                                                                {
                                                                                  title:
                                                                                    "EMBEDS",
                                                                                  description:
                                                                                    "It is already a custom command!",
                                                                                }
                                                                              )
                                                                              .catch(
                                                                                () => {}
                                                                              ) +
                                                                            embedstarted.delete(
                                                                              message
                                                                                .author
                                                                                .id
                                                                            )
                                                                          );
                                                                        }
                                                                      }
                                                                    );

                                                                    return;
                                                                  } else
                                                                    message
                                                                      .replyError(
                                                                        {
                                                                          title:
                                                                            "EMBEDS",
                                                                          description:
                                                                            "Embed Builder cancelled.",
                                                                        }
                                                                      )
                                                                      .catch(
                                                                        () => {}
                                                                      ) +
                                                                      embedstarted.delete(
                                                                        message
                                                                          .author
                                                                          .id
                                                                      );
                                                                }
                                                              )
                                                              .catch(() => {
                                                                message
                                                                  .replyError({
                                                                    title:
                                                                      "EMBEDS",
                                                                    description:
                                                                      "30 seconds have passed, Embed Builder cancelled.",
                                                                  })
                                                                  .catch(
                                                                    () => {}
                                                                  ) +
                                                                  embedstarted.delete(
                                                                    message
                                                                      .author.id
                                                                  );
                                                              });
                                                          } else {
                                                            message.channel
                                                              .send(
                                                                "Finally, please **mention** the channel you would like to send the embed to!  \n**[type cancel to cancel the process]**"
                                                              )
                                                              .catch(() => {});

                                                            message.channel
                                                              .awaitMessages({
                                                                filter: (m) =>
                                                                  m.author.id ==
                                                                  message.author
                                                                    .id,
                                                                max: 1,
                                                                time: 30000,
                                                              })
                                                              .then(
                                                                (collected) => {
                                                                  let channel =
                                                                    collected
                                                                      .first()
                                                                      .mentions.channels.first();
                                                                  if (channel) {
                                                                    let embed =
                                                                      new MessageEmbed()
                                                                        .setTitle(
                                                                          title
                                                                        )
                                                                        .setDescription(
                                                                          description
                                                                        )

                                                                        .setFooter(
                                                                          ``
                                                                        );

                                                                    if (
                                                                      image !==
                                                                      "none"
                                                                    )
                                                                      embed.setImage(
                                                                        image
                                                                      );
                                                                    if (
                                                                      thumbnail !==
                                                                      "none"
                                                                    )
                                                                      embed.setThumbnail(
                                                                        thumbnail
                                                                      );

                                                                    if (
                                                                      footer !==
                                                                      "none"
                                                                    )
                                                                      embed.setFooter(
                                                                        mainfooter
                                                                      );
                                                                    if (
                                                                      timestamp !==
                                                                      "no"
                                                                    )
                                                                      embed.setTimestamp();
                                                                    if (
                                                                      color ==
                                                                      "default"
                                                                    ) {
                                                                      embed.setColor(
                                                                        message
                                                                          .guild
                                                                          .me
                                                                          .displayHexColor
                                                                      );
                                                                    } else
                                                                      embed.setColor(
                                                                        `${color}`
                                                                      );
                                                                    channel.send(
                                                                      {
                                                                        embeds:
                                                                          [
                                                                            embed,
                                                                          ],
                                                                      }
                                                                    );
                                                                    embedstarted.delete(
                                                                      message
                                                                        .author
                                                                        .id
                                                                    );

                                                                    return;
                                                                  } else
                                                                    message
                                                                      .replyError(
                                                                        {
                                                                          title:
                                                                            "EMBEDS",
                                                                          description:
                                                                            "Embed Builder cancelled.",
                                                                        }
                                                                      )
                                                                      .catch(
                                                                        () => {}
                                                                      );
                                                                  embedstarted.delete(
                                                                    message
                                                                      .author.id
                                                                  );
                                                                }
                                                              )
                                                              .catch(() => {
                                                                message
                                                                  .replyError({
                                                                    title:
                                                                      "EMBEDS",
                                                                    description:
                                                                      "30 seconds have passed, Embed Builder cancelled.",
                                                                  })
                                                                  .catch(
                                                                    () => {}
                                                                  );
                                                                embedstarted.delete(
                                                                  message.author
                                                                    .id
                                                                );
                                                              });
                                                          }
                                                        } else
                                                          message
                                                            .replyError({
                                                              title: "EMBEDS",
                                                              description:
                                                                "Embed Builder cancelled.",
                                                            })
                                                            .catch(() => {})
                                                            .catch(() => {});
                                                      })
                                                      .catch(() => {
                                                        message
                                                          .replyError({
                                                            title: "EMBEDS",
                                                            description:
                                                              "30 seconds have passed, Embed Builder cancelled.",
                                                          })
                                                          .catch(() => {});
                                                      });
                                                  } else
                                                    message
                                                      .replyError({
                                                        title: "EMBEDS",
                                                        description:
                                                          "Embed Builder cancelled.",
                                                      })
                                                      .catch(() => {});
                                                })
                                                .catch(() => {
                                                  message
                                                    .replyError({
                                                      title: "EMBEDS",
                                                      description:
                                                        "30 seconds have passed, Embed Builder cancelled.",
                                                    })
                                                    .catch(() => {});
                                                  embedstarted.delete(
                                                    message.author.id
                                                  );
                                                });

                                              return;
                                            } else
                                              message
                                                .replyError({
                                                  title: "EMBEDS",
                                                  description:
                                                    "Embed Builder cancelled.",
                                                })
                                                .catch(() => {});
                                            embedstarted.delete(
                                              message.author.id
                                            );
                                          })
                                          .catch(() => {
                                            message
                                              .replyError({
                                                title: "EMBEDS",
                                                description:
                                                  "30 seconds have passed, Embed Builder cancelled.",
                                              })
                                              .catch(() => {});
                                            embedstarted.delete(
                                              message.author.id
                                            );
                                          });
                                        return;
                                      } else
                                        message
                                          .replyError({
                                            title: "EMBEDS",
                                            description:
                                              "Embed Builder cancelled.",
                                          })
                                          .catch(() => {});
                                      embedstarted.delete(message.author.id);
                                    })
                                    .catch(() => {
                                      message
                                        .replyError({
                                          title: "EMBEDS",
                                          description:
                                            "30 seconds have passed, Embed Builder cancelled.",
                                        })
                                        .catch(() => {});
                                      embedstarted.delete(message.author.id);
                                    });

                                  return;
                                } else
                                  message
                                    .replyError({
                                      title: "EMBEDS",
                                      description: "Embed Builder cancelled.",
                                    })
                                    .catch(() => {});
                                embedstarted.delete(message.author.id);
                              })
                              .catch(() => {
                                message
                                  .replyError({
                                    title: "EMBEDS",
                                    description:
                                      "30 seconds have passed, Embed Builder cancelled.",
                                  })
                                  .catch(() => {});
                                embedstarted.delete(message.author.id);
                              });

                            return;
                          } else
                            message
                              .replyError({
                                title: "EMBEDS",
                                description: "Embed Builder cancelled.",
                              })
                              .catch(() => {});
                          embedstarted.delete(message.author.id);
                        })
                        .catch(() => {
                          message
                            .replyError({
                              title: "EMBEDS",
                              description:
                                "30 seconds have passed, Embed Builder cancelled.",
                            })
                            .catch(() => {});
                          embedstarted.delete(message.author.id);
                        });

                      return;
                    } else
                      message
                        .replyError({
                          title: "EMBEDS",
                          description: "Embed Builder cancelled.",
                        })
                        .catch(() => {});
                    embedstarted.delete(message.author.id);
                  })
                  .catch(() => {
                    message
                      .replyError({
                        title: "EMBEDS",
                        description:
                          "30 seconds have passed, Embed Builder cancelled.",
                      })
                      .catch(() => {});
                    embedstarted.delete(message.author.id);
                  });

                return;
              } else message.reply("stop");
              embedstarted.delete(message.author.id);
            })
            .catch(() => {
              message
                .replyError({
                  title: "EMBEDS",
                  description:
                    "30 seconds have passed, Embed Builder cancelled.",
                })
                .catch(() => {});
              embedstarted.delete(message.author.id);
            });

          return;
        } else message.delete();
        message
          .replyError({
            title: "EMBEDS",
            description: "Embed Builder cancelled.",
          })
          .catch(() => {});
        embedstarted.delete(message.author.id);
      })
      .catch(() => {
        message
          .replyError({
            title: "EMBEDS",
            description: "30 seconds have passed, Embed Builder cancelled.",
          })
          .catch(() => {});
        embedstarted.delete(message.author.id);
      });
  },
};
