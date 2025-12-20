import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
// Load languages in dependency order: typescript and jsx must come before tsx
import "prismjs/components/prism-markup"; // Required for JSX
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: "tsx" | "typescript" | "jsx" | "javascript" | "bash" | "json" | "css";
  filename?: string;
}

/**
 * Enhanced code block with syntax highlighting and copy functionality
 * Uses Prism.js for highlighting with WEX design system theming
 * Adapts to light/dark mode using semantic tokens
 */
export function CodeBlock({ code, language = "tsx", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group relative rounded-lg border border-border bg-muted/50 dark:bg-card overflow-hidden">
      {/* Header bar with filename and copy button */}
      <div className="flex items-center justify-between border-b border-border bg-muted/80 dark:bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/80" />
            <div className="h-3 w-3 rounded-full bg-warning/80" />
            <div className="h-3 w-3 rounded-full bg-success/80" />
          </div>
          {filename && (
            <span className="ml-3 text-xs font-mono text-muted-foreground">{filename}</span>
          )}
        </div>
        
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all",
            copied
              ? "bg-success/20 text-success"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm !bg-transparent !m-0">
        <code
          ref={codeRef}
          className={`language-${language} !text-sm !leading-relaxed`}
        >
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
