import { AmethystBot, Components } from '@thereallonewolf/amethystframework';
export default (client: AmethystBot) => {
	client.extras.buttonReactions = function (id: any, reactions: any[]) {
		const comp = new Components();
		for (const reaction of reactions) {
			comp.addButton('', 'Secondary', `reaction_button-${reaction}`, {
				emoji: `${reaction}`,
			});
		}

		return comp;
	};
};
