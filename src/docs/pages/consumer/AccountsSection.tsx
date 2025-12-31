import { useNavigate } from "react-router-dom";
import { WexCard } from "@/components/wex/wex-card";
import { WexButton } from "@/components/wex/wex-button";
import { AlertCircle, ChevronRight } from "lucide-react";
import { hsaData, fsaData } from "./mockData";

/**
 * Accounts Section Component
 * 
 * Displays HSA and FSA account cards following Figma design:
 * - Section header with action buttons
 * - Two cards side-by-side showing account types and balances
 * - Table layout with proper headers and dividers
 */
export function AccountsSection() {
  const navigate = useNavigate();

  return (
    <WexCard>
      <WexCard.Content className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Accounts
            </h2>
            <div className="flex items-center gap-4">
              <WexButton 
                intent="link" 
                size="md"
              >
                View All Accounts
                <ChevronRight className="h-4 w-4" />
              </WexButton>
              <WexButton intent="primary" size="md" onClick={() => navigate("/reimburse")}>
                Reimburse Myself
              </WexButton>
            </div>
          </div>

          {/* Account Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HSA Card */}
            <WexCard className="shadow-sm">
              <WexCard.Content className="p-6 space-y-6">
                {/* Card Title */}
                <h3 className="text-lg font-medium text-foreground">
                  {hsaData.title}
                </h3>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Table */}
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm font-semibold text-foreground px-3.5">
                      Account Type
                    </span>
                    <span className="text-sm font-semibold text-foreground px-3.5">
                      Available Balance
                    </span>
                  </div>

                  {/* Account Rows */}
                  {hsaData.accounts.map((account, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center py-2">
                        <WexButton
                          intent="link"
                          size="md"
                          className="h-auto px-3 py-2 text-base font-medium"
                        >
                          {account.type}
                        </WexButton>
                        <span className="text-sm text-foreground px-3.5">
                          {account.balance}
                        </span>
                      </div>
                      {index < hsaData.accounts.length - 1 && (
                        <div className="h-px bg-border/60" />
                      )}
                    </div>
                  ))}
                </div>
              </WexCard.Content>
            </WexCard>

            {/* FSA Card */}
            <WexCard className="shadow-sm">
              <WexCard.Content className="p-6 space-y-6">
                {/* Card Title */}
                <h3 className="text-lg font-medium text-foreground">
                  {fsaData.title}
                </h3>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Table */}
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm font-semibold text-foreground px-3.5">
                      Account Type
                    </span>
                    <span className="text-sm font-semibold text-foreground px-3.5">
                      Available Balance
                    </span>
                  </div>

                  {/* Account Rows */}
                  {fsaData.accounts.map((account, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <WexButton
                            intent="link"
                            size="lg"
                            className="h-auto px-3 py-2 text-base font-medium"
                          >
                            {account.type}
                          </WexButton>
                          {account.hasAlert && (
                            <AlertCircle className="h-4 w-4 text-foreground" />
                          )}
                        </div>
                        <div className="text-right px-3.5">
                          <div className="text-sm text-foreground">
                            {account.balance}
                          </div>
                          {account.daysLeft && (
                            <div className="text-sm text-foreground">
                              {account.daysLeft} day(s) left to spend
                            </div>
                          )}
                        </div>
                      </div>
                      {index < fsaData.accounts.length - 1 && (
                        <div className="h-px bg-border/60" />
                      )}
                    </div>
                  ))}
                </div>
              </WexCard.Content>
            </WexCard>
          </div>
        </div>
      </WexCard.Content>
    </WexCard>
  );
}

