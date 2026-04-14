import * as fs from "fs";
import * as path from "path";

export interface CsvRow {
  [key: string]: string;
}

/**
 * Lee un archivo CSV y retorna un array de objetos tipados.
 * La primera fila del CSV se usa como headers (claves del objeto).
 * @param filePath Ruta relativa al archivo CSV desde la raíz del proyecto
 * @returns Array de objetos donde cada objeto representa una fila del CSV
 */
export function readCsv<T extends CsvRow>(filePath: string): T[] {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Archivo CSV no encontrado: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, "utf-8").trim();
  const lines = content.split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error(
      `El archivo CSV debe tener al menos una fila de headers y una de datos: ${filePath}`,
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      throw new Error(
        `Fila ${i + 1} del CSV tiene ${values.length} columnas, se esperaban ${headers.length}: ${filePath}`,
      );
    }
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    rows.push(row as T);
  }

  return rows;
}
