module.exports = {
  name: "nodeConnect",
  execute(client, node) {
    console.log(`${node.options.identifier} connected!`);
  },
};
