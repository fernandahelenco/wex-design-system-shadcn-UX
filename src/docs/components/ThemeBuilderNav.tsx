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
import { WexSeparator, WexAlertDialog, WexPopover } from "@/components/wex";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sun,
  Moon,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeBuilder } from "@/docs/context/ThemeBuilderContext";
import {
  PALETTE_RAMPS,
  SEMANTIC_TOKENS,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  NEUTRAL_TOKENS,
  type TokenDefinition,
  type PaletteRamp,
} from "@/docs/data/tokenRegistry";
import { PaletteSwatchPicker, formatPaletteValue } from "./PaletteSwatchPicker";

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
  onExport,
  onReset,
  hasUnsavedChanges = false,
  hasOverrides = false,
}: ThemeBuilderNavProps) {
  const { exitThemeBuilder, editMode, setEditMode } = useThemeBuilder();

  // Exit confirmation dialog state
  const [showExitDialog, setShowExitDialog] = React.useState(false);

  // Section open/closed state
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({
    palette: true,
    intent: true,
    surfaces: false,
    text: false,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle exit with unsaved changes warning
  const handleExit = React.useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      exitThemeBuilder();
    }
  }, [hasUnsavedChanges, exitThemeBuilder]);

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
        {/* Palette Ramps Section */}
        <CollapsibleSection
          label="Palette Ramps"
          isOpen={openSections.palette}
          onToggle={() => toggleSection("palette")}
        >
          <div className="space-y-3">
            {PALETTE_RAMPS.map((ramp) => (
              <PaletteRampRow
                key={ramp.name}
                ramp={ramp}
                isSelected={selectedToken === `--wex-palette-${ramp.name}-500`}
                onSelect={() =>
                  onSelectToken(`--wex-palette-${ramp.name}-500`)
                }
                editMode={editMode}
              />
            ))}
            {/* Neutrals */}
            <div className="pt-1 border-t border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider px-1 mb-1">
                Neutrals
              </div>
              {NEUTRAL_TOKENS.map((neutral) => (
                <div
                  key={neutral.name}
                  className={cn(
                    "flex items-center gap-2 px-1 py-1 rounded cursor-pointer",
                    selectedToken === neutral.token
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => onSelectToken(neutral.token)}
                >
                  <div
                    className="w-4 h-4 rounded-sm ring-1 ring-border/50 flex-shrink-0"
                    style={{ backgroundColor: `hsl(${neutral.value})` }}
                  />
                  <span className="text-xs">{neutral.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

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
      </div>

      {/* Actions at bottom */}
      <div className="p-3 border-t border-border space-y-1">
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
          disabled={!hasOverrides}
        />
        <WexSeparator className="my-2" />
        <ActionButton
          onClick={handleExit}
          icon={<ArrowLeft className="h-4 w-4" />}
          label="Exit Theme Builder"
          badge={hasUnsavedChanges ? "●" : undefined}
        />
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
// Palette Ramp Row (shows ramp preview)
// ============================================================================

interface PaletteRampRowProps {
  ramp: PaletteRamp;
  isSelected: boolean;
  onSelect: () => void;
  editMode: "light" | "dark";
}

function PaletteRampRow({
  ramp,
  isSelected,
  onSelect,
  editMode,
}: PaletteRampRowProps) {
  // Get the 500 shade value
  const shade500 = ramp.shades.find((s) => s.shade === 500);
  const hslValue = shade500
    ? `${ramp.hue} ${ramp.saturation}% ${shade500.lightness}%`
    : "0 0% 50%";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1.5 rounded cursor-pointer transition-colors",
        isSelected ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      {/* Mini ramp preview - show 3 key shades */}
      <div className="flex gap-px">
        {[200, 500, 800].map((shade) => {
          const shadeData = ramp.shades.find((s) => s.shade === shade);
          const l = shadeData?.lightness ?? 50;
          return (
            <div
              key={shade}
              className="w-3 h-4 first:rounded-l-sm last:rounded-r-sm"
              style={{
                backgroundColor: `hsl(${ramp.hue} ${ramp.saturation}% ${l}%)`,
              }}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium">{ramp.label}</span>
    </div>
  );
}

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

  // Get current color for swatch
  const getSwatchColor = () => {
    if (value) {
      // It's a palette reference like "blue-700"
      return `var(--wex-palette-${value})`;
    }
    // Fall back to the token's default value
    const hsl =
      editMode === "light"
        ? token.lightValue
        : token.darkValue || token.lightValue;
    return `hsl(${hsl})`;
  };

  const displayValue = value ? formatPaletteValue(value) : "—";

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
      {/* Color swatch */}
      <div
        className="w-4 h-4 rounded-sm ring-1 ring-border/50 flex-shrink-0"
        style={{ backgroundColor: getSwatchColor() }}
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
              onChange={(newValue) => {
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
