import test from "node:test";
import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { ExpenseModal } from "./expenseModal";
import { playWithTable } from "./expenseManipulation";

interface BudgetSettings {
	expenseCategories: object;
	expenseAccounts: object;
	expenseValues: object;
}

export const DEFAULT_SETTINGS: BudgetSettings = {
	expenseCategories: [
		{ name: "Eat", icon: "carrot" },
		{ name: "Home", icon: "home" },
		{ name: "Leisure", icon: "armchair" },
		{ name: "Beauty", icon: "glasses" },
		{ name: "Holidays", icon: "caravan" },
		{ name: "Transport", icon: "car" },
	],
	expenseAccounts: [
		{ name: "Cash", icon: "coins" },
		{ name: "Credit Card", icon: "credit-card" },
		{ name: "Bank", icon: "landmark" },
	],
	expenseValues: [
		{ name: "Basics", icon: "gem" },
		{ name: "Medium", icon: "gem" },
		{ name: "Luxury", icon: "gem" },
	],
};

export default class budgetPlugin extends Plugin {
	settings: BudgetSettings;
	file: TFile;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("dollar-sign", "New Expense", (evt: MouseEvent) => {
			new Notice("New Expense Modal");
			// need to start modal
			new ExpenseModal(
				this.app,
				this,
				(
					expenseAmount,
					expenseCategory,
					expenseAccount,
					expenseValue
				) => {
					new Notice(
						`${expenseAmount}, ${expenseCategory}, ${expenseAccount}, ${expenseValue}`
					);
				}
			).open();

			// need to set active md file to budget
			console.log("Debug: trigger new expense modal from ribbon");
		});

		// Adds a setting tag so the user can configure the aspects of the plugin
		this.addSettingTab(new ExpenseSettingTab(this.app, this));

		this.addCommand({
			id: "play-with-table",
			name: "Play with table",
			callback: async () => {
				await playWithTable(this.app);
			},
		});
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	onunload(): void {}
}

class ExpenseSettingTab extends PluginSettingTab {
	plugin: budgetPlugin;

	constructor(app: App, plugin: budgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const expenseCategories = this.plugin.settings.expenseCategories;
		const expenseAccounts = this.plugin.settings.expenseAccounts;
		const expenseValues = this.plugin.settings.expenseValues;

		const categoriesDiv = containerEl.createDiv();
		categoriesDiv.createEl("h2", { text: "Expense Categories" });
		if (Array.isArray(expenseCategories)) {
			expenseCategories.forEach((item, index) => {
				new Setting(containerEl.createDiv())
					.setDesc(`Category number ${index + 1}`)
					.addText((text) =>
						text
							.setPlaceholder(`Name = ${item.name}`)
							.setValue(item.name)
							.onChange(async (value) => {
								(
									this.plugin.settings.expenseCategories as {
										[index: number]: {
											name: string;
											icon: string;
										};
									}
								)[index].name = value;
								await this.plugin.saveSettings();
							})
					)
					.addText((text) =>
						text
							.setPlaceholder(`Icon = ${item.icon}`)
							.setValue(item.icon)
							.onChange(async (value) => {
								(
									this.plugin.settings.expenseCategories as {
										[index: number]: {
											name: string;
											icon: string;
										};
									}
								)[index].icon = value;
								await this.plugin.saveSettings();
							})
					);
			});
		}

		const accountsDiv = containerEl.createDiv();
		accountsDiv.createEl("h2", { text: "Expense Accounts" });
		if (Array.isArray(expenseAccounts)) {
			expenseAccounts.forEach((item, index) => {
				new Setting(containerEl.createDiv())
					.setDesc(`Account number ${index + 1}`)
					.addText((text) =>
						text
							.setPlaceholder(`Name = ${item.name}`)
							.setValue(item.name)
							.onChange(async (value) => {
								console.log("Updated name: " + value);
								(
									this.plugin.settings.expenseAccounts as {
										[index: number]: { name: string };
									}
								)[index].name = value;
								await this.plugin.saveSettings();
							})
					)
					.addText((text) =>
						text
							.setPlaceholder(`Icon = ${item.icon}`)
							.setValue(item.icon)
							.onChange(async (value) => {
								console.log("Updated icon: " + value);
								(this.plugin.settings.expenseAccounts as any[])[
									index
								].icon = value;
								await this.plugin.saveSettings();
							})
					);
			});
		}

		const valuesDiv = containerEl.createDiv();
		valuesDiv.createEl("h2", { text: "Expense Values" });
		if (Array.isArray(expenseValues)) {
			expenseValues.forEach((item, index) => {
				new Setting(containerEl.createDiv())
					.setDesc(`Account number ${index + 1}`)
					.addText((text) =>
						text
							.setPlaceholder(`Name = ${item.name}`)
							.setValue(item.name)
							.onChange(async (value) => {
								console.log("Updated name: " + value);
								(this.plugin.settings.expenseValues as any[])[
									index
								].name = value;
								await this.plugin.saveSettings();
							})
					)
					.addText((text) =>
						text
							.setPlaceholder(`Icon = ${item.icon}`)
							.setValue(item.icon)
							.onChange(async (value) => {
								console.log("Updated icon: " + value);
								(this.plugin.settings.expenseValues as any[])[
									index
								].icon = value;
								await this.plugin.saveSettings();
							})
					);
			});
		}
	}
}
