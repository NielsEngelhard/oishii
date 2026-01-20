import en from './messages/en.json';

// Type for the message structure based on en.json (source of truth)
export type Messages = typeof en;

// Declare module augmentation for next-intl to enable type-safe translations
declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
