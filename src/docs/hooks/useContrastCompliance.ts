/**
 * useContrastCompliance Hook
 * 
 * Real-time WCAG contrast compliance checking for the Theme Builder.
 * Monitors CSS variable changes and re-evaluates contrast pairs.
 * 
 * Returns compliance status for all defined contrast pairs.
 */

import * as React from "react";
import {
  getContrastData,
  CONTRAST_PAIRS,
  CONTRAST_THRESHOLDS,
  type A11yIssue,
  type ContrastPair,
  type ContrastRating,
} from "@/docs/utils/contrast";

// ============================================================================
// Types
// ============================================================================

export interface ContrastCheckResult {
  pair: ContrastPair;
  ratio: number;
  rating: ContrastRating;
  passes: boolean;
  suggestion?: string;
}

export interface ContrastComplianceState {
  /** All check results (both passing and failing) */
  results: ContrastCheckResult[];
  /** Only the failing pairs */
  issues: A11yIssue[];
  /** Count of passing pairs */
  passCount: number;
  /** Count of failing pairs */
  failCount: number;
  /** Total number of pairs checked */
  totalCount: number;
  /** Whether all pairs pass WCAG AA */
  isCompliant: boolean;
  /** Check if a specific preview card has issues */
  hasIssuesForCard: (cardTitle: string) => boolean;
  /** Get issues for a specific preview card */
  getIssuesForCard: (cardTitle: string) => ContrastCheckResult[];
}

// ============================================================================
// Suggestion Generator
// ============================================================================

function getSuggestion(pair: ContrastPair, ratio: number): string {
  const deficit = CONTRAST_THRESHOLDS.AA_NORMAL - ratio;
  
  if (pair.foreground.includes("foreground")) {
    // Foreground is text, background is the fill
    if (deficit > 2) {
      return `Significantly low contrast (${ratio.toFixed(1)}:1). Try a much darker background shade or lighter text.`;
    } else if (deficit > 1) {
      return `Moderate contrast issue. Try adjusting the background 2-3 shades darker.`;
    } else {
      return `Nearly passing. Adjust the background 1 shade darker or lighter text.`;
    }
  }
  
  // Generic suggestion
  return `Current ratio is ${ratio.toFixed(2)}:1. WCAG AA requires 4.5:1 minimum.`;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useContrastCompliance(): ContrastComplianceState {
  const [results, setResults] = React.useState<ContrastCheckResult[]>([]);

  // Run contrast checks
  const runChecks = React.useCallback(() => {
    const checkResults: ContrastCheckResult[] = [];

    for (const pair of CONTRAST_PAIRS) {
      const data = getContrastData(pair.foreground, pair.background);
      
      if (data) {
        const passes = data.rating !== "Fail";
        checkResults.push({
          pair,
          ratio: data.ratio,
          rating: data.rating,
          passes,
          suggestion: passes ? undefined : getSuggestion(pair, data.ratio),
        });
      }
    }

    setResults(checkResults);
  }, []);

  // Initial check and observe for changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    runChecks();

    // Watch for style changes on documentElement (theme overrides)
    const observer = new MutationObserver(() => {
      // Debounce slightly to batch rapid changes
      requestAnimationFrame(runChecks);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also observe body for theme class changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [runChecks]);

  // Compute derived state
  const issues = React.useMemo(() => {
    return results
      .filter((r) => !r.passes)
      .map((r) => ({
        pair: r.pair,
        ratio: r.ratio,
        required: CONTRAST_THRESHOLDS.AA_NORMAL,
        rating: r.rating,
      }));
  }, [results]);

  const passCount = results.filter((r) => r.passes).length;
  const failCount = results.filter((r) => !r.passes).length;
  const totalCount = results.length;
  const isCompliant = failCount === 0 && totalCount > 0;

  // Helper to check if a card has issues
  const hasIssuesForCard = React.useCallback(
    (cardTitle: string): boolean => {
      return results.some(
        (r) => !r.passes && r.pair.previewCard === cardTitle
      );
    },
    [results]
  );

  // Helper to get issues for a card
  const getIssuesForCard = React.useCallback(
    (cardTitle: string): ContrastCheckResult[] => {
      return results.filter((r) => r.pair.previewCard === cardTitle);
    },
    [results]
  );

  return {
    results,
    issues,
    passCount,
    failCount,
    totalCount,
    isCompliant,
    hasIssuesForCard,
    getIssuesForCard,
  };
}

