# Alfred 4 Workflow for VSCode Workspaces

Get a list of your VS Code workspaces in alfred

- Type `vsc` into alfred to get a list
- Works with **local** and **remote** workspaces

![](assets/workflow-usage.png)

Forked from https://github.com/kbshl/alfred-vscode

## Installation

You need Node.js >= 16

```bash
npm install --global @phartenfeller/alfred-vscode-workspaces
```

**Make sure to set your path to VS Code the following**:

1. Get your path to code with this terminal command

```sh
where code
# for example /opt/homebrew/bin/code
```

2. Open Alfred Preferences

3. Go to workflow and press variables button

![](assets/variable-button.png)

4. Set path to code and save

![](assets/set-var.png)

If you know a better way to handle this feel free to tell me or open a PR
