
const { Listener } = require('@sapphire/framework');
class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });

  }

  run(client) {
    client.manager.init(client.user.id);
    client.statcord.autopost();
  }
}
module.exports = {
  ReadyListener
};