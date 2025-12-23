/**
 * Theme Export View Component
 * 
 * Inline export view within Theme Builder showing full token schema with syntax highlighting.
 */

import * as React from "react";
import { Copy, Download, Check } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
// Prism theme will be applied via inline styles for better dark mode support
import { WexButton } from "@/components/wex";
import { useThemeOverrides } from "@/docs/hooks/useThemeOverrides";
import {
  PALETTE_RAMPS,
  SEMANTIC_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  NEUTRAL_TOKENS,
  COMPONENT_TOKENS,
} from "@/docs/data/tokenRegistry";
import { parseHSL, formatHSL } from "@/docs/utils/color-convert";

// Standard lightness values for palette ramps
const PALETTE_LIGHTNESS_STEPS: Record<number, number> = {
  50: 97,
  100: 93,
  200: 85,
  300: 72,
  400: 56,
  500: 45,
  600: 38,
  700: 32,
  800: 26,
  900: 20,
};

/**
 * Generate full CSS with all tokens, applying overrides where they exist
 */
function generateFullCSS(overrides: { light: Record<string, string>; dark: Record<string, string> }): string {
  let css = ":root {\n";
  
  const getTokenValue = (tokenName: string, defaultValue: string, mode: "light" | "dark"): string => {
    return overrides[mode][tokenName] || defaultValue;
  };

  const generateRampShades = (rampName: string, defaultHue: number, defaultSaturation: number, mode: "light" | "dark"): Record<string, string> => {
    const shades: Record<string, string> = {};
    const token500 = `--wex-palette-${rampName}-500`;
    
    const override500 = overrides[mode][token500];
    let rampHue = defaultHue;
    let rampSaturation = defaultSaturation;
    let baseLightness = PALETTE_LIGHTNESS_STEPS[500];
    
    if (override500) {
      const hsl = parseHSL(override500);
      if (hsl) {
        rampHue = hsl.h;
        rampSaturation = hsl.s;
        baseLightness = hsl.l;
      }
    }
    
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((shade) => {
      const token = `--wex-palette-${rampName}-${shade}`;
      
      if (overrides[mode][token]) {
        shades[token] = overrides[mode][token];
      } else {
        const lightness = shade === 500 ? baseLightness : PALETTE_LIGHTNESS_STEPS[shade];
        shades[token] = formatHSL({ h: rampHue, s: rampSaturation, l: lightness });
      }
    });
    
    return shades;
  };

  const allTokens: Record<string, string> = {};

  PALETTE_RAMPS.forEach((ramp) => {
    const rampShades = generateRampShades(ramp.name, ramp.hue, ramp.saturation, "light");
    Object.assign(allTokens, rampShades);
  });

  NEUTRAL_TOKENS.forEach((neutral) => {
    allTokens[neutral.token] = getTokenValue(neutral.token, neutral.value, "light");
  });

  SEMANTIC_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  SURFACE_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  TEXT_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  // Layer 3 Component tokens
  COMPONENT_TOKENS.forEach((token) => {
    if (token.type === "color") {
      allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
    }
  });

  Object.entries(allTokens)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += "}\n\n";

  const darkTokens: Record<string, string> = {};
  
  PALETTE_RAMPS.forEach((ramp) => {
    const rampShades = generateRampShades(ramp.name, ramp.hue, ramp.saturation, "dark");
    Object.assign(darkTokens, rampShades);
  });

  NEUTRAL_TOKENS.forEach((neutral) => {
    darkTokens[neutral.token] = getTokenValue(neutral.token, neutral.value, "dark");
  });

  SEMANTIC_TOKENS.forEach((token) => {
    const defaultValue = token.darkValue || token.lightValue;
    darkTokens[token.name] = getTokenValue(token.name, defaultValue, "dark");
  });

  SURFACE_TOKENS.forEach((token) => {
    const defaultValue = token.darkValue || token.lightValue;
    darkTokens[token.name] = getTokenValue(token.name, defaultValue, "dark");
  });

  TEXT_TOKENS.forEach((token) => {
    const defaultValue = token.darkValue || token.lightValue;
    darkTokens[token.name] = getTokenValue(token.name, defaultValue, "dark");
  });

  // Layer 3 Component tokens
  COMPONENT_TOKENS.forEach((token) => {
    if (token.type === "color") {
      const defaultValue = token.darkValue || token.lightValue;
      darkTokens[token.name] = getTokenValue(token.name, defaultValue, "dark");
    }
  });

  if (Object.keys(darkTokens).length > 0) {
    css += ".dark {\n";
    Object.entries(darkTokens)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([token, value]) => {
        css += `  ${token}: ${value};\n`;
      });
    css += "}\n";
  }

  return css;
}

/**
 * Generate full JSON schema with all tokens
 */
function generateFullJSON(overrides: { light: Record<string, string>; dark: Record<string, string> }): string {
  const schema: Record<string, unknown> = { wex: {} };
  
  const getTokenValue = (tokenName: string, defaultValue: string, mode: "light" | "dark"): string => {
    return overrides[mode][tokenName] || defaultValue;
  };

  const generateRampShades = (rampName: string, defaultHue: number, defaultSaturation: number, mode: "light" | "dark"): Record<string, string> => {
    const shades: Record<string, string> = {};
    const token500 = `--wex-palette-${rampName}-500`;
    const override500 = overrides[mode][token500];
    let rampHue = defaultHue;
    let rampSaturation = defaultSaturation;
    let baseLightness = PALETTE_LIGHTNESS_STEPS[500];
    
    if (override500) {
      const hsl = parseHSL(override500);
      if (hsl) {
        rampHue = hsl.h;
        rampSaturation = hsl.s;
        baseLightness = hsl.l;
      }
    }
    
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((shade) => {
      const token = `--wex-palette-${rampName}-${shade}`;
      
      if (overrides[mode][token]) {
        shades[token] = overrides[mode][token];
      } else {
        const lightness = shade === 500 ? baseLightness : PALETTE_LIGHTNESS_STEPS[shade];
        shades[token] = formatHSL({ h: rampHue, s: rampSaturation, l: lightness });
      }
    });
    
    return shades;
  };

  const setNestedProperty = (obj: Record<string, unknown>, path: string, value: unknown): void => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  };

  const processTokens = (mode: "light" | "dark", suffix = "") => {
    PALETTE_RAMPS.forEach((ramp) => {
      const rampShades = generateRampShades(ramp.name, ramp.hue, ramp.saturation, mode);
      Object.entries(rampShades).forEach(([token, value]) => {
        const cleanToken = token.replace("--wex-", "").replace(/-/g, ".");
        setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
          value,
          type: "color",
        });
      });
    });

    NEUTRAL_TOKENS.forEach((neutral) => {
      const value = getTokenValue(neutral.token, neutral.value, mode);
      const cleanToken = neutral.token.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    SEMANTIC_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    SURFACE_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    TEXT_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    // Layer 3 Component tokens
    COMPONENT_TOKENS.forEach((token) => {
      if (token.type === "color") {
        const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
        const value = getTokenValue(token.name, defaultValue, mode);
        const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
        setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
          value,
          type: "color",
        });
      }
    });
  };

  processTokens("light");
  processTokens("dark", ".dark");

  return JSON.stringify(schema, null, 2);
}

interface ThemeExportViewProps {
  onClose?: () => void;
}

export function ThemeExportView(_props: ThemeExportViewProps) {
  const { getAllOverrides } = useThemeOverrides();
  const overrides = getAllOverrides();
  const [copiedCSS, setCopiedCSS] = React.useState(false);
  const [copiedJSON, setCopiedJSON] = React.useState(false);

  const cssCode = React.useMemo(() => generateFullCSS(overrides), [overrides]);
  const jsonCode = React.useMemo(() => generateFullJSON(overrides), [overrides]);

  // Generate highlighted HTML for CSS
  const highlightedCSS = React.useMemo(() => {
    try {
      return Prism.highlight(cssCode, Prism.languages.css, "css");
    } catch (e) {
      return cssCode;
    }
  }, [cssCode]);

  // Generate highlighted HTML for JSON
  const highlightedJSON = React.useMemo(() => {
    try {
      return Prism.highlight(jsonCode, Prism.languages.json, "json");
    } catch (e) {
      return jsonCode;
    }
  }, [jsonCode]);

  const handleCopyCSS = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopiedCSS(true);
      setTimeout(() => setCopiedCSS(false), 2000);
    } catch (err) {
      console.error("Failed to copy CSS:", err);
    }
  }, [cssCode]);

  const handleCopyJSON = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonCode);
      setCopiedJSON(true);
      setTimeout(() => setCopiedJSON(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  }, [jsonCode]);

  const handleExportCSS = React.useCallback(() => {
    const blob = new Blob([cssCode], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wex-tokens.css";
    a.click();
    URL.revokeObjectURL(url);
  }, [cssCode]);

  const handleExportJSON = React.useCallback(() => {
    const blob = new Blob([jsonCode], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wex-tokens.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonCode]);

  return (
    <>
      {/* Prism.js syntax highlighting styles - adapts to light/dark mode */}
      <style>{`
        /* Light mode colors - subtle, readable colors */
        .language-css .token.selector,
        .language-css .token.property,
        .language-css .token.function {
          color: #0066cc;
        }
        .language-css .token.string {
          color: #008000;
        }
        .language-css .token.punctuation {
          color: #666666;
        }
        .language-css .token.attr-name {
          color: #d97706;
        }
        .language-json .token.property {
          color: #0066cc;
        }
        .language-json .token.string {
          color: #008000;
        }
        .language-json .token.number {
          color: #dc2626;
        }
        .language-json .token.boolean {
          color: #0066cc;
        }
        .language-json .token.punctuation {
          color: #666666;
        }
        
        /* Dark mode colors - brighter, more vibrant */
        .dark .language-css .token.selector,
        .dark .language-css .token.property,
        .dark .language-css .token.function {
          color: #c792ea;
        }
        .dark .language-css .token.string {
          color: #c3e88d;
        }
        .dark .language-css .token.punctuation {
          color: #89ddff;
        }
        .dark .language-css .token.attr-name {
          color: #ffcb6b;
        }
        .dark .language-json .token.property {
          color: #c792ea;
        }
        .dark .language-json .token.string {
          color: #c3e88d;
        }
        .dark .language-json .token.number {
          color: #f78c6c;
        }
        .dark .language-json .token.boolean {
          color: #c792ea;
        }
        .dark .language-json .token.punctuation {
          color: #89ddff;
        }
      `}</style>
      <div className="h-full flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* CSS Code Block */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">CSS</span>
                <span className="text-[10px] text-muted-foreground">
                  ({cssCode.split("\n").length} lines)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <WexButton
                  intent="ghost"
                  size="sm"
                  onClick={handleCopyCSS}
                  className="h-7 px-2"
                >
                  {copiedCSS ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </WexButton>
                <WexButton
                  intent="ghost"
                  size="sm"
                  onClick={handleExportCSS}
                  className="h-7 px-2"
                >
                  <Download className="h-3 w-3" />
                </WexButton>
              </div>
            </div>
            <div className="p-4 overflow-x-auto overflow-y-auto max-h-[400px] bg-muted/50 dark:bg-slate-950">
              <pre className="text-xs font-mono !m-0 !bg-transparent text-foreground dark:text-slate-100">
                <code 
                  className="language-css !text-sm !leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightedCSS }}
                />
              </pre>
            </div>
          </div>

          {/* JSON Code Block */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">JSON</span>
                <span className="text-[10px] text-muted-foreground">
                  ({jsonCode.split("\n").length} lines)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <WexButton
                  intent="ghost"
                  size="sm"
                  onClick={handleCopyJSON}
                  className="h-7 px-2"
                >
                  {copiedJSON ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </WexButton>
                <WexButton
                  intent="ghost"
                  size="sm"
                  onClick={handleExportJSON}
                  className="h-7 px-2"
                >
                  <Download className="h-3 w-3" />
                </WexButton>
              </div>
            </div>
            <div className="p-4 overflow-x-auto overflow-y-auto max-h-[400px] bg-muted/50 dark:bg-slate-950">
              <pre className="text-xs font-mono !m-0 !bg-transparent text-foreground dark:text-slate-100">
                <code 
                  className="language-json !text-sm !leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightedJSON }}
                />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

