import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import {
  WexButton,
  WexCard,
  WexCheckbox,
  WexAlert,
  WexSeparator,
  WexLabel,
  WexBadge,
} from "@/components/wex";
import { Info, Upload, ExternalLink, X, FileText, Check } from "lucide-react";

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

export default function ReimburseDocs() {
  const navigate = useNavigate();
  const { state, updateState } = useReimbursement();
  const [autoAnalyze, setAutoAnalyze] = useState(state.autoAnalyze ?? true);
  const [uploads, setUploads] = useState<Array<{ name: string; size: string; status: "uploaded"; date: string }>>(
    (state.uploadedFiles || []).map((file) => ({ ...file, status: file.status ?? "uploaded" }))
  );

  const hasUploads = uploads.length > 0;

  const handleRemove = (name: string) => {
    const newUploads = uploads.filter((file) => file.name !== name);
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleMockUpload = () => {
    // Mock upload - add a file when button is clicked
    const newFile = { name: "Receipt.pdf", size: "184 KB", status: "uploaded" as const, date: "Jan 16" };
    const newUploads = [...uploads, newFile];
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleNext = () => {
    updateState({ autoAnalyze });
    if (autoAnalyze) {
      navigate("/reimburse/analyze");
    } else {
      navigate("/reimburse/review");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-6">
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
                  <h2 className="text-base font-semibold text-foreground">Receipt or Documentation</h2>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>

                <WexButton
                  intent="primary"
                  variant="link"
                  className="flex items-center gap-1 text-sm font-medium h-auto p-0"
                >
                  What information is required? <ExternalLink className="h-3.5 w-3.5" />
                </WexButton>

                <div className="rounded-lg border border-dashed bg-card p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <WexButton intent="secondary" className="min-w-[200px]" onClick={handleMockUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Valid Documentation
                      </WexButton>
                    </div>
                  </div>
                  {!hasUploads ? (
                    <p className="mt-3 text-sm text-muted-foreground">Drag and drop files here to upload.</p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {uploads.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size} • Added {file.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <WexBadge intent="success" className="flex items-center gap-1 text-xs">
                              <Check className="h-3.5 w-3.5" />
                              Uploaded
                            </WexBadge>
                            <WexButton variant="ghost" size="sm" onClick={() => handleRemove(file.name)}>
                              <X className="h-4 w-4" />
                            </WexButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <WexCheckbox
                      id="auto-analyze"
                      checked={autoAnalyze}
                      onCheckedChange={(checked) => setAutoAnalyze(Boolean(checked))}
                    />
                    <WexLabel htmlFor="auto-analyze" className="flex items-center gap-1 text-sm text-foreground">
                      Auto-analyze my claims info <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </WexLabel>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We are unable to auto-analyze multiple documents.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <WexButton variant="ghost" onClick={() => navigate("/")}>
                    Cancel
                  </WexButton>
                  <div className="flex items-center gap-2">
                    <WexButton intent="secondary" onClick={() => navigate("/reimburse")}>
                      Previous
                    </WexButton>
                    <WexButton intent="primary" onClick={handleNext}>
                      Next
                    </WexButton>
                  </div>
                </div>
              </div>
            </WexCard.Content>
          </WexCard>

          <WexAlert intent="default" className="bg-transparent p-0 text-xs text-muted-foreground">
            <WexAlert.Description>
              We collect information about the use of this portal (for example, how long you are on the
              portal, the pages you visit, etc.) so that we can understand and improve user experience.
              For more information about our privacy practices, click here.
            </WexAlert.Description>
          </WexAlert>
        </div>
      </div>
    </div>
  );
}

