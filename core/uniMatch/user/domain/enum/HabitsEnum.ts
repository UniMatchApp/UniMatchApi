export enum HabitsEnum {
    NEVER = "NEVER",
    OCCASIONALLY = "OCCASIONALLY",
    OFTEN = "OFTEN",
    ALWAYS = "ALWAYS"
}

export function habitsFromString(value: string): HabitsEnum {
    return HabitsEnum[value.toUpperCase() as keyof typeof HabitsEnum];
}