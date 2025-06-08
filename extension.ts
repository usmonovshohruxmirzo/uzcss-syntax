import * as vscode from "vscode";

interface TextMateRule {
  scope: string;
  settings: {
    foreground: string;
  };
}

interface TokenColorCustomizations {
  textMateRules?: TextMateRule[];
  [key: string]: unknown;
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable: vscode.Disposable = vscode.commands.registerCommand(
    "uzcss.applyColors",
    async (): Promise<void> => {
      const config: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration();

      const uzcssColors: { textMateRules: TextMateRule[] } = {
        textMateRules: [
          {
            scope: "entity.name.selector.uzcss",
            settings: { foreground: "#ff79c6" },
          },
          {
            scope: "support.type.property-name.uzcss",
            settings: { foreground: "#f1fa8c" },
          },
          {
            scope: "string.unquoted.property-value.uzcss",
            settings: { foreground: "#8be9fd" },
          },
          {
            scope: "comment.line.double-slash.uzcss",
            settings: { foreground: "#6272a4" },
          },
        ],
      };

      const existing: TokenColorCustomizations =
        config.get<TokenColorCustomizations>(
          "editor.tokenColorCustomizations"
        ) || {};

      const mergedTextMateRules: TextMateRule[] = [
        ...(existing.textMateRules || []),
        ...uzcssColors.textMateRules,
      ];

      const updated: TokenColorCustomizations = {
        ...existing,
        textMateRules: mergedTextMateRules,
      };

      try {
        await config.update(
          "editor.tokenColorCustomizations",
          updated,
          vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage(
          "uzCSS colors applied! Please reload VSCode if needed."
        );
      } catch (err) {
        if (err instanceof Error) {
          vscode.window.showErrorMessage(
            "Failed to apply uzCSS colors: " + err.message
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);

  vscode.window.showInformationMessage(
    'uzCSS Syntax extension installed! Run "Apply UZCSS Colors" command to enable colors.'
  );
}

export function deactivate(): void {}
