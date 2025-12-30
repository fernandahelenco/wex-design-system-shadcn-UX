# Consumer Experience Page

A comprehensive consumer-facing demo page showcasing the WEX Design System in action.

## Overview

The Consumer Experience page demonstrates a complete health savings account (HSA/FSA) management interface with modern UI/UX patterns and data visualization.

## Features

### 🎨 Components Built

1. **ConsumerNavigation.tsx** - Custom header with WEX logo, navigation menu, and user utilities
2. **AIChatSection.tsx** - AI-powered search interface with suggestion chips
3. **AccountsSection.tsx** - HSA/FSA account cards with balance information
4. **TasksSection.tsx** - Task list with pending items and badge notifications
5. **TransactionsAndLinks.tsx** - Recent transactions list + quick links grid
6. **InfoCardsSection.tsx** - 4-card grid with informational content
7. **QuickViewSection.tsx** - Data visualization with bar and pie charts
8. **PromoBanner.tsx** - Promotional banner for mobile app download
9. **mockData.ts** - Centralized mock data for all components

## Accessing the Page

- **URL**: `/` (Landing Page)
- **Navigation**: This is now the default landing page for the application
- **Route**: Standalone route bypassing DocsLayout for custom layout
- **Design System**: Access via `/design-system` or the palette icon in the header

## Technical Details

### Responsive Design
- **Desktop** (1440px container): Full layout with multi-column grids
- **Tablet** (768px+): Adjusted columns (4→2, 3→2)
- **Mobile** (<768px): Single column stacked layout

### Accessibility
- ✅ ARIA labels on all icon buttons
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ WCAG compliant color contrast
- ✅ Proper heading hierarchy
- ✅ Screen reader friendly

### Components Used
- WexButton, WexCard, WexBadge, WexAvatar
- WexInput, WexSeparator, WexChart
- All leverage WEX design tokens for theming
- Full light/dark mode support

### Data Visualization
- **Bar Chart**: HSA Contributions by Tax Year (Recharts)
- **Pie Chart**: Paid Claims by Category (Recharts)
- Uses WEX chart color tokens

## File Structure

```
src/docs/pages/
├── ConsumerExperiencePage.tsx    # Main page composition
└── consumer/
    ├── ConsumerNavigation.tsx    # Custom header
    ├── AIChatSection.tsx          # AI search interface
    ├── AccountsSection.tsx        # Account cards
    ├── TasksSection.tsx           # Tasks list
    ├── TransactionsAndLinks.tsx   # Transactions + quick links
    ├── InfoCardsSection.tsx       # 4-card grid
    ├── QuickViewSection.tsx       # Charts section
    ├── PromoBanner.tsx            # Promotional banner
    └── mockData.ts                # Mock data
```

## Customization

To update content:
1. Modify `mockData.ts` for data changes
2. Each section component is independent
3. Styling uses Tailwind + WEX tokens
4. Layout is flexible and responsive

## Future Enhancements

- Connect to real API endpoints
- Add user authentication state
- Implement interactive chart filtering
- Add skeleton loading states
- Expand navigation menu functionality

