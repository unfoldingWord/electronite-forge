@echo off

SETLOCAL
SET FORGE_ARGS=%*

SET FORGE_ARGS=%FORGE_ARGS: =~ ~%
node "%~dp0/../../../@electronite-forge/cli/dist/electron-forge-start.js" --vscode -- ~%FORGE_ARGS%~

ENDLOCAL
