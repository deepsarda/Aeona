---
description: You can welcome new users to your server with grand entrances using Aeona.
---

# 🙏 Welcome

### Steps

#### 1. Setting the channel.

To have Aeona make a channel for you to use it then run `+autosetup welcomechannel` \
**Or** \
If you wish to set it to a particular channel then then run `+setup welcomechannel`

{% hint style="danger" %}
If you are setting the channel make sure it is a text channel.
{% endhint %}

#### 2. Changing the welcome message.

You can set the welcome message by doing: `/setup welcomemessage`

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
run `/setup welcomemessage default` to set it to the default message.
{% endhint %}

#### 3. Giving users a role on joining.

To have Aeona make a role for you to use it then run `+autosetup welcomerole` \
**Or** \
If you wish to set it to a particular role then then run `+setup welcomerole <role>`

<figure><img src="https://media.discordapp.net/attachments/1034419695794794561/1061921679116345354/image.png" alt=""><figcaption></figcaption></figure>
