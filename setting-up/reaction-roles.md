---
description: You can set up reactions menus to give users the option to choose their roles.
---

# 📌 Reaction Roles

## How do I set it up?

### Step 1: Adding the roles

To add roles to Aeona you can run `/reactionroles add <name> <@role> <emoji>`

* `<name>` -> The name of the type of the roles you are adding.&#x20;
* `<@role>` -> The role you want to give.&#x20;
* `<emoji>` -> The emoji to give the role.

#### Example:

`/reactionroles add pings @MovieNight 🎥` \
`/reactionroles add pings @ChatRevive ❤️‍🩹`

### Step 2: Creating the list

Here you have two choices:

**You can have your users select their roles by clicking buttons.** \
`/reactionroles button <name> channel` \
Example: `/reactionroles button pings #self-roles` \
\
**OR**

**The users can choose their desired roles from a drop down menu.**

`/reactionroles menu <name> channel` \
Example: `/reactionroles menu pings #self-roles`

### Step 3: Modifying the look

To edit the embed run `/embed editembed channel messageid`.

Here _channel_ is the channel in which the embed you wish to modify is there. While _message id_ is the id of the message with the embed. \
Example: `/embed editembed self-roles 1061072341406330980`
