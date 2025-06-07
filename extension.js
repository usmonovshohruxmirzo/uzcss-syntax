const vscode = require("vscode");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "uzcss.applyColors",
    async () => {
      const config = vscode.workspace.getConfiguration();

      const uzcssColors = {
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

      const existing = config.get("editor.tokenColorCustomizations") || {};

      const mergedTextMateRules = [
        ...(existing.textMateRules || []),
        ...uzcssColors.textMateRules,
      ];

      const updated = {
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
          "UZCSS colors applied! Please reload VSCode if needed."
        );
      } catch (err) {
        vscode.window.showErrorMessage("Failed to apply UZCSS colors: " + err);
      }
    }
  );

  context.subscriptions.push(disposable);

  vscode.window.showInformationMessage(
    'UZCSS Syntax extension installed! Run "Apply UZCSS Colors" command to enable colors.'
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
