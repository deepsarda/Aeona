module.exports = {
  name: "nodeDisconnect",
  execute(client, node) {
    console.log(`${node.options.identifier} disconnected!`);
  },
};
