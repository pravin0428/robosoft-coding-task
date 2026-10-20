# Demo overview

## Demo Recording

[Watch the Investment Strategy Details Application Demo](https://drive.google.com/file/d/1tYhmtTib_peW3FUgcpX9kha9C0J9hwfM/view?usp=sharing)

## Key Points Demonstrated

- **Strategy listing and details:** strategy name, fund manager, inception date,
  benchmark, minimum investment, trailing returns compared with the benchmark,
  and the top five holdings.
- **Responsive UI:** layout adapts to smaller screens, and the returns table
  scrolls horizontally instead of breaking the layout.
- **Summary API:** the required response fields — name, fund manager, minimum
  investment and all trailing-return periods — plus exactly three holdings
  sorted by allocation percentage in descending order, with inception date and
  benchmark omitted from the response.
- **Full-detail API:** the additional strategy information the details page needs
  (inception date, benchmark and five holdings), served through a separate
  read-only endpoint.
- **Error handling:** HTTP 404 responses for unknown strategy slugs from both the
  API and the page routes.
- **Investment calculator:** investment amount, holding period, gross value,
  management fee, exit load and net value, with inline input validation.
- **Testing and code quality:** 18 passing tests covering calculator logic,
  validation and summary transformation; lint and production build checks pass.

## Implementation Highlights

- Strategy data lives in a single module.
- A service layer shapes the API responses.
- Route handlers stay thin.
- Calculator logic is isolated in a pure, testable module.
