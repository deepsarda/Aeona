module.exports = {
  name: "nodeError",
  execute(client, node, error) {
    console.log(`${node.options.identifier} error!`);
  },
};
