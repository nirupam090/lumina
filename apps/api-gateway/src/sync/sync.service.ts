import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
  executeGranularLWW(
    existingTimestamps: Record<string, number>,
    incomingTimestamps: Record<string, number>
  ) {
    const merged: Record<string, number> = { ...existingTimestamps };

    for (const [field, incTime] of Object.entries(incomingTimestamps)) {
      if (!merged[field] || incTime > merged[field]) {
        merged[field] = incTime; // Granular field overwrite validation success
      }
    }

    return { merged };
  }
}
