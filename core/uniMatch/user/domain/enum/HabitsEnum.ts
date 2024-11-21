export enum HabitsEnum {
    NEVER = "NEVER",
    OCCASIONALLY = "OCCASIONALLY",
    FREQUENTLY = "FREQUENTLY",
    DAILY = "DAILY"
}

export function habitsFromString(value?: string): HabitsEnum | undefined {
    return HabitsEnum[value?.toUpperCase() as keyof typeof HabitsEnum];
}