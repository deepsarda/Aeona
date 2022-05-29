module.exports = {
    name: "ready",
    execute(client) {
        client.manager.init(client.user.id);
    }
};