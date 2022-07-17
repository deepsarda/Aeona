module.exports = {
  name: "nodeCreate",
  execute(client, node) {
    console.log(`${node.options.identifier} created!`);
  },
};
