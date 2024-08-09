import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
      'x-vercel-set-bypass-cookie': 'true; samesite=none' // Adjusted to a valid string
    }
  }
};

export default config;
