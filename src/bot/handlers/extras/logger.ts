import { AmethystBot } from '@thereallonewolf/amethystframework';
import logChannels from '../../database/models/logChannels.js';

import type { Bot, DiscordAuditLogEntry, DiscordAutoModerationRule, Optionalize } from 'discordeno';
import { ApplicationCommand } from 'discordeno';
import { Channel } from 'discordeno';
import { Integration } from 'discordeno';
import { User } from 'discordeno';
import { ScheduledEvent } from 'discordeno';
import { Webhook } from 'discordeno';
import { DiscordAuditLog } from 'discordeno';
import { AuditLogEvents, BigString } from 'discordeno';

export default (client: AmethystBot) => {
	client.on('ready', () => {
		setInterval(() => {
			logChannels.find({}).then(async (logChannels) => {
				for (const logChannel of logChannels) {
					try {
						const guild = await client.helpers.getGuild(logChannel.Guild);

						if (guild) {
							const raw = await getAuditLog(client, guild.id, {
								limit: logChannel.LastLog ? 50 : 10,
							});

							const auditLog = raw.auditLogEntries.filter((auditLogEntry) =>
								logChannel.LastLog ? auditLogEntry.id > BigInt(logChannel.LastLog) : true,
							);

							if (auditLog.length > 0) {
								logChannel.LastLog = auditLog[0].id + '';
								logChannel.save();
							}
							for (const auditLogEntry of auditLog) {
								const channel = await client.extras.getLogs(guild.id);
								if (!channel) return;
								const user = await client.helpers.getUser(auditLogEntry.userId);
								let data = {
									title: '',
									desc: '',
									fields: [
										{
											name: `→ ID`,
											value: `${auditLogEntry.targetId}`,
										},
										{
											name: `→ Reason`,
											value: `${auditLogEntry.reason ?? 'No reason given'}`,
										},
										{
											name: `→ By`,
											value: `${
												user
													? `${user.username}#${user.discriminator}(${user.id})`
													: 'Unable to find the responsible user.'
											}`,
										},
									],
								};
								if (auditLogEntry.actionType == AuditLogEvents.ChannelCreate)
									data = {
										...data,
										title: `🔧 Channel Created`,
										desc: `A channel has been Created.`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.ChannelDelete)
									data = {
										...data,
										title: `🔧 Channel Deleted`,
										desc: `A channel has been deleted.`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteCreate)
									data = {
										...data,
										title: `🔧 Channel Overide Created`,
										desc: `A channel has had a overide created.`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
											{
												name: `→ Modified Settings`,
												value: `${
													auditLogEntry.options.type == 1
														? `<@${auditLogEntry.options.id}>`
														: auditLogEntry.options.roleName
												}`,
											},
										],
									};
								if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteDelete)
									data = {
										...data,
										title: `🔧 Channel Overide Delete`,
										desc: `A channel has had a overide deleted.`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
											{
												name: `→ Modified Settings`,
												value: `${
													auditLogEntry.options.type == 1
														? `<@${auditLogEntry.options.id}>`
														: auditLogEntry.options.roleName
												}`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.ChannelOverwriteUpdate)
									data = {
										...data,
										title: `🔧 Channel Overide Update`,
										desc: `A channel has had a overide updated.`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
											{
												name: `→ Modified Settings`,
												value: `${
													auditLogEntry.options.type == 1
														? `<@${auditLogEntry.options.id}>`
														: auditLogEntry.options.roleName
												}`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.ChannelUpdate)
									data = {
										...data,
										title: `🔧 Channel Update`,
										desc: `A channel has been updated`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Channel`,
												value: `<#${auditLogEntry.targetId}>`,
											},
											{
												name: `→ Modified Settings`,
												value: `${auditLogEntry.changes
													.map((change) => `Value: ${change.key} ${change.old}→${change.new} `)
													.join(' \n')}`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.GuildUpdate)
									data = {
										...data,
										title: `🔧 Guild Updated`,
										desc: `Some settings for this server has been changed.`,
										fields: [
											...data.fields,
											{
												name: `→ Modified Settings`,
												value: `${auditLogEntry.changes
													.map((change) => `Value: ${change.key} ${change.old}→${change.new} `)
													.join(' \n')}`,
											},
										],
									};

								if (auditLogEntry.actionType == AuditLogEvents.RoleCreate)
									data = {
										...data,
										title: `🔧 Role Created`,
										desc: `A role has been created`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Role`,
												value: `<&${auditLogEntry.targetId}>`,
											},
										],
									};
								if (auditLogEntry.actionType == AuditLogEvents.RoleCreate)
									data = {
										...data,
										title: `🔧 Role Deleted`,
										desc: `A role has been deleted`,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Role`,
												value: `<&${auditLogEntry.targetId}>`,
											},
										],
									};
								if (auditLogEntry.actionType == AuditLogEvents.RoleUpdate)
									data = {
										...data,
										title: `🔧 Role Updated`,
										desc: `A role has been updated `,
										fields: [
											...data.fields,
											{
												name: `→ Name`,
												value: `${auditLogEntry.changes[0].key}`,
											},
											{
												name: `→ Role`,
												value: `<&${auditLogEntry.targetId}>`,
											},
											{
												name: `→ Modified Settings`,
												value: `${auditLogEntry.changes
													.map((change) => `Value: ${change.key} ${change.old}→${change.new} `)
													.join(' \n')}`,
											},
										],
									};
								client.extras.embed(data, channel).catch((e) => console.log(e));
							}
						}
					} catch (e) {
						console.log(e);
					}
				}
			});
		}, 30 * 1000);
	});
};

export type AuditLog = {
	auditLogEntries: AuditLogEntry[];
	autoModerationRules?: AutoModerationRule[];
	guildScheduledEvents?: ScheduledEvent[];
	integrations: Partial<Omit<Integration, 'guildId'>>[];
	threads: Channel[];
	users: User[];
	webhooks: Webhook[];
	applicationCommands: ApplicationCommand[];
};

/**
 * Gets a guild's audit log.
 *
 * @param bot - The bot instance to use to make the request.
 * @param guildId - The ID of the guild to get the audit log of.
 * @param options - The parameters for the fetching of the audit log.
 * @returns An instance of {@link AuditLog}.
 *
 * @remarks
 * Requires the `VIEW_AUDIT_LOG` permission.
 *
 */
export async function getAuditLog(bot: Bot, guildId: BigString, options?: GetGuildAuditLog): Promise<AuditLog> {
	if (options?.limit) {
		options.limit = options.limit >= 1 && options.limit <= 100 ? options.limit : 50;
	}

	const result = await bot.rest.runMethod<DiscordAuditLog>(
		bot.rest,
		'GET',
		bot.constants.routes.GUILD_AUDIT_LOGS(guildId, options),
	);

	const id = bot.transformers.snowflake(guildId);
	return {
		auditLogEntries: result.audit_log_entries.map((entry) => transformAuditLogEntry(bot, entry)),
		autoModerationRules: result.auto_moderation_rules?.map((rule) => bot.transformers.automodRule(bot, rule)),
		guildScheduledEvents: result.guild_scheduled_events?.map((event) => bot.transformers.scheduledEvent(bot, event)),
		integrations: result.integrations.map((integration) => ({
			id: integration.id ? bot.transformers.snowflake(integration.id) : undefined,
			name: integration.name,
			type: integration.type,
			enabled: integration.enabled,
			syncing: integration.syncing,
			roleId: integration.role_id ? bot.transformers.snowflake(integration.role_id) : undefined,
			enableEmoticons: integration.enable_emoticons,
			expireBehavior: integration.expire_behavior,
			expireGracePeriod: integration.expire_grace_period,
			user: integration.user ? bot.transformers.user(bot, integration.user) : undefined,
			account: integration.account
				? {
						id: bot.transformers.snowflake(integration.account.id),
						name: integration.account.name,
				  }
				: undefined,
			syncedAt: integration.synced_at ? Date.parse(integration.synced_at) : undefined,
			subscriberCount: integration.subscriber_count,
			revoked: integration.revoked,
			application: integration.application
				? {
						id: bot.transformers.snowflake(integration.application.id),
						name: integration.application.name,
						icon: integration.application.icon ? bot.utils.iconHashToBigInt(integration.application.icon) : undefined,
						description: integration.application.description,
						bot: integration.application.bot ? bot.transformers.user(bot, integration.application.bot) : undefined,
				  }
				: undefined,
		})),
		threads: result.threads.map((thread) => bot.transformers.channel(bot, { channel: thread, guildId: id })),
		users: result.users.map((user) => bot.transformers.user(bot, user)),
		webhooks: result.webhooks.map((hook) => bot.transformers.webhook(bot, hook)),
		applicationCommands: result.application_commands.map((applicationCommand) =>
			bot.transformers.applicationCommand(bot, applicationCommand),
		),
	};
}

/** https://discord.com/developers/docs/Settingss/audit-log#get-guild-audit-log-query-string-parameters */
export interface GetGuildAuditLog {
	/** Entries from a specific user ID */
	userId?: BigString | string;
	/** Entries for a specific audit log event */
	actionType?: AuditLogEvents;
	/** Entries that preceded a specific audit log entry ID */
	before?: BigString | string;
	/** Maximum number of entries (between 1-100) to return, defaults to 50 */
	limit?: number;
}

export function transformAuditLogEntry(bot: Bot, payload: DiscordAuditLogEntry) {
	const auditLogEntry = {
		id: bot.transformers.snowflake(payload.id),
		changes: payload.changes?.map((change) => {
			switch (change.key) {
				case '$add':
				case '$remove':
					return {
						key: change.key,
						new: change.new_value?.map((val) => ({
							id: val.id ? bot.transformers.snowflake(val.id) : undefined,
							name: val.name,
						})),
						old: change.old_value?.map((val) => ({
							id: val?.id ? bot.transformers.snowflake(val.id) : undefined,
							name: val?.name,
						})),
					};

				case 'rules_channel_id':
				case 'public_updates_channel_id':
				case 'owner_id':
				case 'widget_channel_id':
				case 'system_channel_id':
				case 'application_id':
				case 'permissions':
				case 'allow':
				case 'deny':
				case 'channel_id':
				case 'inviter_id':
				case 'id':
					return {
						key: change.key,
						old: change.old_value ? bot.transformers.snowflake(change.old_value) : undefined,
						new: change.new_value ? bot.transformers.snowflake(change.new_value) : undefined,
					};
				case 'avatar_hash':
				case 'name':
				case 'description':
				case 'preferred_locale':
				case 'region':
				case 'afk_channel_id':
				case 'vanity_url_code':
				case 'topic':
				case 'code':
				case 'nick':
				case 'location':
				case 'discovery_splash_hash':
				case 'banner_hash':
				case 'icon_hash':
				case 'image_hash':
				case 'splash_hash':
					return {
						key: change.key,
						old: change.old_value,
						new: change.new_value,
					};
				case 'afk_timeout':
				case 'mfa_level':
				case 'verification_level':
				case 'explicit_content_filter':
				case 'default_message_notifications':
				case 'prune_delete_days':
				case 'position':
				case 'bitrate':
				case 'rate_limit_per_user':
				case 'color':
				case 'max_uses':
				case 'uses':
				case 'max_age':
				case 'expire_behavior':
				case 'expire_grace_period':
				case 'user_limit':
				case 'privacy_level':
				case 'entity_type':
				case 'status':
					return {
						key: change.key,
						old: change.old_value ? Number(change.old_value) : undefined,
						new: change.new_value ? Number(change.new_value) : undefined,
					};
				case 'widget_enabled':
				case 'nsfw':
				case 'hoist':
				case 'mentionable':
				case 'temporary':
				case 'deaf':
				case 'mute':
				case 'enable_emoticons':
					return {
						key: change.key,
						old: change.old_value ?? false,
						new: change.new_value ?? false,
					};
				case 'permission_overwrites':
					return {
						key: change.key,
						old: change.old_value,
						new: change.new_value,
					};
				default:
					return {
						key: change.key,
						old: change.old_value,
						new: change.new_value,
					};
			}
		}),
		userId: payload.user_id ? bot.transformers.snowflake(payload.user_id) : undefined,
		targetId: payload.target_id ? bot.transformers.snowflake(payload.target_id) : undefined,
		actionType: payload.action_type,
		options: payload.options
			? {
					deleteMemberDays: payload.options.delete_member_days ? Number(payload.options.delete_member_days) : 0,
					membersRemoved: payload.options.members_removed ? Number(payload.options.members_removed) : 0,
					channelId: payload.options.channel_id ? bot.transformers.snowflake(payload.options.channel_id) : undefined,
					messageId: payload.options.message_id ? bot.transformers.snowflake(payload.options.message_id) : undefined,
					count: payload.options.count ? Number(payload.options.count) : 0,
					id: payload.options.id ? bot.transformers.snowflake(payload.options.id) : undefined,
					type: Number(payload.options.type),
					roleName: payload.options.role_name,
			  }
			: undefined,
		reason: payload.reason,
	};

	return auditLogEntry as Optionalize<typeof auditLogEntry>;
}
//eslint-disable-next-line
export interface AuditLogEntry extends ReturnType<typeof transformAuditLogEntry> {}

export function transformAutoModerationRule(bot: Bot, payload: DiscordAutoModerationRule) {
	const rule = {
		name: payload.name,
		eventType: payload.event_type,
		triggerType: payload.trigger_type,
		enabled: payload.enabled,
		id: bot.transformers.snowflake(payload.id),
		guildId: bot.transformers.snowflake(payload.guild_id),
		creatorId: bot.transformers.snowflake(payload.creator_id),
		exemptRoles: payload.exempt_roles.map((id) => bot.transformers.snowflake(id)),
		exemptChannels: payload.exempt_channels.map((id) => bot.transformers.snowflake(id)),
		triggerMetadata: payload.trigger_metadata
			? {
					keywordFilter: payload.trigger_metadata.keyword_filter,
					presets: payload.trigger_metadata.presets,
					allowList: payload.trigger_metadata.allow_list,
					mentionTotalLimit: payload.trigger_metadata.mention_total_limit,
			  }
			: undefined,
		actions: payload.actions.map((action) => ({
			type: action.type,
			metadata: action.metadata
				? {
						channelId: action.metadata.channel_id ? bot.transformers.snowflake(action.metadata.channel_id) : undefined,
						durationSeconds: action.metadata.duration_seconds,
				  }
				: undefined,
		})),
	};

	return rule as Optionalize<typeof rule>;
}
//eslint-disable-next-line
export interface AutoModerationRule extends ReturnType<typeof transformAutoModerationRule> {}
