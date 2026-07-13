import { Readable } from 'stream';
import csv from 'csv-parser';
import { RawGPSPoint } from '../services/ICalculationService';

export function parseCsvBuffer(buffer: Buffer): Promise<RawGPSPoint[]> {
  return new Promise((resolve, reject) => {
    const results: RawGPSPoint[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on('data', (data) => {
        // Standardize keys (trim keys and values)
        const row: any = {};
        for (const key of Object.keys(data)) {
          row[key.trim().toLowerCase()] = data[key] ? data[key].trim() : '';
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
      .on('error', (error) => {
        reject(error);
      });
  });
}
