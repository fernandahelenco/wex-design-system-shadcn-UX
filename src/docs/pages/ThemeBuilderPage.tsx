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
  getAffectedComponents,
  detectTokenConflicts,
  type PaletteRamp,
  type TokenDefinition,
} from "@/docs/data/tokenRegistry";
import { getSemanticTokensForPalette } from "@/docs/components/TokenMapping";
import { WexButton, WexBadge, WexAlert, WexCard, WexInput, WexTabs } from "@/components/wex";
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
  
  // Parse the current CSS variable value
  React.useEffect(() => {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(token).trim();
    const parts = value.split(" ");
    if (parts.length >= 3) {
      setHue(parseFloat(parts[0]) || 0);
      setSaturation(parseFloat(parts[1]) || 0);
      setLightness(parseFloat(parts[2]) || 0);
    }
  }, [token, mode]);
  
  const handleChange = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    onColorChange(token, `${h} ${s}% ${l}%`);
  };
  
  // Get semantic tokens that reference this palette token
  const referencingTokens = getSemanticTokensForPalette(token);
  const affectedComponents = getAffectedComponents(token);
  
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
      
      {/* HSL Inputs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">H°</label>
          <WexInput
            type="number"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => handleChange(Number(e.target.value), saturation, lightness)}
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
            onChange={(e) => handleChange(hue, Number(e.target.value), lightness)}
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
            onChange={(e) => handleChange(hue, saturation, Number(e.target.value))}
            className="h-8 text-sm"
          />
        </div>
      </div>
      
      {/* Cascade Information */}
      {referencingTokens.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Cascade
          </h4>
          <div className="space-y-2">
            {referencingTokens.map((semantic) => (
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
  // Render sample components based on what's affected
  const hasButton = components.some(c => c.includes("Button"));
  const hasBadge = components.some(c => c.includes("Badge"));
  const hasAlert = components.some(c => c.includes("Alert"));
  
  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Live Preview
      </h4>
      
      <div className="space-y-4">
        {hasButton && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Buttons</span>
            <div className="flex flex-wrap gap-2">
              <WexButton size="sm">Primary</WexButton>
              <WexButton size="sm" intent="destructive">Destructive</WexButton>
              <WexButton size="sm" intent="outline">Outline</WexButton>
            </div>
          </div>
        )}
        
        {hasBadge && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Badges</span>
            <div className="flex flex-wrap gap-2">
              <WexBadge>Default</WexBadge>
              <WexBadge intent="destructive">Destructive</WexBadge>
              <WexBadge intent="success">Success</WexBadge>
              <WexBadge intent="warning">Warning</WexBadge>
              <WexBadge intent="info">Info</WexBadge>
            </div>
          </div>
        )}
        
        {hasAlert && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Alerts</span>
            <div className="space-y-2">
              <WexAlert intent="success">
                <Check className="h-4 w-4" />
                <WexAlert.Title>Success</WexAlert.Title>
              </WexAlert>
              <WexAlert intent="destructive">
                <AlertTriangle className="h-4 w-4" />
                <WexAlert.Title>Error</WexAlert.Title>
              </WexAlert>
            </div>
          </div>
        )}
        
        {components.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Select a token to see affected components
          </p>
        )}
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
  const { editMode, setEditMode } = useThemeBuilder();
  const { overrides, setToken, resetAll, exportAsJSON, hasOverrides } = useThemeOverrides();
  
  const [selectedCategory, setSelectedCategory] = React.useState<string>("palette");
  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);
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
  
  // Handle reset
  const handleReset = React.useCallback(() => {
    if (window.confirm("Reset all theme changes? This cannot be undone.")) {
      resetAll();
      // Remove custom properties
      for (const token of Object.keys(overrides)) {
        document.documentElement.style.removeProperty(token);
      }
    }
  }, [resetAll, overrides]);
  
  // Get affected components for current selection
  const affectedComponents = selectedToken 
    ? getAffectedComponents(selectedToken) 
    : [];
  
  // Detect token conflicts
  const conflicts = React.useMemo(() => {
    // Convert overrides to a simple object for conflict detection
    const overrideValues: Record<string, string> = {};
    if (overrides[editMode]) {
      for (const [token, value] of Object.entries(overrides[editMode])) {
        if (typeof value === "string") {
          overrideValues[token] = value;
        }
      }
    }
    return detectTokenConflicts(overrideValues);
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
            
            {conflicts.length > 0 && (
              <WexBadge intent="destructive" className="text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {conflicts.length} Conflict{conflicts.length > 1 ? "s" : ""}
              </WexBadge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <WexButton 
              size="sm" 
              intent="outline" 
              onClick={handleReset}
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
              {selectedToken && (
                <WexCard className="mt-6">
                  <WexCard.Header>
                    <WexCard.Title className="text-sm">Cascade Chain</WexCard.Title>
                    <WexCard.Description>
                      Changing this color affects the following tokens and components
                    </WexCard.Description>
                  </WexCard.Header>
                  <WexCard.Content>
                    <div className="space-y-4">
                      {/* Semantic tokens referencing this palette */}
                      {getSemanticTokensForPalette(selectedToken).length > 0 ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-md border border-border/50"
                              style={{ backgroundColor: `hsl(var(${selectedToken}))` }}
                            />
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-2">
                              {getSemanticTokensForPalette(selectedToken).map((semantic) => (
                                <code key={semantic} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                  {semantic}
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
                          This palette shade is not currently referenced by any semantic token.
                        </p>
                      )}
                    </div>
                  </WexCard.Content>
                </WexCard>
              )}
              
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
    </div>
  );
}
