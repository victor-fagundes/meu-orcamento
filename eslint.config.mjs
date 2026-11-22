import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/**
 * Checagem oficial de tokens (docs/PROMPT-CURSOR-web.md, seção 8).
 * Só vale em src/app e src/components. Número em prop e atributo de <svg>
 * ficam de fora: os seletores não alcançam esses nós.
 */
const tokenSyntax = [
  {
    selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
    message:
      "Literal hexadecimal proibido. Use var(--token) ou um token do design system.",
  },
  {
    selector:
      "JSXAttribute[name.name='style'] Property[key.name=/^(padding|margin|gap|width|height|fontSize|lineHeight|borderRadius|top|right|bottom|left)$/] > Literal[value=/^-?\\d+(\\.\\d+)?(px|rem|dp)$/]",
    message:
      "Unidade px, rem ou dp proibida nesta propriedade de style. Use um token de espaço.",
  },
  {
    selector:
      "JSXAttribute[name.name='style'] Property[key.value=/^(padding|margin|gap|width|height|fontSize|lineHeight|borderRadius|top|right|bottom|left)$/] > Literal[value=/^-?\\d+(\\.\\d+)?(px|rem|dp)$/]",
    message:
      "Unidade px, rem ou dp proibida nesta propriedade de style. Use um token de espaço.",
  },
  {
    selector:
      "JSXAttribute[name.name='className'] Literal[value=/\\b[\\w-]+-\\[[^\\]]*(px|rem)\\]/]",
    message:
      "Classe com valor arbitrário em px ou rem proibida. Use um token.",
  },
];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/app/**/*.{js,jsx,ts,tsx}", "src/components/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...tokenSyntax],
    },
  },
];

export default eslintConfig;
