import { Section } from "@/docs/components/Section";
import { ProseBlock, Guidance } from "@/docs/components/ProseBlock";
import { WexSeparator } from "@/components/wex";

/**
 * Story page - How We Built the WEX Design System
 * Conversational narrative explaining the approach and philosophy
 */
export default function StoryPage() {
  return (
    <article>
      <header className="mb-12">
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          How We Built the WEX Design System (On Purpose)
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          A candid look at what we built, why we built it this way, and what
          still needs work.
        </p>
      </header>

      <div className="space-y-12 max-w-3xl">
        {/* Opening */}
        <Section title="The Question">
          <ProseBlock>
            <p>We weren't trying to "build an app with AI."</p>
            <p>We were trying to answer a more useful question:</p>
            <p className="text-lg font-medium text-foreground">
              Can we use AI to help us build a real design system—without giving
              up control, quality, or common sense?
            </p>
            <p>
              So instead of letting AI run wild, we treated it like a junior
              teammate: helpful, fast, and supervised.
            </p>
          </ProseBlock>
        </Section>

        <WexSeparator />

        {/* Tokens */}
        <Section title="Tokens First, Everything Else Second">
          <ProseBlock>
            <p>
              We started with design tokens because experience has taught us one
              thing: if you skip tokens, you pay for it later.
            </p>
            <p>
              All brand values live in WEX tokens. Tokens are emitted as CSS
              variables. Light and dark mode were planned from the beginning,
              not bolted on at the end.
            </p>
            <p>
              We then mapped those tokens into Tailwind and shadcn semantics so
              components never touch raw colors. Components don't know what
              "blue" is. They only know "primary."
            </p>
          </ProseBlock>
          <Guidance>That's intentional.</Guidance>
        </Section>

        <WexSeparator />

        {/* Components */}
        <Section title="Components: WEX Is the Contract">
          <ProseBlock>
            <p>
              We use shadcn and Radix because they're solid—but we don't teach
              teams how to use them.
            </p>
            <p>
              Everything that shows up in the design system is a WEX component,
              even if it wraps a third-party library behind the scenes. That
              gives us consistent APIs, consistent theming, and consistent
              accessibility behavior.
            </p>
            <p>And yes, we made it a rule. If you add a component, it needs:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              <li>a WEX prefix</li>
              <li>documentation</li>
              <li>real examples</li>
              <li>accessibility checks</li>
              <li>and a changelog entry</li>
            </ul>
          </ProseBlock>
          <Guidance>No exceptions. No "just this once."</Guidance>
        </Section>

        <WexSeparator />

        {/* Docs */}
        <Section title="Docs That Actually Teach You Something">
          <ProseBlock>
            <p>The docs site isn't a gallery—it's a reference you can use.</p>
            <p>Every component:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              <li>is shown as a WEX component</li>
              <li>has real, working examples</li>
              <li>uses tokens correctly</li>
              <li>includes guidance on when and how to use it</li>
            </ul>
            <p>
              If a component has a page, it has examples. If it doesn't have
              examples, it doesn't get a page.
            </p>
          </ProseBlock>
        </Section>

        <WexSeparator />

        {/* Accessibility */}
        <Section title="Accessibility Without Pretending">
          <ProseBlock>
            <p>We avoided saying "WCAG compliant" very intentionally.</p>
            <p>Instead, we built accessibility signals:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              <li>automated tests with Playwright and axe-core</li>
              <li>scoped to component examples only</li>
              <li>stored as data, not vibes</li>
            </ul>
            <p>
              What you see is Pass, Partial, or Fail, with a WCAG level mapping.
              It's honest, traceable, and doesn't overpromise.
            </p>
          </ProseBlock>
        </Section>

        <WexSeparator />

        {/* Dashboard */}
        <Section title="From Badge to Details to Action">
          <ProseBlock>
            <p>You don't just get a badge and a shrug.</p>
            <p>
              Component pages show a quick accessibility summary. Clicking that
              takes you to a full Accessibility dashboard that shows system-wide
              health, light vs dark results, and which components need
              attention.
            </p>
            <p>Rows are clickable because… that's what tables like this are for.</p>
          </ProseBlock>
        </Section>

        <WexSeparator />

        {/* Status */}
        <Section title="Where This Stands (And What Still Needs Work)">
          <ProseBlock>
            <p>This isn't a victory lap yet—and that's intentional.</p>
            <p>
              You'll notice several accessibility failures across components.
              Those are real. We didn't hide them, soften them, or explain them
              away. If something fails, it shows up as a fail.
            </p>
            <p>
              Given the timeline (roughly ten hours total) and the fact that
              this was driven by a single former developer using AI as a
              collaborator, the amount of ground covered is significant—but
              there's still work to do, especially around accessibility.
            </p>
            <p>The important part is this:</p>
          </ProseBlock>
          <Guidance>
            We now know exactly what needs fixing, where it lives, and how to
            verify improvements when they're made. That's a much better place to
            be than "we think it's accessible."
          </Guidance>
        </Section>

        <WexSeparator />

        {/* AI */}
        <Section title="How AI Actually Helped">
          <ProseBlock>
            <p>AI didn't design this system.</p>
            <p>
              It helped us plan work clearly, enforce rules consistently, catch
              gaps, and move faster without breaking things.
            </p>
            <p className="font-medium text-foreground">
              Humans stayed in charge. AI stayed useful.
            </p>
          </ProseBlock>
        </Section>
      </div>
    </article>
  );
}

