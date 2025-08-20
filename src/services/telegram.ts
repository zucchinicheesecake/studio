
'use server';
/**
 * @fileOverview A service for interacting with the Telegram Bot API.
 */

import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn("TELEGRAM_BOT_TOKEN is not set. Telegram service will be disabled.");
}

// Initialize the bot. We don't use polling because we'll interact via webhooks or direct API calls.
const bot = token ? new TelegramBot(token) : null;

/**
 * Sends a message to a specified Telegram chat.
 * @param chatId The ID of the chat to send the message to.
 * @param text The message text to send.
 * @returns A promise that resolves with the sent message object.
 */
export async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!bot) {
    throw new Error('Telegram bot is not initialized. Please set TELEGRAM_BOT_TOKEN.');
  }
  return bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}
