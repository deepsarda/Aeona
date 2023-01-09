---
description: You can send off users from your server using Aeona.
---

# 👋 Leave

### Steps

#### 1. Setting the channel.

To have Aeona make a channel for you to use it then run `+autosetup leavechannel` \
**Or** \
If you wish to set it to a particular channel then then run `+setup leavechannel`

{% hint style="danger" %}
If you are setting the channel make sure it is a text channel.
{% endhint %}

#### 2. Changing the leave message.

You can set the leave message by doing: `/setup leavemessage`

In the message you can use some variables: \
`{user:username}` - User's username \
`{user:discriminator}` - User's discriminator\
`{user:tag}` - User's tag\
`{user:mention}`- Mention a user

`{inviter:username}` - inviter's username\
`{inviter:discriminator}` - inviter's discriminator\
`{inviter:tag}` - inviter's tag\
`{inviter:mention}` - inviter's mention\
`{inviter:invites}` - inviter's invites\
`{inviter:invites:left}` - inviter's left invites

`{guild:name}`- Server name\
`{guild:members}` - Server members count

{% hint style="info" %}
Run `/setup leavemessage default` to set the leave message to the default message.
{% endhint %}
