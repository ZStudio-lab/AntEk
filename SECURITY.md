# Security Policy

## Supported versions

Only the latest release of AntEk Launcher receives fixes.

| Version | Supported |
| ------- | --------- |
| 2.1.x   | ✅        |
| < 2.1   | ❌        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report privately through GitHub's [Security Advisories](../../security/advisories/new)
("Report a vulnerability" on the **Security** tab). If you cannot use that, open a minimal
public issue asking for a private contact channel — without disclosing details.

Please include:

- Affected version and Windows build.
- Steps to reproduce.
- Impact and any proof-of-concept you can share safely.

We aim to acknowledge reports within a few days. Thank you for helping keep AntEk safe.

## Verifying downloads

Every release lists a **SHA-256** checksum for its installer. Verify before running:

```powershell
certutil -hashfile AntEk-Setup.exe SHA256
```

Only download AntEk from the official releases page:
<https://github.com/ZStudio-lab/AntEk/releases>
