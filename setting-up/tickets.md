---
description: Setup the ticket system for your server.
coverY: 0
---

# 🔓 Tickets

{% hint style="danger" %}
This Feature is currently disabled and will be brought back soon!
{% endhint %}

### Steps:

### 1. Setting the tickets configuration.

Run `/setup tickets <category> <role> <channel> <logs>`

Where `<catergory>` is the category you which to make the ticket channels in.

`<role>` is the role for the support staff.

`<channel>`  is the channel where the ticket creation menu is sent.

`<logs>` is the channel where all the ticket logs are sent.

<figure><img src="https://media.discordapp.net/attachments/1062757801832742923/1062972940330729482/image.png" alt=""><figcaption></figcaption></figure>

### 2. Creating a ticket panel.

To have Aeona make a message for you then run `+autosetup ticketpanel`

**Or**

If you wish to make the panel then then run `+setup ticketpanel`

### 3. Changing the default ticket message.

To change it run `/setup ticketmessage <open/close> <message>` .

<figure><img src="https://media.discordapp.net/attachments/1062757801832742923/1062975186313420860/image.png" alt=""><figcaption></figcaption></figure>

#### 4. Editing the ticket panel.

To edit the embed run `/embed editembed channel messageid`.

Here _channel_ is the channel in which the embed you wish to modify is there. While _message id_ is the id of the message with the embed. \
Example: `/embed editembed create-ticket 1061072341406330980`

