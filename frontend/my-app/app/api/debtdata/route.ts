import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export async function GET() {
  // Build the absolute path to your Dividasteste.csv file
  const filePath = path.join(process.cwd(), 'data', 'Dividasteste.csv');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Dividasteste.csv não encontrado' }, { status: 404 });
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
            message: 'Dividasteste.csv processado com sucesso',
            data: results,
          })
        );
      })
      .on('error', (error) => {
        reject(NextResponse.json({ error: error.message }, { status: 500 }));
      });
  });
}
