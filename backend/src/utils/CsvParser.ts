import { Readable } from 'stream';
import csv from 'csv-parser';
import { RawGPSPoint } from '../interfaces/ICalculationService.js';

export function parseCsvBuffer(buffer: Buffer): Promise<RawGPSPoint[]> {
  return new Promise((resolve, reject) => {
    const results: RawGPSPoint[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on('data', (data: Record<string, string>) => {
        const row: Record<string, string> = {};
        for (const key of Object.keys(data)) {
          row[key.trim().toLowerCase()] = data[key] ? String(data[key]).trim() : '';
        }

        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        const timeStr = row.timestamp;
        const ign = row.ignition ? row.ignition.toLowerCase() : 'off';

        if (!isNaN(lat) && !isNaN(lng) && timeStr) {
          results.push({
            latitude: lat,
            longitude: lng,
            timestamp: new Date(timeStr),
            ignition: ign === 'on' ? 'on' : 'off',
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}
