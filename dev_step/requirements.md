# Stock Index Frontend Requirements (v1.2)

## Objectives
- Deliver a browser-based interface that surfaces daily stock index metrics and related historical trends served by the `stock-index-engine` backend.
- Prioritize clarity and quick scanning for current-day performance while enabling deeper exploration of each indicator.

## User Roles
- **Market watcher:** needs an at-a-glance view of current performance and quick drill-down into specific indicators.
- **Analyst:** wants consolidated historical context to validate trends and export insights.

## Data Source
- Consume data exclusively from the existing `stock-index-engine` API endpoints (exact routes to be confirmed once backend documentation is available).
- Assume the API already provides threshold or sentiment flags for "high" and "low" states; surface those directly where possible.
- Support both intraday/current values and historic series (daily resolution unless the backend offers finer granularity).
- Handle auth/headers consistent with engine requirements (assume none unless otherwise specified).

## Views & Navigation
- **Dashboard (default landing):**
  - Present the latest value for each tracked indicator on the current trading day.
  - Highlight higher-than-baseline or positive movements with an eye-pleasing red; highlight lower-than-baseline or negative movements with an eye-pleasing green.
  - Layout and card style can draw inspiration from [dashdot](https://github.com/MauriceNino/dashdot): clean cards, prominent headline metric, subtle secondary information.
  - Display supporting context such as absolute change, percentage change, last updated timestamp, and threshold status where available.
  - Provide clear affordances (e.g., cards, rows) so each indicator is clickable or tappable.
  - Support two presentation modes: an ungrouped list (default) and an option to group cards by indicator category; future grouping by topic/tag is out of scope but should remain feasible.
- **Indicator detail view:**
  - Triggered by selecting an indicator on the dashboard.
  - Render a historical chart sourced from the engine (line or area chart; reuse existing chart component styles for consistency).
  - Apply the same positive/negative highlighting on key data points (e.g., current value, highs/lows, annotations) and visibly label axes and grid lines.
  - Display precise point details (date/time, value, threshold signal) on hover or tap, even if the line is not smoothed.
  - Provide user controls to switch the time range (e.g., 1W, 1M, 3M, 6M, 1Y, 5Y) with reasonable defaults and API query adjustments.
  - Surface additional metadata such as moving averages or benchmark values when available.
- **All-history overview:**
  - Dedicated page displaying all indicator historical charts simultaneously on a single screen layout.
  - Reuse the chart components from indicator detail view with consistent legends, scales, axis labels, and color treatment.
  - Allow the same time-range selection controls (global toggle preferred) so users can compare indicators on matching horizons.
  - Offer quick filtering (toggle indicators on or off) if density becomes an issue.

## Visual & Interaction Guidelines
- Adopt a cohesive color palette where "high" states use a comfortable red hue and "low" states use a comfortable green hue; ensure accessibility contrast.
- Reference dashdot's minimalist card styling for layout inspiration while maintaining our branding.
- Include responsive layouts for desktop-first design with acceptable tablet/mobile fallbacks.
- Provide loading skeletons or spinners and inline error handling when API responses are delayed or fail.
- Support tooltips or hover states on charts to expose precise data point values and timestamps; include axis labels, tick markers, and legend cues.

## Technical Assumptions
- Frontend will be built with a modern component-based framework (React or Vue preferred; final selection pending team decision).
- Charting can leverage a library already used in prior work (e.g., Recharts, ECharts) to speed delivery.
- State management should be lightweight (React Query, Zustand, Vue Query) unless integration complexity demands more structure.
- Environment configuration via `.env` files for API base URLs and feature flags.

## Performance & Quality
- Cache or refresh policies should avoid hammering the engine API; poll current data at sensible intervals (e.g., every 60 seconds) while allowing manual refresh.
- Lazy-load heavy chart bundles on detail or overview pages to keep the dashboard fast.
- Include unit coverage for data formatting utilities and integration tests for key views when feasible.

## Open Questions
- Confirmation of available engine endpoints, payload shapes, and authentication mechanisms.
- Any API limits or recommended polling intervals from the engine.
- Desired chart types beyond line/area (candlestick, column) and default smoothing preferences.
- Requirement for exporting data or charts (CSV, PDF) in this phase?
- Accessibility targets (WCAG level) and localization needs.

## Next Steps
- Obtain engine API documentation or sample responses to firm up the data integration plan.
- Decide on the frontend tech stack and charting library based on team preferences and licensing.
- Produce low-fidelity wireframes for the three core views to validate layout and color usage before implementation.
- Define the time-range presets' backend query parameters or transformations with the engine team.
- Explore UI pattern for category grouping toggle and leave hooks for future topic-based grouping.
