import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export async function GET() {
  // Build the absolute path to your CSV file
  const filePath = path.join(process.cwd(), 'data', 'Prospectosteste.csv');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Arquivo CSV não encontrado' }, { status: 404 });
  }

  // Parse the CSV file and collect data
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        resolve(
          NextResponse.json({
            message: 'CSV processado com sucesso',
            data: results,
          })
        );
      })
      .on('error', (error) => {
        reject(NextResponse.json({ error: error.message }, { status: 500 }));
      });
  });
}
