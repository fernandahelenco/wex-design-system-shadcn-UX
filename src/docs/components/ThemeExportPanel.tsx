/**
 * ThemeExportPanel Component
 * 
 * Displays CSS and JSON code blocks for theme overrides with copy/export functionality.
 */

import * as React from "react";
import { Copy, Download, Check } from "lucide-react";
import { WexButton } from "@/components/wex";

interface ThemeExportPanelProps {
  cssCode: string;
  jsonCode: string;
  onExportCSS?: () => void;
  onExportJSON?: () => void;
}

export function ThemeExportPanel({
  cssCode,
  jsonCode,
  onExportCSS,
  onExportJSON,
}: ThemeExportPanelProps) {
  const [copiedCSS, setCopiedCSS] = React.useState(false);
  const [copiedJSON, setCopiedJSON] = React.useState(false);

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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Export Theme</h3>
        <p className="text-xs text-muted-foreground">
          Copy or download your theme overrides in CSS or JSON format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                variant="ghost"
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
              {onExportCSS && (
                <WexButton
                  variant="ghost"
                  size="sm"
                  onClick={onExportCSS}
                  className="h-7 px-2"
                >
                  <Download className="h-3 w-3" />
                </WexButton>
              )}
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-foreground whitespace-pre">
              <code>{cssCode}</code>
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
                variant="ghost"
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
              {onExportJSON && (
                <WexButton
                  variant="ghost"
                  size="sm"
                  onClick={onExportJSON}
                  className="h-7 px-2"
                >
                  <Download className="h-3 w-3" />
                </WexButton>
              )}
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-foreground whitespace-pre">
              <code>{jsonCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

