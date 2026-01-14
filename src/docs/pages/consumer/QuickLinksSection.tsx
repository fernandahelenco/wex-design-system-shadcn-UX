import { useNavigate } from "react-router-dom";
import { WexCard } from "@/components/wex/wex-card";
import { WexButton } from "@/components/wex/wex-button";
import { quickLinksData } from "./mockData";

/**
 * Quick Links Section
 * 
 * Displays quick action links in a pill-style button layout
 */
export function QuickLinksSection() {
  const navigate = useNavigate();

  const handleLinkClick = (label: string) => {
    if (label === "Reimburse Myself") {
      navigate("/reimburse");
    }
    // Add other navigation handlers here as needed
  };

  return (
    <WexCard className="h-full">
      <WexCard.Content className="p-6 h-full">
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Quick Links
          </h2>

          {/* Quick Links Grid */}
          <div className="flex flex-wrap gap-2">
            {quickLinksData.map((link, index) => (
              <WexButton
                key={index}
                variant="ghost"
                size="md"
                className="rounded-[32px] bg-info/10 text-primary hover:bg-info/20 shrink-0 h-auto py-1"
                onClick={() => handleLinkClick(link.label)}
              >
                {link.label}
              </WexButton>
            ))}
          </div>
        </div>
      </WexCard.Content>
    </WexCard>
  );
}

