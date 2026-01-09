import { ConsumerNavigation } from "./consumer/ConsumerNavigation";
import { TitleBar } from "./account-overview/TitleBar";
import { AccountSummaryCards } from "./account-overview/AccountSummaryCards";
import { RecentTransactionsTable } from "./account-overview/RecentTransactionsTable";
import { PreviousPlanYearTable } from "./account-overview/PreviousPlanYearTable";
import { WexButton } from "@/components/wex/wex-button";
import { Link } from "react-router-dom";

/**
 * Account Overview Page
 * 
 * Standalone page showing detailed account information:
 * - Custom navigation header (reused from Consumer Experience)
 * - Title bar with action buttons
 * - Account summary cards
 * - Recent transactions table with filters
 * - Previous plan year table
 * - Footer
 * 
 * All components use WEX Design System components.
 */
export default function AccountOverviewPage() {
  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      {/* Navigation Header */}
      <ConsumerNavigation />

      {/* Main Content */}
      <main className="w-full max-w-[1440px] mx-auto px-8 py-7 space-y-6">
        {/* Title Bar */}
        <TitleBar />

        {/* Account Summary Cards */}
        <AccountSummaryCards />

        {/* Recent Transactions */}
        <RecentTransactionsTable />

        {/* Previous Plan Year */}
        <PreviousPlanYearTable />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-12">
        <div className="w-full max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <WexButton intent="primary" variant="link" size="sm" asChild>
                <Link to="#">Copyright</Link>
              </WexButton>
              <WexButton intent="primary" variant="link" size="sm" asChild>
                <Link to="#">Disclaimer</Link>
              </WexButton>
              <WexButton intent="primary" variant="link" size="sm" asChild>
                <Link to="#">Privacy Policy</Link>
              </WexButton>
              <WexButton intent="primary" variant="link" size="sm" asChild>
                <Link to="#">Terms of Use</Link>
              </WexButton>
            </div>
            <div className="text-center md:text-right">
              <p>WEX Health Inc. 2004-2026. All rights reserved. Powered by WEX Health.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

