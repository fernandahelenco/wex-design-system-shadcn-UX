import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import { PropsTable, type PropDefinition } from "@/docs/components/PropsTable";
import { WexButtonGroup, WexButton } from "@/components/wex";

// Props documentation
const buttonGroupProps: PropDefinition[] = [
  { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction" },
  { name: "attached", type: "boolean", default: "false", description: "Remove gaps between buttons" },
  { name: "className", type: "string", description: "Additional CSS classes" },
];

// Token mappings for WexButtonGroup
const buttonGroupTokens: TokenRow[] = [
  { element: "Container", property: "Gap", token: "(flex container)" },
  { element: "Separator", property: "Color", token: "--border" },
  { element: "Note", property: "", token: "Individual buttons use WexButton tokens" },
];

export default function ButtonGroupPage() {
  return (
    <ComponentPage
      title="Button Group"
      description="Container for grouping related buttons together."
      status="stable"
      registryKey="button-group"
    >
      <Section title="Overview">
        <ExampleCard>
          <WexButtonGroup>
            <WexButton variant="outline">Left</WexButton>
            <WexButton variant="outline">Center</WexButton>
            <WexButton variant="outline">Right</WexButton>
          </WexButtonGroup>
        </ExampleCard>
      </Section>

      <Section title="Variants" description="Different orientations for button groups.">
        <div className="space-y-6">
          <ExampleCard title="Horizontal" description="Default horizontal layout.">
            <WexButtonGroup orientation="horizontal">
              <WexButton variant="outline">One</WexButton>
              <WexButton variant="outline">Two</WexButton>
              <WexButton variant="outline">Three</WexButton>
            </WexButtonGroup>
          </ExampleCard>

          <ExampleCard title="Vertical" description="Stacked vertical layout.">
            <WexButtonGroup orientation="vertical">
              <WexButton variant="outline">First</WexButton>
              <WexButton variant="outline">Second</WexButton>
              <WexButton variant="outline">Third</WexButton>
            </WexButtonGroup>
          </ExampleCard>

          <ExampleCard title="With Separator" description="Visual separator between buttons.">
            <WexButtonGroup>
              <WexButton variant="outline">Edit</WexButton>
              <WexButtonGroup.Separator />
              <WexButton variant="outline">Delete</WexButton>
            </WexButtonGroup>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-2">Role Group</h3>
          <p className="text-sm text-muted-foreground">
            WexButtonGroup uses role="group" to indicate related buttons to 
            screen readers. Each button remains individually focusable.
          </p>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexButtonGroup, WexButton } from "@/components/wex";

// Horizontal group
<WexButtonGroup>
  <WexButton variant="outline">Left</WexButton>
  <WexButton variant="outline">Center</WexButton>
  <WexButton variant="outline">Right</WexButton>
</WexButtonGroup>

// Vertical group
<WexButtonGroup orientation="vertical">
  <WexButton variant="outline">First</WexButton>
  <WexButton variant="outline">Second</WexButton>
</WexButtonGroup>

// With separator
<WexButtonGroup>
  <WexButton variant="outline">Edit</WexButton>
  <WexButtonGroup.Separator />
  <WexButton variant="outline">Delete</WexButton>
</WexButtonGroup>`}
        />
      </Section>

      <Section title="API Reference">
        <PropsTable props={buttonGroupProps} />
      </Section>

      <TokenReference tokens={buttonGroupTokens} className="mt-12" />
    </ComponentPage>
  );
}

