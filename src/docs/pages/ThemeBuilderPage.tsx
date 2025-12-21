/**
 * Theme Builder V3 - Token-First Editing Experience
 * 
 * Allows designers to:
 * - Edit palette colors (50-900 ramps)
 * - See which semantic tokens reference each palette color
 * - View all components affected by a color change
 * - Export changes as Style Dictionary JSON
 */

import * as React from "react";
import { useThemeBuilder } from "@/docs/context/ThemeBuilderContext";
import { useThemeOverrides } from "@/docs/hooks/useThemeOverrides";
import { 
  PALETTE_RAMPS, 
  SEMANTIC_TOKENS, 
  SURFACE_TOKENS, 
  TEXT_TOKENS, 
  getAffectedComponentsForMode,
  type PaletteRamp,
  type TokenDefinition,
} from "@/docs/data/tokenRegistry";
import { checkAllContrastPairs, formatContrastRatio, type A11yIssue } from "@/docs/utils/contrast";
import { getSemanticTokensForPaletteWithMode } from "@/docs/components/TokenMapping";
import { hexToHSL, hslToHex } from "@/docs/utils/color-convert";
import { 
  WexButton, 
  WexBadge, 
  WexAlert, 
  WexAlertDialog, 
  WexCard, 
  WexInput, 
  WexTabs, 
  WexProgress, 
  WexSwitch,
  WexCheckbox,
  WexRadioGroup,
  WexSkeleton,
} from "@/components/wex";
import { 
  Palette, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  ChevronRight,
  AlertTriangle,
  Check,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type EditMode = "light" | "dark";

interface ColorSwatchProps {
  token: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

// ============================================================================
// Color Swatch Component
// ============================================================================

function ColorSwatch({ token, label, isSelected, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
        "hover:bg-muted/50",
        isSelected && "ring-2 ring-primary ring-offset-2 bg-muted/30"
      )}
    >
      <div 
        className="w-12 h-12 rounded-md border border-border/50 shadow-sm"
        style={{ backgroundColor: `hsl(var(${token}))` }}
      />
      <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
        {label}
      </span>
    </button>
  );
}

// ============================================================================
// Palette Ramp Display
// ============================================================================

interface PaletteRampDisplayProps {
  ramp: PaletteRamp;
  selectedToken: string | null;
  onSelectToken: (token: string) => void;
}

function PaletteRampDisplay({ ramp, selectedToken, onSelectToken }: PaletteRampDisplayProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full border border-border/50"
          style={{ backgroundColor: `hsl(var(--wex-palette-${ramp.name}-500))` }}
        />
        {ramp.label} Palette
      </h3>
      <div className="flex flex-wrap gap-1">
        {ramp.shades.map((shade) => (
          <ColorSwatch
            key={shade.token}
            token={shade.token}
            label={String(shade.shade)}
            isSelected={selectedToken === shade.token}
            onClick={() => onSelectToken(shade.token)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Token Editor Panel
// ============================================================================

interface TokenEditorProps {
  token: string;
  mode: EditMode;
  onColorChange: (token: string, hsl: string) => void;
}

function TokenEditor({ token, mode, onColorChange }: TokenEditorProps) {
  const [hue, setHue] = React.useState(0);
  const [saturation, setSaturation] = React.useState(0);
  const [lightness, setLightness] = React.useState(0);
  const [hexValue, setHexValue] = React.useState("");
  
  // Parse the current CSS variable value
  React.useEffect(() => {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(token).trim();
    const parts = value.split(" ");
    if (parts.length >= 3) {
      const h = parseFloat(parts[0]) || 0;
      const s = parseFloat(parts[1]) || 0;
      const l = parseFloat(parts[2]) || 0;
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setHexValue(hslToHex({ h, s, l }));
    }
  }, [token, mode]);
  
  const handleHslChange = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setHexValue(hslToHex({ h, s, l }));
    onColorChange(token, `${h} ${s}% ${l}%`);
  };
  
  const handleHexChange = (hex: string) => {
    setHexValue(hex);
    // Only convert if it's a valid hex
    if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
      const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;
      const hsl = hexToHSL(cleanHex);
      if (hsl) {
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        onColorChange(token, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      }
    }
  };
  
  // Get semantic tokens that reference this palette token for CURRENT mode only
  const paletteRefs = getSemanticTokensForPaletteWithMode(token);
  const currentModeRefs = paletteRefs.filter(ref => ref.mode === mode || ref.mode === "both");
  const affectedComponents = getAffectedComponentsForMode(token, mode);
  
  return (
    <div className="space-y-6 p-4">
      {/* Token Name Header */}
      <div className="space-y-2">
        <code className="text-sm font-mono text-primary">{token}</code>
        <div 
          className="w-full h-16 rounded-lg border border-border shadow-inner"
          style={{ backgroundColor: `hsl(${hue} ${saturation}% ${lightness}%)` }}
        />
      </div>
      
      {/* Hex Input */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Hex</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={hexValue.startsWith("#") ? hexValue : `#${hexValue}`}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-10 h-8 rounded border border-border cursor-pointer"
          />
          <WexInput
            type="text"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="h-8 text-sm font-mono flex-1"
          />
        </div>
      </div>
      
      {/* HSL Inputs */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">H°</label>
          <WexInput
            type="number"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => handleHslChange(Number(e.target.value), saturation, lightness)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">S%</label>
          <WexInput
            type="number"
            min={0}
            max={100}
            value={saturation}
            onChange={(e) => handleHslChange(hue, Number(e.target.value), lightness)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">L%</label>
          <WexInput
            type="number"
            min={0}
            max={100}
            value={lightness}
            onChange={(e) => handleHslChange(hue, saturation, Number(e.target.value))}
            className="h-8 text-sm"
          />
        </div>
      </div>
      
      {/* Cascade Information - filtered to current mode */}
      {currentModeRefs.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Maps to ({mode} mode)
          </h4>
          <div className="space-y-2">
            {currentModeRefs.map(({ token: semantic }) => (
              <div key={semantic} className="flex items-center gap-2 text-xs">
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <code className="font-mono text-primary">{semantic}</code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Affected Components */}
      {affectedComponents.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Affected Components
          </h4>
          <div className="flex flex-wrap gap-1">
            {affectedComponents.map((comp) => (
              <WexBadge key={comp} intent="secondary" className="text-[10px]">
                {comp}
              </WexBadge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Component Preview Panel
// ============================================================================

interface ComponentPreviewProps {
  components: string[];
}

function ComponentPreview({ components }: ComponentPreviewProps) {
  // Always show all component examples so users can see full impact
  // Highlight which ones are affected by the current selection
  const isAffected = (name: string) => components.some(c => c.includes(name));
  
  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Live Preview
        {components.length > 0 && (
          <span className="ml-2 text-primary">({components.length} affected)</span>
        )}
      </h4>
      
      <div className="space-y-4">
        {/* Buttons */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Button") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Buttons
            {isAffected("Button") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex flex-wrap gap-2">
            <WexButton size="sm">Primary</WexButton>
            <WexButton size="sm" intent="destructive">Destructive</WexButton>
            <WexButton size="sm" intent="outline">Outline</WexButton>
            <WexButton size="sm" intent="secondary">Secondary</WexButton>
            <WexButton size="sm" intent="ghost">Ghost</WexButton>
          </div>
        </div>
        
        {/* Badges */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Badge") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Badges
            {isAffected("Badge") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex flex-wrap gap-2">
            <WexBadge>Default</WexBadge>
            <WexBadge intent="secondary">Secondary</WexBadge>
            <WexBadge intent="destructive">Destructive</WexBadge>
            <WexBadge intent="success">Success</WexBadge>
            <WexBadge intent="warning">Warning</WexBadge>
            <WexBadge intent="info">Info</WexBadge>
          </div>
        </div>
        
        {/* Progress */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Progress") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Progress
            {isAffected("Progress") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <WexProgress value={65} className="w-48" />
        </div>
        
        {/* Switch */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Switch") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Switch
            {isAffected("Switch") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex items-center gap-4">
            <WexSwitch defaultChecked />
            <WexSwitch />
          </div>
        </div>
        
        {/* Focus Ring */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("focus") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Focus Ring
            {isAffected("focus") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex flex-wrap gap-3">
            <WexButton size="sm" intent="outline">
              Tab to focus
            </WexButton>
            <WexInput placeholder="Focus here" className="w-32" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Focus ring color applies when elements receive keyboard focus
          </p>
        </div>
        
        {/* Checkbox */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Checkbox") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Checkbox
            {isAffected("Checkbox") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <WexCheckbox id="cb1" defaultChecked />
              <label htmlFor="cb1" className="text-sm">Checked</label>
            </div>
            <div className="flex items-center gap-2">
              <WexCheckbox id="cb2" />
              <label htmlFor="cb2" className="text-sm">Unchecked</label>
            </div>
          </div>
        </div>
        
        {/* Radio Group */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Radio") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Radio Group
            {isAffected("Radio") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <WexRadioGroup defaultValue="opt1" className="flex gap-4">
            <div className="flex items-center gap-2">
              <WexRadioGroup.Item value="opt1" id="r1" />
              <label htmlFor="r1" className="text-sm">Selected</label>
            </div>
            <div className="flex items-center gap-2">
              <WexRadioGroup.Item value="opt2" id="r2" />
              <label htmlFor="r2" className="text-sm">Unselected</label>
            </div>
          </WexRadioGroup>
        </div>
        
        {/* Skeleton */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Skeleton") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Skeleton
            {isAffected("Skeleton") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="flex items-center gap-3">
            <WexSkeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <WexSkeleton className="h-4 w-32" />
              <WexSkeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        
        {/* Alerts */}
        <div className={cn("space-y-2 p-2 rounded", isAffected("Alert") && "bg-primary/5 ring-1 ring-primary/20")}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            Alerts
            {isAffected("Alert") && <WexBadge intent="info" className="text-[9px] px-1 py-0">affected</WexBadge>}
          </span>
          <div className="space-y-2">
            <WexAlert>
              <Info className="h-4 w-4" />
              <WexAlert.Title>Default Alert</WexAlert.Title>
            </WexAlert>
            <WexAlert intent="success">
              <Check className="h-4 w-4" />
              <WexAlert.Title>Success</WexAlert.Title>
            </WexAlert>
            <WexAlert intent="warning">
              <AlertTriangle className="h-4 w-4" />
              <WexAlert.Title>Warning</WexAlert.Title>
            </WexAlert>
            <WexAlert intent="destructive">
              <AlertTriangle className="h-4 w-4" />
              <WexAlert.Title>Error</WexAlert.Title>
            </WexAlert>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Semantic Token List
// ============================================================================

interface SemanticTokenListProps {
  tokens: TokenDefinition[];
  selectedToken: string | null;
  onSelectToken: (token: string) => void;
}

function SemanticTokenList({ tokens, selectedToken, onSelectToken }: SemanticTokenListProps) {
  return (
    <div className="space-y-2">
      {tokens.map((token) => (
        <button
          key={token.name}
          onClick={() => onSelectToken(token.name)}
          className={cn(
            "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all",
            "hover:bg-muted/50",
            selectedToken === token.name && "bg-muted ring-1 ring-primary/50"
          )}
        >
          <div 
            className="w-8 h-8 rounded-md border border-border/50 shadow-sm flex-shrink-0"
            style={{ backgroundColor: `hsl(var(${token.name}))` }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{token.label}</div>
            <div className="text-[10px] text-muted-foreground font-mono truncate">
              {token.name}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Main Theme Builder Page
// ============================================================================

export default function ThemeBuilderPage() {
  const { editMode, setEditMode, selectedToken, setSelectedToken } = useThemeBuilder();
  const { overrides, setToken, resetAll, exportAsJSON, hasOverrides } = useThemeOverrides();
  
  const [selectedCategory, setSelectedCategory] = React.useState<string>("palette");
  const [selectedPalette, setSelectedPalette] = React.useState<string>("blue");
  
  // Handle color change
  const handleColorChange = React.useCallback((token: string, hsl: string) => {
    setToken(token, hsl, editMode);
    // Apply to document
    document.documentElement.style.setProperty(token, hsl);
  }, [setToken, editMode]);
  
  // Handle export
  const handleExport = React.useCallback(() => {
    const json = exportAsJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wex-theme-overrides.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportAsJSON]);
  
  // Reset confirmation dialog state
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  
  // Handle reset confirmation
  const confirmReset = React.useCallback(() => {
    resetAll();
    // Remove custom properties
    for (const token of Object.keys(overrides)) {
      document.documentElement.style.removeProperty(token);
    }
    setShowResetDialog(false);
    // Force re-read of selected token to update editor panel
    setSelectedToken(null);
  }, [resetAll, overrides]);
  
  // Get affected components for current selection (mode-aware)
  const affectedComponents = selectedToken 
    ? getAffectedComponentsForMode(selectedToken, editMode) 
    : [];
  
  // Real-time WCAG contrast checking
  const [a11yIssues, setA11yIssues] = React.useState<A11yIssue[]>([]);
  const [showA11yDetails, setShowA11yDetails] = React.useState(false);
  
  // Check contrast pairs whenever overrides change
  React.useEffect(() => {
    // Small delay to let CSS variables update
    const timer = setTimeout(() => {
      const issues = checkAllContrastPairs();
      setA11yIssues(issues);
    }, 100);
    return () => clearTimeout(timer);
  }, [overrides, editMode]);
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Theme Builder</h1>
            </div>
            
            {/* Light/Dark Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setEditMode("light")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all",
                  editMode === "light" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setEditMode("dark")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all",
                  editMode === "dark" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
            
            {hasOverrides && (
              <WexBadge intent="warning" className="text-xs">
                Unsaved Changes
              </WexBadge>
            )}
            
            {a11yIssues.length > 0 && (
              <button
                onClick={() => setShowA11yDetails(!showA11yDetails)}
                className="inline-flex items-center gap-1"
              >
                <WexBadge intent="destructive" className="text-xs flex items-center gap-1 cursor-pointer">
                  <AlertTriangle className="w-3 h-3" />
                  {a11yIssues.length} A11y Issue{a11yIssues.length > 1 ? "s" : ""}
                </WexBadge>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <WexButton 
              size="sm" 
              intent="outline" 
              onClick={() => setShowResetDialog(true)}
              disabled={!hasOverrides}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </WexButton>
            <WexButton 
              size="sm" 
              onClick={handleExport}
              disabled={!hasOverrides}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </WexButton>
          </div>
        </div>
        
        {/* A11y Issues Expandable Details */}
        {showA11yDetails && a11yIssues.length > 0 && (
          <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h3 className="text-sm font-medium text-destructive mb-2">
              Contrast Issues (WCAG AA requires 4.5:1)
            </h3>
            <div className="space-y-2">
              {a11yIssues.map((issue, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between text-sm bg-background/50 rounded px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{issue.pair.name}</span>
                    <span className="text-muted-foreground ml-2">({issue.pair.component})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-destructive font-mono">
                      {formatContrastRatio(issue.ratio)}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      needs {formatContrastRatio(issue.required)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Token Categories */}
        <div className="w-64 border-r border-border bg-muted/20 overflow-y-auto">
          <WexTabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <WexTabs.List className="w-full grid grid-cols-2 p-2 gap-1">
              <WexTabs.Trigger value="palette" className="text-xs">
                Palette
              </WexTabs.Trigger>
              <WexTabs.Trigger value="semantic" className="text-xs">
                Semantic
              </WexTabs.Trigger>
            </WexTabs.List>
            
            <WexTabs.Content value="palette" className="p-3">
              <div className="space-y-2">
                {PALETTE_RAMPS.map((ramp) => (
                  <button
                    key={ramp.name}
                    onClick={() => {
                      setSelectedPalette(ramp.name);
                      setSelectedToken(null);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all",
                      "hover:bg-muted/50",
                      selectedPalette === ramp.name && "bg-muted ring-1 ring-primary/50"
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded-md border border-border/50"
                      style={{ backgroundColor: `hsl(var(--wex-palette-${ramp.name}-500))` }}
                    />
                    <span className="text-sm">{ramp.label}</span>
                  </button>
                ))}
              </div>
            </WexTabs.Content>
            
            <WexTabs.Content value="semantic" className="p-3">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Status
                  </h4>
                  <SemanticTokenList
                    tokens={SEMANTIC_TOKENS.filter(t => 
                      ["Primary", "Destructive", "Success", "Warning", "Info"].some(
                        label => t.label.startsWith(label) && !t.label.includes("Hover") && !t.label.includes("Foreground")
                      )
                    )}
                    selectedToken={selectedToken}
                    onSelectToken={setSelectedToken}
                  />
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Surfaces
                  </h4>
                  <SemanticTokenList
                    tokens={SURFACE_TOKENS}
                    selectedToken={selectedToken}
                    onSelectToken={setSelectedToken}
                  />
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Text
                  </h4>
                  <SemanticTokenList
                    tokens={TEXT_TOKENS}
                    selectedToken={selectedToken}
                    onSelectToken={setSelectedToken}
                  />
                </div>
              </div>
            </WexTabs.Content>
          </WexTabs>
        </div>
        
        {/* Center Panel - Workspace */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedCategory === "palette" && (
            <div className="space-y-8">
              {/* Selected Palette Ramp */}
              {PALETTE_RAMPS.filter(r => r.name === selectedPalette).map((ramp) => (
                <PaletteRampDisplay
                  key={ramp.name}
                  ramp={ramp}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              ))}
              
              {/* Cascade Visualization */}
              {selectedToken && (() => {
                const allPaletteRefs = getSemanticTokensForPaletteWithMode(selectedToken);
                // Filter to show only current mode
                const currentModeRefs = allPaletteRefs.filter(ref => ref.mode === editMode || ref.mode === "both");
                const otherModeRefs = allPaletteRefs.filter(ref => ref.mode !== editMode && ref.mode !== "both");
                
                return (
                  <WexCard className="mt-6">
                    <WexCard.Header>
                      <WexCard.Title className="text-sm">
                        Cascade Chain ({editMode === "light" ? "Light" : "Dark"} Mode)
                      </WexCard.Title>
                      <WexCard.Description>
                        Changing this color affects the following tokens and components
                      </WexCard.Description>
                    </WexCard.Header>
                    <WexCard.Content>
                      <div className="space-y-4">
                        {/* Current mode references */}
                        {currentModeRefs.length > 0 ? (
                          <>
                            <div className="flex items-start gap-2">
                              <div 
                                className="w-8 h-8 rounded-md border border-border/50 flex-shrink-0"
                                style={{ backgroundColor: `hsl(var(${selectedToken}))` }}
                              />
                              <ChevronRight className="w-4 h-4 text-muted-foreground mt-2" />
                              <div className="flex flex-wrap gap-2">
                                {currentModeRefs.map(({ token }) => (
                                  <code key={token} className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                    {token}
                                  </code>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pl-12 flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              <div className="flex flex-wrap gap-1">
                                {affectedComponents.map((comp) => (
                                  <WexBadge key={comp} intent="secondary" className="text-xs">
                                    {comp}
                                  </WexBadge>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            This palette shade is not used in {editMode} mode.
                            {otherModeRefs.length > 0 && (
                              <span className="block mt-1">
                                (Used in {editMode === "light" ? "dark" : "light"} mode by: {otherModeRefs.map(r => r.token).join(", ")})
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </WexCard.Content>
                  </WexCard>
                );
              })()}
              
              {/* Component Preview */}
              {affectedComponents.length > 0 && (
                <ComponentPreview components={affectedComponents} />
              )}
            </div>
          )}
          
          {selectedCategory === "semantic" && selectedToken && (
            <div className="space-y-6">
              {/* Token Info Card */}
              <WexCard>
                <WexCard.Header>
                  <WexCard.Title className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md border border-border/50"
                      style={{ backgroundColor: `hsl(var(${selectedToken}))` }}
                    />
                    {SEMANTIC_TOKENS.find(t => t.name === selectedToken)?.label || 
                     SURFACE_TOKENS.find(t => t.name === selectedToken)?.label ||
                     TEXT_TOKENS.find(t => t.name === selectedToken)?.label}
                  </WexCard.Title>
                  <WexCard.Description>
                    <code className="text-xs font-mono">{selectedToken}</code>
                  </WexCard.Description>
                </WexCard.Header>
                <WexCard.Content>
                  {(() => {
                    const token = [...SEMANTIC_TOKENS, ...SURFACE_TOKENS, ...TEXT_TOKENS].find(
                      t => t.name === selectedToken
                    );
                    if (!token) return null;
                    
                    return (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {token.description}
                        </p>
                        
                        {token.references && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">References:</span>
                            <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
                              {token.references}
                            </code>
                          </div>
                        )}
                        
                        {token.tailwindUtilities && token.tailwindUtilities.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm text-muted-foreground">Tailwind Utilities:</span>
                            <div className="flex flex-wrap gap-1">
                              {token.tailwindUtilities.map((util) => (
                                <code key={util} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                  {util}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {token.usedBy.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm text-muted-foreground">Used By:</span>
                            <div className="flex flex-wrap gap-1">
                              {token.usedBy.map((comp) => (
                                <WexBadge key={comp} intent="secondary" className="text-xs">
                                  {comp}
                                </WexBadge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </WexCard.Content>
              </WexCard>
              
              {/* Sample Components */}
              <ComponentPreview 
                components={
                  [...SEMANTIC_TOKENS, ...SURFACE_TOKENS, ...TEXT_TOKENS]
                    .find(t => t.name === selectedToken)?.usedBy || []
                } 
              />
            </div>
          )}
          
          {!selectedToken && selectedCategory === "semantic" && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Select a token from the left panel to view details and edit
              </p>
            </div>
          )}
        </div>
        
        {/* Right Panel - Editor */}
        {selectedToken && (
          <div className="w-72 border-l border-border bg-muted/10 overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium">Editor</h3>
            </div>
            <TokenEditor
              token={selectedToken}
              mode={editMode}
              onColorChange={handleColorChange}
            />
          </div>
        )}
      </div>
      
      {/* Reset Confirmation Dialog */}
      <WexAlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <WexAlertDialog.Content>
          <WexAlertDialog.Header>
            <WexAlertDialog.Title>Reset All Changes?</WexAlertDialog.Title>
            <WexAlertDialog.Description>
              This will reset all theme customizations back to their default values. 
              This action cannot be undone.
            </WexAlertDialog.Description>
          </WexAlertDialog.Header>
          <WexAlertDialog.Footer>
            <WexAlertDialog.Cancel>Cancel</WexAlertDialog.Cancel>
            <WexAlertDialog.Action onClick={confirmReset}>
              Reset All
            </WexAlertDialog.Action>
          </WexAlertDialog.Footer>
        </WexAlertDialog.Content>
      </WexAlertDialog>
    </div>
  );
}
