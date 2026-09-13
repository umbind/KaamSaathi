# KaamSaathi Target Repository Structure

```text
/
├── apps/
│   ├── android/
│   ├── web/
│   └── admin/
├── services/
│   └── api/
├── packages/
│   ├── contracts/
│   ├── design-tokens/
│   ├── localization/
│   └── shared-config/
├── infra/
│   ├── terraform/
│   ├── scripts/
│   └── environments/
├── docs/
│   ├── project/
│   ├── research/
│   ├── product/
│   ├── ux/
│   ├── architecture/
│   │   └── adr/
│   ├── security/
│   ├── quality/
│   ├── operations/
│   ├── growth/
│   ├── legal-review/
│   └── release/
├── .agents/
│   ├── agents.md
│   ├── rules/
│   └── skills/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
├── PROJECT_STATUS.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CHANGELOG.md
```

## Requirements

- Independent builds for Android, API, public web, and admin.
- Shared OpenAPI/generated contract strategy without making mobile depend on server source code.
- CI caching and reproducible lockfiles.
- Separate environment configuration.
- Infrastructure as code.
- No production secrets in repository, mobile resources, JavaScript bundles, docs, screenshots, or logs.
- File ownership and module boundaries suitable for parallel Antigravity worktrees.
- Do not create an open-source licence without owner selection.
