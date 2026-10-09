# Changelog

All notable changes to AntEk Launcher are documented here.
This project follows [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.1.0] — 2026-10-09

First public release.

### Added

- **Versions** — install releases, snapshots and old versions from the official Mojang manifest.
- **Mod loaders** — one-click Fabric, Quilt, Forge and NeoForge with compatibility checks.
- **Instances** — fully isolated `.minecraft` folders per instance.
- **Modrinth integration** — browse and install mods, shaders, resource packs and modpacks
  with hash-verified downloads.
- **Library** — enable, disable, import and remove content per instance.
- **Accounts** — Microsoft sign-in (device-code flow) and offline profiles with
  Java-compatible UUIDs.
- **Skins** — Mojang uploads for Microsoft accounts and local skins for offline profiles.
- **Live game log** — streamed and saved per session.
- **Custom installer** — a small, trim-optimised setup with shortcuts and a clean
  uninstaller that never deletes your data.

### Notes

- User data lives in `%APPDATA%\.antek`.
- An existing data folder is migrated automatically on first launch.

[2.1.0]: https://github.com/ZStudio-lab/AntEk/releases/tag/v2.1.0
