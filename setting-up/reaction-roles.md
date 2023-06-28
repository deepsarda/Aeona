---
description: You can give users the option to choose their roles.
---

# 📌 Reaction Roles

{% hint style="danger" %}
This Feature is currently disabled and will be brought back soon!
{% endhint %}

### Steps

#### 1. Adding the roles.

To add roles to Aeona you can run `/reactionroles add <name> <role> <emoji>`

**The options explained** \
`<name>` -> The name of the type of the roles you are adding. \
`<role>` -> The mention of the role you want to give. \
`<emoji>` -> The emoji to give the role.

Example: \
`/reactionroles add pings @MovieNight 🎥` \
`/reactionroles add pings @ChatRevive ❤️‍🩹`

<figure><img src="https://media.discordapp.net/attachments/1034419695794794561/1061921929398853652/image.png" alt=""><figcaption></figcaption></figure>

#### 2. Creating the list

Here you have to choices:-

**You can have your users select their roles by clicking buttons.** \
`/reactionroles button <name> channel` \
Example: `/reactionroles button pings #self-roles` \
\
**Or**

**The users can choose their desired roles from a drop down menu.**

`/reactionroles menu <name> channel` \
Example: `/reactionroles menu pings #self-roles`

<figure><img src="https://cdn.discordapp.com/attachments/1034419695060791340/1061922293342801981/image.png" alt=""><figcaption></figcaption></figure>

#### 3. Modifying the look.

To edit the embed run `/embed editembed channel messageid`.

Here _channel_ is the channel in which the embed you wish to modify is there. While _message id_ is the id of the message with the embed. \
Example: `/embed editembed self-roles 1061072341406330980`
