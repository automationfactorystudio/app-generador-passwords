/**
 * Definición de tipos y estructuras de datos para el Premium Crypto Engine.
 */

export type ThemeMode = "light" | "dark";

export type GenMethod = "compleja" | "frase" | "pronunciable";

export interface ComplexConfig {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidConfusing: boolean;
}

export interface PhraseConfig {
  wordCount: number;
  delimiter: string;
  capitalizeInitials: boolean;
  extraSuffix: boolean; // añade un número y símbolo al final para cumplir requisitos rígidos
}

export interface PronounceableConfig {
  length: number; // longitud en caracteres
}
