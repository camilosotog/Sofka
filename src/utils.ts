/**
 * Utilidades y constantes para tests
 */

export const TEST_TIMEOUT = 30000; // 30 segundos
export const NAVIGATION_TIMEOUT = 10000; // 10 segundos
export const ELEMENT_TIMEOUT = 5000; // 5 segundos

/**
 * Espera un tiempo determinado
 * @param ms Milisegundos a esperar
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retorna un valor aleatorio entre min y max
 * @param min Valor mínimo
 * @param max Valor máximo
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
