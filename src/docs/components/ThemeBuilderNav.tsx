/**
 * ThemeBuilderNav Component (V4)
 * 
 * Simplified left rail navigation for Theme Builder.
 * Shows inline palette swatches that are directly clickable.
 * 
 * Structure:
 * - Exit button (returns to last visited page)
 * - Palette rows with inline swatches (Blue, Green, Amber, Red, Cyan, Slate)
 * - Brand Colors section
 * - Token Map link
 */

import * as React from "react";
import { WexSeparator, WexAlertDialog } from "@/components/wex";
import { ArrowLeft, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeBuilder } from "@/docs/context/ThemeBuilderContext";
import { PALETTE_RAMPS } from "@/docs/data/tokenRegistry";
import { getSemanticTokensForPaletteWithMode } from "@/docs/components/TokenMapping";

interface ThemeBuilderNavProps {
  onOpenTokenMap: () => void;
  hasUnsavedChanges?: boolean;
}

// Shade labels for display
const SHADE_LABELS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

export function ThemeBuilderNav({ 
  onOpenTokenMap, 
  hasUnsavedChanges = false,
}: ThemeBuilderNavProps) {
  const { 
    exitThemeBuilder, 
    editMode, 
    selectedToken, 
    setSelectedToken 
  } = useThemeBuilder();
  
  // Exit confirmation dialog state
  const [showExitDialog, setShowExitDialog] = React.useState(false);

  // Handle exit with unsaved changes warning
  const handleExit = React.useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      exitThemeBuilder();
    }
  }, [hasUnsavedChanges, exitThemeBuilder]);

  // Check if a palette shade is referenced by any semantic token in current mode
  const getShadeReferences = React.useCallback((paletteToken: string) => {
    return getSemanticTokensForPaletteWithMode(paletteToken);
  }, []);

  const isShadeUsed = React.useCallback((paletteToken: string) => {
    const refs = getShadeReferences(paletteToken);
    return refs.some(ref => ref.mode === editMode || ref.mode === "both");
  }, [getShadeReferences, editMode]);

  return (
    <div className="h-full flex flex-col">
      {/* Exit Button */}
      <div className="p-3 border-b border-border">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Theme Builder
          {hasUnsavedChanges && (
            <span className="ml-auto text-[10px] text-warning">●</span>
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Color Palettes */}
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Color Palettes
        </div>
        
        {PALETTE_RAMPS.map((ramp) => (
          <div key={ramp.name} className="space-y-1.5">
            {/* Palette Name */}
            <div className="flex items-center gap-2 px-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `hsl(var(--wex-palette-${ramp.name}-500))` }}
              />
              <span className="text-xs font-medium text-foreground">{ramp.label}</span>
            </div>
            
            {/* Inline Swatches */}
            <div className="flex gap-0.5">
              {SHADE_LABELS.map((shade) => {
                const token = `--wex-palette-${ramp.name}-${shade}`;
                const isSelected = selectedToken === token;
                const isUsed = isShadeUsed(token);
                
                return (
                  <button
                    key={shade}
                    onClick={() => setSelectedToken(token)}
                    title={`${ramp.label} ${shade}${isUsed ? " (in use)" : ""}`}
                    className={cn(
                      "relative w-5 h-5 rounded-sm transition-all",
                      "hover:scale-110 hover:z-10",
                      isSelected && "ring-2 ring-primary ring-offset-1 z-10",
                      !isUsed && "opacity-50"
                    )}
                    style={{ backgroundColor: `hsl(var(${token}))` }}
                  >
                    {/* Usage indicator dot */}
                    {isUsed && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <WexSeparator className="my-4" />

        {/* Brand Colors */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Brand Colors
          </div>
          <button
            onClick={() => setSelectedToken("--wex-brand-red")}
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors",
              selectedToken === "--wex-brand-red"
                ? "bg-muted ring-1 ring-primary/50"
                : "hover:bg-muted/50"
            )}
          >
            <div 
              className="w-5 h-5 rounded-sm"
              style={{ backgroundColor: `hsl(var(--wex-brand-red))` }}
            />
            <span className="text-sm">WEX Red</span>
          </button>
        </div>
      </div>

      {/* Footer - Token Map Link */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onOpenTokenMap}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
        >
          <Map className="h-4 w-4" />
          Token Map Reference
        </button>
      </div>
      
      {/* Exit Confirmation Dialog */}
      <WexAlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <WexAlertDialog.Content>
          <WexAlertDialog.Header>
            <WexAlertDialog.Title>Unsaved Changes</WexAlertDialog.Title>
            <WexAlertDialog.Description>
              You have unsaved theme changes. Are you sure you want to exit? 
              Your changes will be lost.
            </WexAlertDialog.Description>
          </WexAlertDialog.Header>
          <WexAlertDialog.Footer>
            <WexAlertDialog.Cancel>Cancel</WexAlertDialog.Cancel>
            <WexAlertDialog.Action onClick={exitThemeBuilder}>
              Exit Anyway
            </WexAlertDialog.Action>
          </WexAlertDialog.Footer>
        </WexAlertDialog.Content>
      </WexAlertDialog>
    </div>
  );
}
