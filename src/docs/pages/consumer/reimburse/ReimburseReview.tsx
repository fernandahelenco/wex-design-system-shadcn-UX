import { useNavigate } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import {
  WexButton,
  WexCard,
  WexFloatLabel,
  WexTextarea,
  WexRadioGroup,
  WexLabel,
  WexSeparator,
  WexAlert,
} from "@/components/wex";
import { Info, AlertCircle } from "lucide-react";

// Helper function to get plan card data by account value
const getPlanCardData = (accountValue: string) => {
  const plans = {
    "medical-fsa": {
      title: "Medical FSA",
      dateRange: "01/01/2026 - 12/31/2026",
      balance: "$2,734.76",
      finalFilingDate: "04/30/2027",
      finalServiceDate: "12/31/2026",
    },
    "lifestyle-spending-2026": {
      title: "Lifestyle Spending Account",
      dateRange: "01/01/2026 - 12/31/2026",
      balance: "$250.00",
      finalFilingDate: "04/30/2027",
      finalServiceDate: "12/31/2026",
    },
    "lifestyle-spending-2025": {
      title: "Lifestyle Spending Account",
      dateRange: "01/01/2025 - 12/31/2025",
      balance: "$250.00",
      finalFilingDate: "04/30/2026",
      finalServiceDate: "12/31/2025",
    },
  };
  return plans[accountValue as keyof typeof plans] || plans["medical-fsa"];
};

// Plan Card Component
const PlanCard = ({
  title,
  dateRange,
  balance,
  finalFilingDate,
  finalServiceDate,
}: {
  title: string;
  dateRange: string;
  balance: string;
  finalFilingDate: string;
  finalServiceDate: string;
}) => (
  <WexCard className="border border-border w-[325px] shrink-0">
    <WexCard.Content className="p-4 space-y-2">
      {/* Header with title, date range, and info icon */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-foreground leading-6 tracking-[-0.176px]">
            {title}
          </p>
          <p className="text-[11px] font-normal text-muted-foreground leading-4 tracking-[0.055px]">
            {dateRange}
          </p>
        </div>
        <WexButton
          intent="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          aria-label="Account information"
        >
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
        </WexButton>
      </div>

      {/* Balance and dates */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center">
          <p className="text-xl font-bold text-foreground leading-8 tracking-[-0.34px]">
            {balance}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm leading-6 tracking-[-0.084px]">
          <span className="text-muted-foreground">Final Filing Date:</span>
          <span className="text-foreground">{finalFilingDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm leading-6 tracking-[-0.084px]">
          <span className="text-muted-foreground">Final Service Date:</span>
          <span className="text-foreground">{finalServiceDate}</span>
        </div>
      </div>
    </WexCard.Content>
  </WexCard>
);

export default function ReimburseReview() {
  const navigate = useNavigate();
  const { state, updateState } = useReimbursement();

  // Use extracted data or fallback to form data
  const extractedData = state.extractedData || {};
  const formData = {
    startDate: extractedData.startDate || state.serviceDate || "06/20/2026",
    endDate: extractedData.endDate || state.serviceDate || "06/20/2026",
    amount: extractedData.amount || state.amount || "$150.00",
    provider: extractedData.provider || state.provider || "Dr. Jorge Doe",
    category: extractedData.category || state.category || "Medical",
    type: extractedData.type || "Office Visit",
    description: extractedData.description || "",
  };

  const recipient = state.recipient || "adam";
  const didDrive = state.didDrive || "no";

  const handleRecipientChange = (value: string) => {
    updateState({ recipient: value });
  };

  const handleDriveChange = (value: string) => {
    updateState({ didDrive: value });
  };

  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-8">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>

          <WexCard>
            <WexCard.Content className="space-y-6 p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground leading-8 tracking-[-0.34px]">
                  Available Balance
                </h2>
                
                {/* Selected Plan Card */}
                {state.account && (() => {
                  const planData = getPlanCardData(state.account);
                  return (
                    <div className="flex gap-6 items-start">
                      <PlanCard
                        title={planData.title}
                        dateRange={planData.dateRange}
                        balance={planData.balance}
                        finalFilingDate={planData.finalFilingDate}
                        finalServiceDate={planData.finalServiceDate}
                      />
                    </div>
                  );
                })()}
              </div>

              <WexSeparator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">Uploaded document</h2>
                </div>
                <WexAlert intent="info" className="rounded-md bg-primary/5 px-3 py-2 text-xs text-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <WexAlert.Description>
                    The form has been pre-filled for your convenience. Please review and correct any errors to ensure accuracy.
                  </WexAlert.Description>
                </WexAlert>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="grid gap-4">
                      <WexFloatLabel
                        label="Start Date of Service"
                        value={formData.startDate}
                        readOnly
                      />
                      <WexFloatLabel
                        label="End Date of Service"
                        value={formData.endDate}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Amount"
                        value={formData.amount}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Provider"
                        value={formData.provider}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Category"
                        value={formData.category}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Type"
                        value={formData.type}
                        readOnly
                      />
                      <div className="relative">
                        <WexTextarea
                          rows={3}
                          value={formData.description}
                          readOnly
                          placeholder=" "
                          className={`h-auto min-h-[80px] pt-5 pb-2 ${formData.description ? "has-value" : ""}`}
                        />
                        <label className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm ${
                          formData.description 
                            ? "top-2 scale-75 -translate-y-2.5 text-wex-floatlabel-label-focus-fg" 
                            : "top-4 scale-100 translate-y-0 text-wex-floatlabel-label-fg"
                        }`}>
                          Description
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Recipient</p>
                        <WexRadioGroup value={recipient} onValueChange={handleRecipientChange} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="adam" id="recipient-adam" />
                            <WexLabel htmlFor="recipient-adam" className="text-sm font-medium text-foreground">
                              Adam Smith
                            </WexLabel>
                          </div>
                          <WexButton intent="primary" variant="link" className="px-0 justify-start h-auto p-0">
                            + Add a dependent
                          </WexButton>
                        </WexRadioGroup>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Did you drive to receive this product or service?
                        </p>
                        <WexRadioGroup value={didDrive} onValueChange={handleDriveChange} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="yes" id="drive-yes" />
                            <WexLabel htmlFor="drive-yes" className="text-sm text-foreground">
                              Yes
                            </WexLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="no" id="drive-no" />
                            <WexLabel htmlFor="drive-no" className="text-sm text-foreground">
                              No
                            </WexLabel>
                          </div>
                        </WexRadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-center lg:justify-end">
                    <div className="flex h-full w-full max-w-[360px] items-center justify-center rounded-md border bg-muted p-4">
                      <div className="h-[360px] w-[260px] rounded-sm bg-card shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <WexSeparator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Extracted information</h3>
                <WexCard>
                  <WexCard.Content className="p-0">
                    <div className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Eligible Items</span>
                      <span className="text-foreground">$150.00</span>
                    </div>
                    <WexSeparator />
                    <div className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Office Visit</span>
                      <span className="text-foreground">$150.00</span>
                    </div>
                    <WexSeparator />
                    <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground">
                      <span>Total</span>
                      <span>$150.00</span>
                    </div>
                  </WexCard.Content>
                </WexCard>
              </div>

              <div className="flex items-center justify-between pt-2">
                <WexButton variant="ghost" onClick={() => navigate("/")}>
                  Cancel
                </WexButton>
                <div className="flex gap-2">
                  <WexButton intent="secondary" onClick={() => navigate("/reimburse/docs")}>
                    Previous
                  </WexButton>
                  <WexButton intent="primary" onClick={() => navigate("/reimburse/confirm")}>
                    Next
                  </WexButton>
                </div>
              </div>
            </WexCard.Content>
          </WexCard>
        </div>
      </div>
    </div>
  );
}

