<#
.SYNOPSIS
    Publish an AntEk Launcher installer (and its payload) to GitHub Releases.

.DESCRIPTION
    Computes the SHA-256 of each file, writes a SHA256SUMS.txt, and creates a
    GitHub release with the files attached. The installer downloads its payload
    zip from the same release tag, so pass -Payload as well or the online
    installer will have nothing to fetch.

    Requires the GitHub CLI (gh) to be installed and authenticated:
    https://cli.github.com/

.EXAMPLE
    ./scripts/publish-release.ps1 -Version 2.1.0 `
        -Installer "C:\build\AntEk-Setup-2.1.0.exe" `
        -Payload   "C:\build\AntEk-2.1.0.zip"

.EXAMPLE
    ./scripts/publish-release.ps1 -Version 2.1.0 -Installer ".\AntEk-Setup.exe" `
        -NotesFile ".\notes.md" -Draft
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [Parameter(Mandatory = $true)]
    [string]$Installer,

    [string]$Payload,

    [string]$NotesFile,

    [string]$Repo = "ZStudio-lab/AntEk",

    [string]$Tag,

    [switch]$Draft,

    [switch]$Prerelease
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Installer -PathType Leaf)) {
    throw "Installer not found: $Installer"
}
$Installer = (Resolve-Path -LiteralPath $Installer).Path
$file = Get-Item -LiteralPath $Installer

$payloadItem = $null
if ($Payload) {
    if (-not (Test-Path -LiteralPath $Payload -PathType Leaf)) {
        throw "Payload not found: $Payload"
    }
    $Payload = (Resolve-Path -LiteralPath $Payload).Path
    $payloadItem = Get-Item -LiteralPath $Payload
}

if (-not $Tag) { $Tag = "v$Version" }

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) was not found. Install it from https://cli.github.com/ and run 'gh auth login'."
}

Write-Host "Hashing $($file.Name) ..." -ForegroundColor Cyan
$hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLower()
Write-Host "SHA-256: $hash"

$sumLines = @("{0}  {1}" -f $hash, $file.Name)
if ($payloadItem) {
    Write-Host "Hashing $($payloadItem.Name) ..." -ForegroundColor Cyan
    $payloadHash = (Get-FileHash -LiteralPath $payloadItem.FullName -Algorithm SHA256).Hash.ToLower()
    Write-Host "SHA-256: $payloadHash"
    $sumLines += ("{0}  {1}" -f $payloadHash, $payloadItem.Name)
}

$stage = Join-Path $env:TEMP ("antek-release-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage | Out-Null

try {
    $sums = Join-Path $stage "SHA256SUMS.txt"
    $sumLines | Set-Content -LiteralPath $sums -Encoding ascii

    $assets = @($file.FullName, $sums)
    if ($payloadItem) { $assets += $payloadItem.FullName }

    $ghArgs = @("release", "create", $Tag) + $assets +
              @("--repo", $Repo, "--title", "AntEk Launcher $Version")

    if ($NotesFile) {
        if (-not (Test-Path -LiteralPath $NotesFile)) { throw "Notes file not found: $NotesFile" }
        $ghArgs += @("--notes-file", (Resolve-Path -LiteralPath $NotesFile).Path)
    }
    else {
        $ghArgs += "--generate-notes"
    }

    if ($Draft)      { $ghArgs += "--draft" }
    if ($Prerelease) { $ghArgs += "--prerelease" }

    Write-Host "Creating release $Tag in $Repo ..." -ForegroundColor Cyan
    & gh @ghArgs
    if ($LASTEXITCODE -ne 0) { throw "gh release create failed with exit code $LASTEXITCODE." }

    Write-Host "Done. Release published: https://github.com/$Repo/releases/tag/$Tag" -ForegroundColor Green
}
finally {
    Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}
