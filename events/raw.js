
const { Listener } = require('@sapphire/framework');
class RawListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'raw'
    });

  }

  run(client) {
    client.manager.updateVoiceState(data);
  }
}
module.exports = {
  RawListener
};