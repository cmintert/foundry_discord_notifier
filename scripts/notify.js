// Register settings in the Foundry VTT settings menu
Hooks.once('init', () => {
  game.settings.register("foundry-discord-notifier", "webhookURL", {
    name: "Discord Webhook URL",
    hint: "The URL of the Discord webhook to send notifications to.",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  game.settings.register("foundry-discord-notifier", "messageFormat", {
    name: "Notification Message Format",
    hint: "Customize the format of the notification message. Use {name}, {user}, {link} as placeholders.",
    scope: "world",
    config: true,
    type: String,
    default: "📘 **New Journal Entry Created**\n**Title**: {name}\n**Created by**: {user}\n <{link}>"
  });

  game.settings.register("foundry-discord-notifier", "secondWebhookURL", {
    name: "Second Discord Webhook URL",
    hint: "The URL of the second Discord webhook to send /dnote notifications to.",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

// Function to send a message to Discord
async function sendToDiscord(content, webhookURL) {
  const payload = JSON.stringify({ content });

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    if (!response.ok) {
      console.error(`Discord webhook error: ${response.status} ${response.statusText}`);
    } else {
      console.log('Notification sent to Discord successfully.');
    }
  } catch (error) {
    console.error('Error posting to Discord:', error);
  }
}

Hooks.on("ready", () => {
  // Hook into the creation of new journal entries
  Hooks.on("createJournalEntry", (journalEntry, options, userId) => {
    if (userId !== game.user.id) return;

    // Fetch the Discord webhook URL from module settings
    const WEBHOOK_URL = game.settings.get("foundry-discord-notifier", "webhookURL");
    if (!WEBHOOK_URL) {
      console.error('Discord webhook URL is not set. Please configure it in the module settings.');
      return;
    }

    // Fetch the message format from module settings
    const messageFormat = game.settings.get("foundry-discord-notifier", "messageFormat");

    // Safely generate the link to the journal entry
    const journalEntryData = game.journal.get(journalEntry.id);
    if (!journalEntryData) {
      console.error('Journal entry not found.');
      return;
    }
    const link = `${window.location.origin}`;

    // Replace placeholders in the message format
    const user = game.users.get(userId);
    if (!user) {
      console.error('User not found.');
      return;
    }
    const message = messageFormat
      .replace('{name}', journalEntry.name)
      .replace('{user}', user.name)
      .replace('{link}', `<${link}>`);

    sendToDiscord(message, WEBHOOK_URL);
  });

  // Register chat command
  Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
    if (messageText.startsWith("/dnote")) {
      const content = messageText.slice(6).trim(); // Extract text after "/dnote"
      if (content) {
        // get the current timestamp
        const timestamp = new Date().toLocaleString();

        // concat message with timestamp
        const message = `[${timestamp}] ${content}`;

        // Fetch the second Discord webhook URL from module settings
        const SECOND_WEBHOOK_URL = game.settings.get("foundry-discord-notifier", "secondWebhookURL");
        if (!SECOND_WEBHOOK_URL) {
          console.error('Second Discord webhook URL is not set. Please configure it in the module settings.');
          return false;
        }
        sendToDiscord(message, SECOND_WEBHOOK_URL);

        // Write content to chat with note
        const chatMessage = `${message} (Note: This message was sent to Discord)`;
        ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker(),
          content: chatMessage
        });
      }
      return false;
    }
  });
});