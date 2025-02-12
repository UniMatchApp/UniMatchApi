import { DomainError } from "@/core/shared/exceptions/DomainError";

export class Task {
    private _title: string;
    private _options: Map<string, Set<string>>;
  
    constructor(title: string, options: string[]) {
        this._title = title;
        this._options = new Map();
        options.forEach(option => {
            this._options.set(option, new Set());
        });
    }
  
    get title(): string {
        return this._title;
    }
  
    set title(title: string) {
        this._title = title;
    }
  
    get options(): Map<string, Set<string>> {
        return this._options;
    }
  
    addOption(option: string): void {
        if (!this._options.has(option)) {
            this._options.set(option, new Set());
        } else {
            throw new DomainError(`The option "${option}" already exists.`);
        }
    }
  
    removeOption(option: string): void {
        if (this._options.has(option)) {
            this._options.delete(option);
        } else {
            throw new DomainError(`The option "${option}" does not exist.`);
        }
    }
  
    selectOption(option: string, userId: string): void {
        this._options.forEach((userSet, existingOption) => {
          if (userSet.has(userId) && existingOption !== option) {
            this.deselectOption(existingOption, userId);
          }
        });
      
        const userSet = this._options.get(option);
        if (userSet) {
          userSet.add(userId);
        } else {
          throw new DomainError(`The option "${option}" does not exist.`);
        }
    }
  
    deselectOption(option: string, userId: string): void {
        const userSet = this._options.get(option);
        if (userSet) {
            if (!userSet.has(userId)) {
                return;
            }
            userSet.delete(userId);
        } else {
            throw new DomainError(`The option "${option}" does not exist.`);
        }
    }
  
    getUserIdsForOption(option: string): string[] {
        const userSet = this._options.get(option);
        if (userSet) {
            return Array.from(userSet);
        } else {
            throw new DomainError(`The option "${option}" does not exist.`);
        }
    }
  
    get selections(): { [option: string]: string[] } {
        const selections: { [option: string]: string[] } = {};
        this._options.forEach((userSet, option) => {
            selections[option] = Array.from(userSet);
        });
        return selections;
        }
  }