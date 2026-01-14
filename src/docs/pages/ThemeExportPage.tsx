/**
 * Theme Export Page
 * 
 * Shows the complete token schema with overrides applied.
 * Displays CSS and JSON code blocks for copying or downloading.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { WexButton } from "@/components/wex";
import { useThemeOverrides } from "@/docs/hooks/useThemeOverrides";
import {
  PALETTE_RAMPS,
  SEMANTIC_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  NEUTRAL_TOKENS,
} from "@/docs/data/tokenRegistry";
import { ThemeExportPanel } from "@/docs/components/ThemeExportPanel";
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
  
  // Helper to get token value (override or default)
  const getTokenValue = (tokenName: string, defaultValue: string, mode: "light" | "dark"): string => {
    return overrides[mode][tokenName] || defaultValue;
  };

  // Helper to generate palette ramp shades
  const generateRampShades = (rampName: string, defaultHue: number, defaultSaturation: number, mode: "light" | "dark"): Record<string, string> => {
    const shades: Record<string, string> = {};
    const token500 = `--wex-palette-${rampName}-500`;
    
    // Check if 500 shade is overridden - if so, use its hue/saturation for the whole ramp
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
    
    // Generate all shades
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((shade) => {
      const token = `--wex-palette-${rampName}-${shade}`;
      
      // Use override if exists, otherwise generate from ramp
      if (overrides[mode][token]) {
        shades[token] = overrides[mode][token];
      } else {
        const lightness = shade === 500 ? baseLightness : PALETTE_LIGHTNESS_STEPS[shade];
        shades[token] = formatHSL({ h: rampHue, s: rampSaturation, l: lightness });
      }
    });
    
    return shades;
  };

  // Collect all tokens
  const allTokens: Record<string, string> = {};

  // Palette ramps
  PALETTE_RAMPS.forEach((ramp) => {
    const rampShades = generateRampShades(ramp.name, ramp.hue, ramp.saturation, "light");
    Object.assign(allTokens, rampShades);
  });

  // Neutrals
  NEUTRAL_TOKENS.forEach((neutral) => {
    allTokens[neutral.token] = getTokenValue(neutral.token, neutral.value, "light");
  });

  // Semantic tokens
  SEMANTIC_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  // Surface tokens
  SURFACE_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  // Text tokens
  TEXT_TOKENS.forEach((token) => {
    allTokens[token.name] = getTokenValue(token.name, token.lightValue, "light");
  });

  // Sort and output
  Object.entries(allTokens)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += "}\n\n";

  // Dark mode
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
    
    // Check if 500 shade is overridden - if so, use its hue/saturation for the whole ramp
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
      
      // Use override if exists, otherwise generate from ramp
      if (overrides[mode][token]) {
        shades[token] = overrides[mode][token];
      } else {
        const lightness = shade === 500 ? baseLightness : PALETTE_LIGHTNESS_STEPS[shade];
        shades[token] = formatHSL({ h: rampHue, s: rampSaturation, l: lightness });
      }
    });
    
    return shades;
  };

  // Helper to set nested property
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

  // Process all tokens
  const processTokens = (mode: "light" | "dark", suffix = "") => {
    // Palette ramps
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

    // Neutrals
    NEUTRAL_TOKENS.forEach((neutral) => {
      const value = getTokenValue(neutral.token, neutral.value, mode);
      const cleanToken = neutral.token.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    // Semantic tokens
    SEMANTIC_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    // Surface tokens
    SURFACE_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });

    // Text tokens
    TEXT_TOKENS.forEach((token) => {
      const defaultValue = mode === "dark" ? (token.darkValue || token.lightValue) : token.lightValue;
      const value = getTokenValue(token.name, defaultValue, mode);
      const cleanToken = token.name.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(schema.wex as Record<string, unknown>, cleanToken + suffix, {
        value,
        type: "color",
      });
    });
  };

  // Process light mode
  processTokens("light");
  
  // Process dark mode
  processTokens("dark", ".dark");

  return JSON.stringify(schema, null, 2);
}

export default function ThemeExportPage() {
  const navigate = useNavigate();
  const { getAllOverrides } = useThemeOverrides();
  const overrides = getAllOverrides();

  const cssCode = React.useMemo(() => generateFullCSS(overrides), [overrides]);
  const jsonCode = React.useMemo(() => generateFullJSON(overrides), [overrides]);

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
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <WexButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/theme-builder")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Theme Builder
          </WexButton>
          <div>
            <h1 className="text-2xl font-semibold">Export Theme</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete token schema with your customizations applied
            </p>
          </div>
        </div>

        {/* Export Panel */}
        <ThemeExportPanel
          cssCode={cssCode}
          jsonCode={jsonCode}
          onExportCSS={handleExportCSS}
          onExportJSON={handleExportJSON}
        />
      </div>
    </div>
  );
}

