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
    default: "📘 **New Journal Entry Created**\n**Title**: {name}\n**Created by**: {user}\n**Link**: {link}"
  });
});

// Fetch the Discord webhook URL from module settings
const WEBHOOK_URL = game.settings.get("foundry-discord-notifier", "webhookURL");

// Function to send a message to Discord
async function sendToDiscord(content) {
  if (!WEBHOOK_URL) {
    console.error('Discord webhook URL is not set. Please configure it in the module settings.');
    return;
  }

  const payload = JSON.stringify({ content });

  try {
    const response = await fetch(WEBHOOK_URL, {
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

// Hook into the creation of new journal entries
Hooks.on("createJournalEntry", (journalEntry, options, userId) => {
  if (userId !== game.user.id) return;

  // Fetch the message format from module settings
  const messageFormat = game.settings.get("foundry-discord-notifier", "messageFormat");

  // Generate the link to the journal entry
  const link = `${window.location.origin}${game.journal.get(journalEntry.id).sheet.url}`;

  // Replace placeholders in the message format
  const message = messageFormat
    .replace('{name}', journalEntry.name)
    .replace('{user}', game.users.get(userId).name)
    .replace('{link}', `[View Entry](${link})`);

  sendToDiscord(message);
});


