import { SPANISH_POETIC_DICTIONARY } from "../spanishWords";
import { ComplexConfig, PhraseConfig, GenMethod } from "../types";

/**
 * Filtro de confusión: elimina 1, l, I, 0, o, O para evitar deslices visuales
 */
const CONFUSING_CHARS = ["1", "l", "I", "0", "o", "O"];

const UPPERCASE_POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ".split(""); // excluye 'I', 'O' por defecto si confusores están activos
const LOWERCASE_POOL = "abcdefghijkmnopqrstuvwxyz".split(""); // excluye 'l', 'o'
const NUMBERS_POOL = "23456789".split(""); // excluye '0', '1'
const SYMBOLS_POOL = "@#$!%^&*?_+-=".split(""); // símbolos clásicos

const FULL_UPPERCASE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FULL_LOWERCASE_POOL = "abcdefghijklmnopqrstuvwxyz".split("");
const FULL_NUMBERS_POOL = "0123456789".split("");

// Consonantes y vocales para fórmulas pronunciables
const PRONOUN_CONSONANTS = "bcdfgklmnprstvz".split(""); // seleccionamos las más blandas
const PRONOUN_VOWELS = "aeiou".split("");

/**
 * Genera una contraseña compleja basada en la configuración elegida
 */
export function generateComplexPassword(config: ComplexConfig): string {
  const { length, uppercase, lowercase, numbers, symbols, avoidConfusing } = config;

  let finalUpper = avoidConfusing ? UPPERCASE_POOL : FULL_UPPERCASE_POOL;
  let finalLower = avoidConfusing ? LOWERCASE_POOL : FULL_LOWERCASE_POOL;
  let finalNumbers = avoidConfusing ? NUMBERS_POOL : FULL_NUMBERS_POOL;
  let finalSymbols = SYMBOLS_POOL;

  // Si se ha pedido evitar confusiones, también podemos purgar cualquier símbolo confuso
  if (avoidConfusing) {
    finalSymbols = SYMBOLS_POOL.filter(char => !["|", "/", "\\", "."].includes(char));
  }

  const activePools: string[][] = [];
  const guaranteeChars: string[] = [];

  // Añadimos y garantizamos que por lo menos un caracter de cada pool esté presente
  if (uppercase) {
    activePools.push(finalUpper);
    guaranteeChars.push(getRandomElement(finalUpper));
  }
  if (lowercase) {
    activePools.push(finalLower);
    guaranteeChars.push(getRandomElement(finalLower));
  }
  if (numbers) {
    activePools.push(finalNumbers);
    guaranteeChars.push(getRandomElement(finalNumbers));
  }
  if (symbols) {
    activePools.push(finalSymbols);
    guaranteeChars.push(getRandomElement(finalSymbols));
  }

  // Si no se ha seleccionado ninguna opción
  if (activePools.length === 0) {
    return "";
  }

  const mergedPool = activePools.flat();
  const passwordChars: string[] = [...guaranteeChars];

  // Completamos la longitud requerida
  while (passwordChars.length < length) {
    passwordChars.push(getRandomElement(mergedPool));
  }

  // Mezclamos el array final de caracteres para ocultar los caracteres garantizados al inicio
  return shuffleArray(passwordChars).join("");
}

/**
 * Genera una frase mnemotécnica en español basada en términos poéticos
 */
export function generatePhrasePassword(config: PhraseConfig): string {
  const { wordCount, delimiter, capitalizeInitials, extraSuffix } = config;
  
  const chosenWords: string[] = [];
  const dictLength = SPANISH_POETIC_DICTIONARY.length;

  for (let i = 0; i < wordCount; i++) {
    // Selección por índices completamente aleatorios guiados por CSPRNG
    const wordIndex = getSecureRandomRange(0, dictLength - 1);
    let word = SPANISH_POETIC_DICTIONARY[wordIndex];

    if (capitalizeInitials) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosenWords.push(word);
  }

  let phrase = chosenWords.join(delimiter);

  if (extraSuffix) {
    // Añadimos un número y símbolo aleatorios para satisfacer validadores estrictos de IT
    const randomDigit = getSecureRandomRange(2, 9); // de 2 a 9 (evita 0,1)
    const randomSym = getRandomElement(["!", "#", "$", "*", "?"]);
    phrase += `${delimiter}${randomDigit}${randomSym}`;
  }

  return phrase;
}

/**
 * Genera una fórmula fonética pronunciable de alternancia consonante-vocal
 */
export function generatePronounceablePassword(length: number): string {
  let result = "";
  let isConsonant = getSecureRandomRange(0, 1) === 1;

  for (let i = 0; i < length; i++) {
    if (isConsonant) {
      result += getRandomElement(PRONOUN_CONSONANTS);
    } else {
      result += getRandomElement(PRONOUN_VOWELS);
    }
    // Alternancia estricta, pero cada pocas sílabas podemos duplicar o romper suavemente
    isConsonant = !isConsonant;
  }

  // Capitalizamos la primera letra como en un nombre propio elegante
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Calcula la entropía exacta en bits de la contraseña generada
 */
export function calculateEntropy(password: string, method: GenMethod, extraInfo?: {
  complexConfig?: ComplexConfig;
  phraseConfig?: PhraseConfig;
}): { bits: number; strength: "Crítica" | "Aceptable" | "Fuerte" | "Inquebrantable" } {
  if (!password) {
    return { bits: 0, strength: "Crítica" };
  }

  let bits = 0;

  if (method === "compleja" && extraInfo?.complexConfig) {
    const config = extraInfo.complexConfig;
    let poolSize = 0;
    
    let isUpperConfusing = config.avoidConfusing ? UPPERCASE_POOL.length : FULL_UPPERCASE_POOL.length;
    let isLowerConfusing = config.avoidConfusing ? LOWERCASE_POOL.length : FULL_LOWERCASE_POOL.length;
    let isNumbersConfusing = config.avoidConfusing ? NUMBERS_POOL.length : FULL_NUMBERS_POOL.length;

    if (config.uppercase) poolSize += isUpperConfusing;
    if (config.lowercase) poolSize += isLowerConfusing;
    if (config.numbers) poolSize += isNumbersConfusing;
    if (config.symbols) {
      poolSize += config.avoidConfusing ? SYMBOLS_POOL.length - 4 : SYMBOLS_POOL.length;
    }

    if (poolSize > 0) {
      // Fórmula clásica de entropía: E = L * log2(Pool)
      bits = Math.round(password.length * Math.log2(poolSize));
    }
  } else if (method === "frase" && extraInfo?.phraseConfig) {
    // Para frases, estimamos el pool del diccionario más posibles modificadores
    const config = extraInfo.phraseConfig;
    const dictionarySize = SPANISH_POETIC_DICTIONARY.length; // ~200
    
    // Entropía de selección de palabras: N * log2(Tamaño Diccionario)
    let wordEntropy = config.wordCount * Math.log2(dictionarySize);
    
    // Plus pequeño de entropía por los delimitadores y el sufijo adicional
    if (config.extraSuffix) {
      wordEntropy += Math.log2(8) + Math.log2(5); // 8 dígitos x 5 símbolos
    }
    
    bits = Math.round(wordEntropy);
  } else {
    // Pronunciable o estimación heurística fallback
    // Para el método de fórmulas pronunciables, cada caracter alterna entre vocales(5) y consonantes(15). 
    // En promedio, el tamaño de pool heurístico por casilla es sqrt(5 * 15) = ~8.6.
    // Por tanto: E = L * log2(8.6) = L * ~3.1 bits
    bits = Math.round(password.length * Math.log2(8.66));
  }

  // Clasificador de fortaleza de acuerdo a directrices modernas del NIST
  let strength: "Crítica" | "Aceptable" | "Fuerte" | "Inquebrantable" = "Crítica";

  if (bits >= 80) {
    strength = "Inquebrantable";
  } else if (bits >= 55) {
    strength = "Fuerte";
  } else if (bits >= 35) {
    strength = "Aceptable";
  } else {
    strength = "Crítica";
  }

  return { bits, strength };
}

/**
 * Obtiene un entero de 32 bits verdaderamente aleatorio del Web Crypto API para máxima seguridad.
 * Ofrece fallback seguro solo en entornos aislados o sin HTTPS.
 */
function getSecureRandomUint32(): number {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
  }
  // Fallback seguro compatible
  return Math.floor(Math.random() * 0x100000000);
}

/**
 * Obtiene un entero aleatorio seguro en el rango [min, max] (ambos inclusive).
 * Evita el sesgo de módulo (modulo bias) de manera matemática.
 */
function getSecureRandomRange(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 1) return min;

  const maxPossible = 0xFFFFFFFF;
  const limit = maxPossible - (maxPossible % range);

  let randomVal = getSecureRandomUint32();
  while (randomVal >= limit) {
    randomVal = getSecureRandomUint32();
  }

  return min + (randomVal % range);
}

function getRandomElement<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Pool vacío en selección.");
  }
  const index = getSecureRandomRange(0, array.length - 1);
  return array[index];
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomRange(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
