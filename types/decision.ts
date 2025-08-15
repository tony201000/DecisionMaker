export interface Argument {
	id: string;
	text: string;
	weight: number;
}

export interface Decision {
	id?: string;
	title: string;
	description?: string;
	arguments: Argument[];
}

export interface AISuggestion {
	text: string;
	weight: number;
	category: string;
}
