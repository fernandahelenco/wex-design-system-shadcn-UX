/**
 * ThemeBuilderNav Component (V6 - Layers Panel)
 *
 * Left rail navigation with collapsible sections for all token types.
 * Acts as a "layers panel" similar to Figma/Photoshop.
 *
 * Structure:
 * - Light/Dark toggle at TOP
 * - Collapsible sections: Palette Ramps, Intent Colors, Surfaces, Text
 * - Actions at bottom: Reset, Export, Exit
 */

import * as React from "react";
import { WexSeparator, WexPopover } from "@/components/wex";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sun,
  Moon,
  ChevronRight,
  Pencil,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeBuilder } from "@/docs/context/ThemeBuilderContext";
import {
  PALETTE_RAMPS,
  SEMANTIC_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  EDITABLE_COMPONENT_GROUPS,
  getEditableTokensForGroup,
  type TokenDefinition,
  type ComponentGroup,
} from "@/docs/data/tokenRegistry";
import { PaletteSwatchPicker, formatPaletteValue } from "./PaletteSwatchPicker";
import { useContrastCompliance } from "@/docs/hooks/useContrastCompliance";

// ============================================================================
// Types
// ============================================================================

export interface ThemeBuilderNavProps {
  /** Currently selected token */
  selectedToken: string | null;
  /** Callback when token is selected */
  onSelectToken: (token: string) => void;
  /** Current assignments (token name -> palette value like "blue-700") */
  assignments: Record<string, string>;
  /** Callback when assignment changes */
  onAssignmentChange: (tokenName: string, value: string) => void;
  /** Callback to set a token value directly (for palette ramps) */
  setToken?: (token: string, value: string, mode: "light" | "dark") => void;
  /** Current edit mode */
  editMode?: "light" | "dark";
  /** Callback for export action */
  onExport: () => void;
  /** Callback for reset action */
  onReset: () => void;
  /** Whether there are unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Whether export/reset should be enabled */
  hasOverrides?: boolean;
}

// ============================================================================
// Token Sections Configuration
// ============================================================================

interface TokenSection {
  id: string;
  label: string;
  tokens: TokenDefinition[];
  defaultOpen?: boolean;
  readOnly?: boolean;
}

const getTokenSections = (): TokenSection[] => [
  {
    id: "intent",
    label: "Intent Colors",
    tokens: SEMANTIC_TOKENS.filter(
      (t) =>
        t.references &&
        !t.name.includes("-hover") &&
        !t.name.includes("-foreground") &&
        !t.name.includes("-contrast")
    ),
    defaultOpen: true,
  },
  {
    id: "surfaces",
    label: "Surfaces",
    tokens: SURFACE_TOKENS,
    defaultOpen: false,
  },
  {
    id: "text",
    label: "Text",
    tokens: TEXT_TOKENS,
    defaultOpen: false,
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function ThemeBuilderNav({
  selectedToken,
  onSelectToken,
  assignments,
  onAssignmentChange,
  setToken: _setToken,
  editMode: editModeProp,
  onExport,
  onReset,
  hasUnsavedChanges = false,
  hasOverrides = false,
}: ThemeBuilderNavProps) {
  // _setToken passed for potential future use but currently unused
  void _setToken;
  
  const { exitThemeBuilder, editMode: contextEditMode, setEditMode } = useThemeBuilder();
  const editMode = editModeProp ?? contextEditMode;

  // Section open/closed state
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({
    palette: true,
    intent: true,
    surfaces: false,
    text: false,
    components: false,
  });

  // Track which component groups are open within the Components section
  const [openComponentGroups, setOpenComponentGroups] = React.useState<
    Record<ComponentGroup, boolean>
  >({} as Record<ComponentGroup, boolean>);

  const toggleComponentGroup = (group: ComponentGroup) => {
    setOpenComponentGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle exit - changes are auto-saved, so no warning needed
  const handleExit = React.useCallback(() => {
    exitThemeBuilder();
  }, [exitThemeBuilder]);

  const tokenSections = getTokenSections();

  return (
    <div className="h-full flex flex-col bg-muted/30 border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="text-sm font-semibold">Theme Builder</div>
      </div>

      {/* Light/Dark Toggle at TOP */}
      <div className="p-3 border-b border-border">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Editing Mode
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setEditMode("light")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all",
              editMode === "light"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
          </button>
          <button
            onClick={() => setEditMode("dark")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all",
              editMode === "dark"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
          </button>
        </div>
      </div>

      {/* Scrollable Token Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Palette Ramps Section - Single clickable item */}
        <div
          className={cn(
            "px-1 py-1.5 rounded cursor-pointer transition-colors",
            selectedToken === "--wex-palette-ramps"
              ? "bg-primary/10 ring-1 ring-primary/30"
              : "hover:bg-muted/50"
          )}
          onClick={() => onSelectToken("--wex-palette-ramps")}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-px flex-shrink-0">
              {/* Mini preview showing 3 ramps */}
              {PALETTE_RAMPS.slice(0, 3).map((ramp) => {
                const shade500 = ramp.shades.find((s) => s.shade === 500);
                const l = shade500?.lightness ?? 50;
                return (
                  <div
                    key={ramp.name}
                    className="w-3 h-4 first:rounded-l-sm last:rounded-r-sm border border-border/30"
                    style={{
                      backgroundColor: `hsl(${ramp.hue} ${ramp.saturation}% ${l}%)`,
                    }}
                  />
                );
              })}
            </div>
            <span className="text-xs font-medium flex-1">Palette Ramps</span>
          </div>
        </div>

        <WexSeparator />

        {/* Token Sections */}
        {tokenSections.map((section) => (
          <React.Fragment key={section.id}>
            <CollapsibleSection
              label={section.label}
              isOpen={openSections[section.id] ?? section.defaultOpen ?? false}
              onToggle={() => toggleSection(section.id)}
            >
              <div className="space-y-0.5">
                {section.tokens.map((token) => (
                  <TokenRow
                    key={token.name}
                    token={token}
                    isSelected={selectedToken === token.name}
                    onSelect={() => onSelectToken(token.name)}
                    value={assignments[token.name]}
                    onChange={(value) => onAssignmentChange(token.name, value)}
                    editMode={editMode}
                    readOnly={section.readOnly}
                  />
                ))}
              </div>
            </CollapsibleSection>
            <WexSeparator />
          </React.Fragment>
        ))}

        {/* Layer 3 Component Tokens Section - EDITABLE */}
        <CollapsibleSection
          label="Component Tokens (L3)"
          isOpen={openSections.components ?? false}
          onToggle={() => toggleSection("components")}
        >
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground px-1 mb-2">
              Edit component-specific tokens. Form Controls are shared across inputs.
            </div>
            {EDITABLE_COMPONENT_GROUPS.filter(g => g.editable).map((group) => {
              const groupTokens = getEditableTokensForGroup(group.id);
              if (groupTokens.length === 0) return null;
              
              return (
                <div key={group.id} className="border-l-2 border-primary/30 pl-2">
                  <button
                    onClick={() => toggleComponentGroup(group.id)}
                    className="w-full flex items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 transition-transform",
                        openComponentGroups[group.id] && "rotate-90"
                      )}
                    />
                    <span>{group.label}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {groupTokens.length}
                    </span>
                  </button>
                  {group.childGroups && group.childGroups.length > 0 && (
                    <div className="text-[9px] text-muted-foreground pl-4 -mt-0.5 mb-1">
                      {group.description}
                    </div>
                  )}
                  {openComponentGroups[group.id] && (
                    <div className="space-y-0.5 pl-4 pt-1">
                      {groupTokens.map((token) => (
                        <ComponentTokenRow
                          key={token.name}
                          token={token}
                          isSelected={selectedToken === token.name}
                          onSelect={() => onSelectToken(token.name)}
                          editMode={editMode}
                          value={assignments[token.name]}
                          onChange={(value) => onAssignmentChange(token.name, value)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
        <WexSeparator />
      </div>

      {/* A11y Compliance Summary + Actions at bottom */}
      <div className="p-3 border-t border-border space-y-1">
        <ContrastComplianceSummary />
        <WexSeparator className="my-2" />
        <ActionButton
          onClick={onReset}
          icon={<RotateCcw className="h-4 w-4" />}
          label="Reset All"
          disabled={!hasOverrides}
        />
        <ActionButton
          onClick={onExport}
          icon={<Download className="h-4 w-4" />}
          label="Export Theme"
        />
        <WexSeparator className="my-2" />
        <ActionButton
          onClick={handleExit}
          icon={<ArrowLeft className="h-4 w-4" />}
          label="Exit Theme Builder"
          badge={hasUnsavedChanges ? "●" : undefined}
        />
        </div>
    </div>
  );
}

// ============================================================================
// WCAG Contrast Compliance Summary
// ============================================================================

function ContrastComplianceSummary() {
  const { results, passCount, failCount, totalCount, isCompliant } = useContrastCompliance();
  const { editMode } = useThemeBuilder();

  if (totalCount === 0) {
    return null; // Still loading
  }

  const ModeIcon = editMode === "light" ? Sun : Moon;

  return (
    <WexPopover>
      <WexPopover.Trigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
            isCompliant
              ? "text-success hover:bg-success/10"
              : "text-destructive hover:bg-destructive/10"
          )}
        >
          <ModeIcon className="h-3.5 w-3.5 text-muted-foreground" />
          {isCompliant ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span className="flex-1 text-left">
            {isCompliant ? "Contrast: OK" : `Contrast: ${failCount} Issue${failCount !== 1 ? "s" : ""}`}
          </span>
          <span className="text-xs text-muted-foreground">
            {passCount}/{totalCount}
          </span>
        </button>
      </WexPopover.Trigger>
      <WexPopover.Content side="right" align="end" className="w-80 p-0 max-h-96 overflow-y-auto">
        <div className="p-3 border-b border-border sticky top-0 bg-popover">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ModeIcon className="h-4 w-4 text-muted-foreground" />
            {isCompliant ? "All Contrast Checks Passing" : "Contrast Issues Detected"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            WCAG AA requires 4.5:1 for normal text ({editMode} mode)
          </div>
        </div>
        <div className="p-3 space-y-2">
          {results.map((result, idx) => (
            <div
              key={idx}
              className={cn(
                "p-2 rounded border text-xs",
                result.passes
                  ? "bg-success/5 border-success/20"
                  : "bg-destructive/5 border-destructive/20"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{result.pair.name}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium",
                    result.passes
                      ? "bg-success/20 text-success"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {result.ratio.toFixed(1)}:1
                </span>
              </div>
              <div className="text-muted-foreground text-[10px]">
                {result.pair.component}
              </div>
              {!result.passes && result.suggestion && (
                <p className="text-muted-foreground text-[10px] mt-1 pt-1 border-t border-border/50">
                  {result.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </WexPopover.Content>
    </WexPopover>
  );
}

// ============================================================================
// Collapsible Section
// ============================================================================

interface CollapsibleSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  label,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="py-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-90"
          )}
        />
        <span className="uppercase tracking-wider">{label}</span>
      </button>
      {isOpen && <div className="px-3 pt-2">{children}</div>}
    </div>
  );
}

// ============================================================================
// Token Row (selectable + editable)
// ============================================================================

// Note: PaletteRampEditor was removed as it's unused; kept in git history

// ============================================================================
// Token Row (selectable + editable)
// ============================================================================

interface TokenRowProps {
  token: TokenDefinition;
  isSelected: boolean;
  onSelect: () => void;
  value?: string;
  onChange: (value: string) => void;
  editMode: "light" | "dark";
  readOnly?: boolean;
}

function TokenRow({
  token,
  isSelected,
  onSelect,
  value,
  onChange,
  editMode,
  readOnly,
}: TokenRowProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [actualColor, setActualColor] = React.useState<string | null>(null);

  // Read actual CSS variable value (for semantic tokens that have been overridden)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !token.name) return;

    const readColor = () => {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(token.name)
        .trim();
      if (cssValue) {
        setActualColor(cssValue);
      } else {
        setActualColor(null);
      }
    };

    // Read immediately
    readColor();

    // Watch for style changes on documentElement
    const observer = new MutationObserver(() => {
      readColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Also poll periodically (fallback for when style attribute doesn't change)
    const interval = setInterval(readColor, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [token.name, value, editMode]); // Re-read when value or mode changes

  const displayValue = value ? formatPaletteValue(value) : "—";

  // Compute HSL - prefer actual CSS variable value, fallback to palette reference
  let swatchBgColor = "hsl(0 0% 50%)"; // default gray
  
  // If we have an actual CSS variable value, use it (means token was overridden)
  if (actualColor) {
    swatchBgColor = `hsl(${actualColor})`;
  } else if (value) {
    // Otherwise use palette reference
    if (value === "white") {
      swatchBgColor = "hsl(0 0% 100%)";
    } else if (value === "black") {
      swatchBgColor = "hsl(0 0% 0%)";
    } else {
      const match = value.match(/^(\w+)-(\d+)$/);
      if (match) {
        const [, rampName, shadeStr] = match;
        const shade = parseInt(shadeStr, 10);
        const ramp = PALETTE_RAMPS.find((r) => r.name === rampName);
        if (ramp) {
          const shadeData = ramp.shades.find((s) => s.shade === shade);
          if (shadeData) {
            // EXACT same format as palette ramps use
            swatchBgColor = `hsl(${ramp.hue} ${ramp.saturation}% ${shadeData.lightness}%)`;
          }
        }
      }
    }
  } else {
    // Fallback to token default
    const hsl = editMode === "light" ? token.lightValue : (token.darkValue || token.lightValue);
    swatchBgColor = `hsl(${hsl})`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1.5 rounded cursor-pointer transition-colors group",
        isSelected
          ? "bg-primary/10 ring-1 ring-primary/30"
          : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      {/* Color swatch - EXACT same pattern as palette ramps */}
      <div
        className="w-4 h-4 rounded-sm border border-border/50 flex-shrink-0"
        style={{
          backgroundColor: swatchBgColor,
        }}
      />

      {/* Label and value */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{token.label}</div>
        <div className="text-[10px] text-muted-foreground truncate">
          {displayValue}
        </div>
      </div>

      {/* Edit button (only if not readOnly and has references) */}
      {!readOnly && token.references && (
        <WexPopover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <WexPopover.Trigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopoverOpen(true);
              }}
            >
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          </WexPopover.Trigger>
          <WexPopover.Content
            side="right"
            align="start"
            className="w-auto p-0"
          >
            <PaletteSwatchPicker
              value={value || ""}
              onSelect={(newValue: string) => {
                onChange(newValue);
                setIsPopoverOpen(false);
              }}
            />
          </WexPopover.Content>
        </WexPopover>
      )}
    </div>
  );
}

// ============================================================================
// Component Token Row (EDITABLE for Layer 3)
// ============================================================================

interface ComponentTokenRowProps {
  token: TokenDefinition;
  isSelected: boolean;
  onSelect: () => void;
  editMode: "light" | "dark";
  value?: string;
  onChange?: (value: string) => void;
}

function ComponentTokenRow({
  token,
  isSelected,
  onSelect,
  editMode,
  value,
  onChange,
}: ComponentTokenRowProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [actualColor, setActualColor] = React.useState<string | null>(null);

  // Read actual CSS variable value
  React.useEffect(() => {
    if (typeof window === 'undefined' || !token.name) return;

    const readColor = () => {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(token.name)
        .trim();
      if (cssValue) {
        setActualColor(cssValue);
      } else {
        setActualColor(null);
      }
    };

    readColor();
    const observer = new MutationObserver(readColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    const interval = setInterval(readColor, 200);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [token.name, editMode, value]);

  const displayValue = value ? formatPaletteValue(value) : "—";

  // Compute swatch color - prefer actual CSS, fallback to palette reference
  let swatchBgColor = "hsl(0 0% 50%)";
  
  if (actualColor) {
    if (actualColor.includes("%")) {
      swatchBgColor = `hsl(${actualColor})`;
    } else {
      swatchBgColor = actualColor;
    }
  } else if (value) {
    // Parse palette reference
    if (value === "white") {
      swatchBgColor = "hsl(0 0% 100%)";
    } else if (value === "black") {
      swatchBgColor = "hsl(0 0% 0%)";
    } else {
      const match = value.match(/^(\w+)-(\d+)$/);
      if (match) {
        const [, rampName, shadeStr] = match;
        const shade = parseInt(shadeStr, 10);
        const ramp = PALETTE_RAMPS.find((r) => r.name === rampName);
        if (ramp) {
          const shadeData = ramp.shades.find((s) => s.shade === shade);
          if (shadeData) {
            swatchBgColor = `hsl(${ramp.hue} ${ramp.saturation}% ${shadeData.lightness}%)`;
          }
        }
      }
    }
  } else {
    const hsl = editMode === "light" ? token.lightValue : (token.darkValue || token.lightValue);
    if (hsl && !hsl.startsWith("var(")) {
      swatchBgColor = `hsl(${hsl})`;
    }
  }

  // Show reference info or current value
  const refInfo = value ? displayValue : (token.references?.replace("--wex-", "") || "");
  const isEditable = token.type === "color" && onChange;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1 rounded cursor-pointer transition-colors group",
        isSelected
          ? "bg-primary/10 ring-1 ring-primary/30"
          : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      {/* Color swatch */}
      {token.type === "color" && (
        <div
          className="w-3 h-3 rounded-sm border border-border/50 flex-shrink-0"
          style={{ backgroundColor: swatchBgColor }}
        />
      )}

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-medium truncate">{token.label}</div>
        {refInfo && (
          <div className="text-[9px] text-muted-foreground truncate">
            {value ? displayValue : `→ ${refInfo}`}
          </div>
        )}
      </div>

      {/* Edit button */}
      {isEditable && (
        <WexPopover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <WexPopover.Trigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopoverOpen(true);
              }}
            >
              <Pencil className="h-2.5 w-2.5 text-muted-foreground" />
            </button>
          </WexPopover.Trigger>
          <WexPopover.Content
            side="right"
            align="start"
            className="w-auto p-0"
          >
            <PaletteSwatchPicker
              value={value || ""}
              onSelect={(newValue: string) => {
                onChange(newValue);
                setIsPopoverOpen(false);
              }}
            />
          </WexPopover.Content>
        </WexPopover>
      )}
    </div>
  );
}

// ============================================================================
// Action Button
// ============================================================================

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  badge?: string;
}

function ActionButton({
  onClick,
  icon,
  label,
  disabled,
  badge,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
        disabled
          ? "text-muted-foreground/50 cursor-not-allowed"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && <span className="ml-auto text-warning text-xs">{badge}</span>}
    </button>
  );
}

// Re-export type for backward compatibility
export type ThemeBuilderMode = "palette" | "semantic";
