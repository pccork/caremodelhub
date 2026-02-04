# CMH Control Mapping

## NIS2 (Article 21) mapping (summary)
| Control area | CMH implementation | Evidence |
|---|---|---|
| Access control | RBAC (backend/src/auth) | PRs, tests, audit logs |
| Logging & monitoring | audit-api + audit-store | evidence/audit-sample.json |
| Vulnerability mgmt | Dependabot + npm/pip audit | evidence/security/* |
| Change management | PR approvals + protected main | evidence/governance/* |
| Backup & recovery | (documented plan) | docs/ops/backup.md |

## ISO-style evidence index
See: docs/compliance/iso-style-evidence-index.md
