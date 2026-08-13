# Agent Instructions

## Roadmap

- [ ] **Add Renovate** to keep dependencies up-to-date.
- [ ] **Minimise the build folder** for prod-ready publishing.
- [ ] **Create CI/CD with GitHub Actions** to build/lint/test/publish. The artifact will be the build folder.
- [ ] **Refactor handlers & private functions to arrow functions**: Convert all handlers and private functions inside components/containers to arrow-function components.
- [ ] **Add useMemo/useCallback**: Refactor so `useMemo` is used for all values and `useCallback` for all handlers/functions in all components/containers.
