import * as vscode from 'vscode';
import { emojis } from './emojis';

export function activate(context: vscode.ExtensionContext) {

	const statusBarButton = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);

	statusBarButton.text = "$(smiley) Emogit";
	statusBarButton.tooltip = "Click to select an emoji for your commit";
	statusBarButton.command = "emogit.showMenu";
	statusBarButton.show();
 
	const disposable = vscode.commands.registerCommand('emogit.showMenu', async () => {
		await showEmojiMenu();
	});

	context.subscriptions.push(statusBarButton);
	context.subscriptions.push(disposable);
}

async function showEmojiMenu() {
	const quickPick = vscode.window.createQuickPick();
	
	quickPick.title = "Select an emoji for your commit";
	quickPick.placeholder = "Type to search or select an emoji...";
	quickPick.items = emojis.map(emoji => ({
		label: `${emoji.icon} ${emoji.name}`,
		description: emoji.value, 
		value: emoji.value
	}));

	quickPick.onDidAccept(async () => {
		const selected = quickPick.selectedItems[0];
		if (selected) {
			const emoji = emojis.find(e => `${e.icon} ${e.name}` === selected.label);
			if (emoji) {
				await insertInTerminal(emoji.value);
			}
		}
		quickPick.hide();
	});
	
	quickPick.onDidChangeSelection(async (selectedItems) => {
		// Select with Enter key
	});
	
	quickPick.show();
}

async function insertInTerminal(value: string) {
	try {
		const terminal = vscode.window.activeTerminal;
		
		if (!terminal) {
			vscode.window.showInformationMessage('Making a new terminal ...');
			const newTerminal = vscode.window.createTerminal('Emoji Git');
			newTerminal.show();
			setTimeout(() => {
				newTerminal.sendText(value, false);
				newTerminal.show();
			}, 300);
		} else {
			terminal.sendText(value, false);
			terminal.show();
		}
		
		vscode.window.showInformationMessage(`Inserted: "${value}" at therminal`); 
		
	} catch (error) {
		vscode.window.showErrorMessage('Error inserting emoji into terminal');
	}
}

export function deactivate() {}
