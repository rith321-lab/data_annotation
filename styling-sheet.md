# Modern App Design System for Verita AI

## 🎯 Design Philosophy

**Goal**: Create a clean, minimal, professional dashboard following TailwindCSS primitive color systems - modern, efficient, and focused on data-driven insights.

**Core Principles**:
- **Minimalism**: Less is more - focus on essential data points
- **Clarity**: Visual hierarchy guides users to critical information
- **Efficiency**: Card-based layouts for quick scanning
- **Professionalism**: Clean typography and systematic colors
- **Mobile-First**: Responsive design that works everywhere

## 🎨 Primitive Color System (TailwindCSS-based)

### Primary Colors
```css
/* Primary - Main brand colors for buttons, interactions */
--primary-base: #0EA5E9;      /* sky-500 - Main brand color */
--primary-inactive: #F0F9FF;  /* sky-50 - Lightest backgrounds */
--primary-subtle: #E0F2FE;    /* sky-100 - Subtle backgrounds */
--primary-darker: #075985;    /* sky-800 - Darker interactions */
--primary-dark: #082F49;      /* sky-950 - Darkest accents */
```

### Background Colors
```css
/* Background - Page and component backgrounds */
--bg-base: #FFFFFF;           /* Base white */
--bg-subtle: #FAFAFA;         /* zinc-50 - Subtle background */
--bg-soft: #F4F4F5;           /* zinc-100 - Soft background */
--bg-inactive: #D4D4D8;       /* zinc-300 - Inactive elements */
--bg-strong: #09090B;         /* zinc-950 - Strong contrast */
```

### Border Colors
```css
/* Border - Component borders and dividers */
--border-base: #FFFFFF;       /* Base white borders */
--border-subtle: #FAFAFA;     /* zinc-50 - Subtle borders */
--border-soft: #F4F4F5;       /* zinc-100 - Soft borders */
--border-inactive: #D4D4D8;   /* zinc-300 - Inactive borders */
--border-strong: #09090B;     /* zinc-950 - Strong borders */
```

### Text Colors
```css
/* Text - Typography color hierarchy */
--text-base: #FFFFFF;         /* Base white text */
--text-subtle: #FAFAFA;       /* zinc-50 - Subtle text */
--text-soft: #F4F4F5;         /* zinc-100 - Soft text */
--text-inactive: #D4D4D8;     /* zinc-300 - Inactive text */
--text-strong: #09090B;       /* zinc-950 - Strong text */
```

### Icon Colors
```css
/* Icon - Icon color system */
--icon-base: #FFFFFF;         /* Base white icons */
--icon-subtle: #FAFAFA;       /* zinc-50 - Subtle icons */
--icon-soft: #F4F4F5;         /* zinc-100 - Soft icons */
--icon-inactive: #D4D4D8;     /* zinc-300 - Inactive icons */
--icon-strong: #09090B;       /* zinc-950 - Strong icons */
--icon-on-color: #09090B;     /* zinc-950 - Icons on colored backgrounds */
```

### Semantic Colors
```css
/* Success - Success states and positive feedback */
--success-base: #22C55E;      /* green-500 - Main success color */
--success-subtle: #F0FDF4;    /* green-50 - Subtle success background */
--success-soft: #DCFCE7;      /* green-100 - Soft success background */
--success-strong: #052E16;    /* green-950 - Strong success text */

/* Error - Error states and negative feedback */
--error-base: #EF4444;        /* red-500 - Main error color */
--error-subtle: #FEF2F2;      /* red-50 - Subtle error background */
--error-soft: #FEE2E2;        /* red-100 - Soft error background */
--error-strong: #450A0A;      /* red-950 - Strong error text */

/* Information - Info states and neutral feedback */
--info-base: #3B82F6;         /* blue-500 - Main info color */
--info-subtle: #EFF6FF;       /* blue-50 - Subtle info background */
--info-soft: #DBEAFE;         /* blue-100 - Soft info background */
--info-strong: #172554;       /* blue-950 - Strong info text */

/* Warning - Warning states and cautionary feedback */
--warning-base: #F97316;      /* orange-500 - Main warning color */
--warning-subtle: #FFFBEB;    /* orange-50 - Subtle warning background */
--warning-soft: #FEEBCB;      /* orange-100 - Soft warning background */
--warning-strong: #431407;    /* orange-950 - Strong warning text */
```

## 📝 Typography

### Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

### Font Scales
```css
/* Headings */
--text-xs: 0.75rem;      /* 12px - labels */
--text-sm: 0.875rem;     /* 14px - body small */
--text-base: 1rem;       /* 16px - body */
--text-lg: 1.125rem;     /* 18px - large body */
--text-xl: 1.25rem;      /* 20px - small headings */
--text-2xl: 1.5rem;      /* 24px - headings */
--text-3xl: 1.875rem;    /* 30px - large headings */
--text-4xl: 2.25rem;     /* 36px - hero text */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 🏗️ Layout System

### Spacing (8px base unit)
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

### Container Widths
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Breakpoints */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## 🧩 Component Styles

### 1. Cards (Main Building Block)
```css
.card {
  background: var(--bg-base);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
  border-color: var(--border-inactive);
}

/* Card Header */
.card-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-soft);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-strong);
  margin: 0;
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-inactive);
  margin: 0.25rem 0 0 0;
}
```

### 2. Buttons (Modern Style)
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-base);
  color: var(--text-base);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: var(--primary-darker);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-base);
  color: var(--text-strong);
  border: 1px solid var(--border-inactive);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--bg-subtle);
  border-color: var(--border-strong);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-inactive);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: var(--bg-soft);
  color: var(--text-strong);
}

/* Success Button */
.btn-success {
  background: var(--success-base);
  color: var(--text-base);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-success:hover {
  background: var(--success-strong);
}

/* Warning Button */
.btn-warning {
  background: var(--warning-base);
  color: var(--text-base);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-warning:hover {
  background: var(--warning-strong);
}
```

### 3. Navigation Sidebar
```css
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--bg-base);
  border-right: 1px solid var(--border-soft);
  padding: 1.5rem 0;
}

.sidebar-logo {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  margin-bottom: 1.5rem;
}

.sidebar-nav {
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--text-inactive);
  text-decoration: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  margin-bottom: 0.25rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--bg-subtle);
  color: var(--text-strong);
}

.nav-item.active {
  background: var(--primary-subtle);
  color: var(--primary-darker);
  font-weight: var(--font-semibold);
}
```

### 4. Data Tables
```css
.table-container {
  background: var(--bg-base);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-soft);
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--text-strong);
}

.table-row {
  border-bottom: 1px solid var(--border-soft);
  transition: background-color 0.2s;
}

.table-row:hover {
  background: var(--bg-subtle);
}

.table-cell {
  padding: 1rem;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
```

### 5. Metrics Cards
```css
.metric-card {
  background: var(--bg-base);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.metric-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-color: var(--border-inactive);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-inactive);
  margin: 0;
}

.metric-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--icon-on-color);
}

.metric-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-strong);
  margin: 0;
}

.metric-change {
  font-size: var(--text-sm);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-change.positive {
  color: var(--success-base);
}

.metric-change.negative {
  color: var(--error-base);
}
```

### 6. Forms & Inputs
```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-strong);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-inactive);
  border-radius: 8px;
  font-size: var(--text-sm);
  transition: all 0.2s;
  background: var(--bg-base);
  color: var(--text-strong);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-base);
  box-shadow: 0 0 0 3px rgb(14 165 233 / 0.1);
}

.form-input::placeholder {
  color: var(--text-inactive);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d4d4d8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Form States */
.form-input.error {
  border-color: var(--error-base);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

.form-input.success {
  border-color: var(--success-base);
  box-shadow: 0 0 0 3px rgb(34 197 94 / 0.1);
}

.form-error {
  color: var(--error-base);
  font-size: var(--text-xs);
  margin-top: 0.25rem;
}

.form-success {
  color: var(--success-base);
  font-size: var(--text-xs);
  margin-top: 0.25rem;
}
```

## ✨ Animations & Micro-interactions

### Transitions
```css
.transition-all { transition: all 0.2s ease; }
.transition-colors { transition: color, background-color, border-color 0.2s ease; }
.transition-transform { transition: transform 0.2s ease; }
.transition-opacity { transition: opacity 0.2s ease; }
```

### Hover Effects
```css
.hover-lift:hover { transform: translateY(-2px); }
.hover-scale:hover { transform: scale(1.02); }
.hover-shadow:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
```

### Loading States
```css
.skeleton {
  background: linear-gradient(90deg, 
    var(--bg-inactive) 25%, 
    var(--bg-soft) 50%, 
    var(--bg-inactive) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--bg-inactive);
  border-top: 2px solid var(--primary-base);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading States for Different Components */
.loading-card {
  background: var(--bg-base);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.5rem;
}

.loading-button {
  background: var(--bg-inactive);
  color: var(--text-inactive);
  cursor: not-allowed;
  opacity: 0.6;
}
```

## 📱 Responsive Design

### Mobile-First Approach
```css
/* Base styles for mobile */
.container {
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
  
  .grid-md-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-md-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 0 3rem;
  }
  
  .grid-lg-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 🎯 Dashboard Layout Patterns

### Main Dashboard Grid
```css
.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--bg-subtle);
}

.main-content {
  padding: 2rem;
  background: var(--bg-subtle);
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-strong);
  margin: 0 0 0.5rem 0;
}

.dashboard-subtitle {
  font-size: var(--text-base);
  color: var(--text-inactive);
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Mobile Dashboard Layout */
@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

## 🎨 Chart & Data Visualization Colors

```css
:root {
  /* Chart Colors using our primitive system */
  --chart-primary: var(--primary-base);      /* Sky blue */
  --chart-secondary: var(--info-base);       /* Blue */
  --chart-success: var(--success-base);      /* Green */
  --chart-warning: var(--warning-base);      /* Orange */
  --chart-danger: var(--error-base);         /* Red */
  
  /* Extended chart series for multiple data sets */
  --chart-series: [
    var(--primary-base),    /* Sky blue */
    var(--info-base),       /* Blue */
    var(--success-base),    /* Green */  
    var(--warning-base),    /* Orange */
    var(--error-base),      /* Red */
    '#8b5cf6',              /* Purple */
    '#ec4899',              /* Pink */
    '#14b8a6'               /* Teal */
  ];
}
```

## 🏷️ Status & Badge Colors

```css
/* Status indicators using semantic colors */
.status-active {
  background: var(--success-soft);
  color: var(--success-strong);
  border: 1px solid var(--success-base);
}

.status-inactive {
  background: var(--bg-soft);
  color: var(--text-inactive);
  border: 1px solid var(--border-inactive);
}

.status-warning {
  background: var(--warning-soft);
  color: var(--warning-strong);
  border: 1px solid var(--warning-base);
}

.status-error {
  background: var(--error-soft);
  color: var(--error-strong);
  border: 1px solid var(--error-base);
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
```

## 🎯 Key Design System Features

1. **Primitive Color System**: TailwindCSS-based systematic color approach
2. **Semantic Naming**: Clear, purposeful color naming (base, subtle, soft, strong)
3. **Consistent Hierarchy**: Text, background, border colors follow same pattern
4. **Modern Aesthetics**: Sky blue primary with clean neutrals
5. **State Management**: Comprehensive success, error, warning, info states
6. **Accessibility**: High contrast ratios and clear visual hierarchy
7. **Scalability**: Easy to extend and maintain

## 💡 Implementation Notes

- Use `var(--primary-base)` for main interactions and CTAs
- Use `var(--bg-subtle)` for page backgrounds  
- Use `var(--text-strong)` for primary text content
- Use `var(--border-soft)` for subtle component borders
- Apply semantic colors (`success-base`, `error-base`) for states
- Maintain consistent spacing with the 8px base unit system

This modern design system creates a clean, professional interface that feels contemporary while maintaining excellent usability and visual hierarchy.