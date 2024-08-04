
# Foundry VTT Discord Notifier

Overview
--------
The Foundry VTT Discord Notifier module allows Game Masters (GMs) to automatically send notifications to a specified Discord channel when certain events occur in their Foundry Virtual Tabletop (VTT) game. This integration enhances communication and organization by sending messages through Discord webhooks. The module can notify about the creation of new journal entries and also supports a custom chat command for sending direct messages to Discord.

Features
--------
1. Automatic Notifications for Journal Entries:
   - When a new journal entry is created, a notification is sent to a specified Discord channel. The message includes the title of the journal entry, the creator's username, and a link to the journal entry.

2. Custom Chat Command (/dnote):
   - Players and GMs can send messages to a separate Discord channel using the /dnote chat command. This is useful for out-of-character notes or important announcements that need to be logged in Discord.

Installation
------------
1. Download and Install:
   - Download the module and place it in your Foundry VTT modules directory.
   - In the Foundry VTT interface, navigate to Configuration > Manage Modules and enable "Foundry Discord Notifier".

2. Configuration:
   - Go to Game Settings > Configure Settings > Module Settings.
   - Set the Discord Webhook URL to the webhook URL of the Discord channel where you want to send journal entry notifications.
   - Customize the Notification Message Format if desired. Use {name}, {user}, and {link} as placeholders.
   - Set the Second Discord Webhook URL for the /dnote chat command notifications.

Usage
-----
1. Automatic Journal Notifications:
   - Once configured, the module automatically sends a notification to the designated Discord channel whenever a new journal entry is created. The message format can be customized to include the journal entry's title, creator, and a link to the entry.

2. Sending Notes via Chat Command:
   - Use the /dnote command followed by your message in the Foundry VTT chat to send a message to the second Discord webhook URL. For example, /dnote Remember to discuss the next session schedule will send the message to Discord and also display it in the Foundry VTT chat with a note indicating it was sent to Discord.

Example
-------
- Journal Entry Notification:
  - Discord Message: 
    📘 **New Journal Entry Created**
    **Title**: A Mysterious Artifact
    **Created by**: GMName
    <http://your-foundry-vtt-instance.com>

- Note via /dnote:
  - Discord Message:
    [08/04/2024, 10:00 AM] Remember to bring your character sheets to the next session.
  - Foundry VTT Chat:
    [08/04/2024, 10:00 AM] Remember to bring your character sheets to the next session. (Note: This message was sent to Discord)

Troubleshooting
---------------
- Ensure that the Discord Webhook URLs are correctly configured in the module settings.
- Verify that the Discord webhook permissions and settings allow for messages to be received.

License
-------
This module is distributed under the MIT License. Please see the LICENSE file for details.

Acknowledgments
---------------
Special thanks to the Foundry VTT community for their continued support and contributions.

Note: The above instructions assume you have basic familiarity with Foundry VTT and Discord webhooks. For further assistance, please consult the official documentation or community forums.
