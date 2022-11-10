import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { Channel, Role } from 'discordeno';
export default (client: AmethystBot) => {
	client.extras.createChannelSetup = async function (Schema: any, channel: Channel, interaction: Context) {
		Schema.findOne({ Guild: interaction.guildId }, async (err: any, data: { Channel: bigint; save: () => void }) => {
			if (data) {
				data.Channel = channel.id;
				data.save();
			} else {
				new Schema({
					Guild: interaction.guildId,
					Channel: channel.id + '',
				}).save();
			}
		});

		client.extras.succNormal(
			{
				text: `Channel has been set up successfully!`,
				fields: [
					{
						name: `→ Channel`,
						value: `${channel} (${channel.id})`,
					},
				],
				type: 'reply',
			},
			interaction,
		);
	};

	client.extras.createRoleSetup = async function (Schema: any, role: Role, interaction: Context) {
		Schema.findOne({ Guild: interaction.guildId }, async (err: any, data: { Role: bigint; save: () => void }) => {
			if (data) {
				data.Role = role.id;
				data.save();
			} else {
				new Schema({
					Guild: interaction.guildId,
					Role: role.id + '',
				}).save();
			}
		});

		client.extras.succNormal(
			{
				text: `Role has been set up successfully!`,
				fields: [
					{
						name: `→ Role`,
						value: `<&${role.id}> (${role.id})`,
					},
				],
				type: 'reply',
			},
			interaction,
		);
	};
};
