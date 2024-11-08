export enum ValuesAndBeliefsEnum {
    AGNOSTIC = "AGNOSTIC",
    ATHEIST = "ATHEIST",
    BUDDHIST = "BUDDHIST",
    CATHOLIC = "CATHOLIC",
    CHRISTIAN = "CHRISTIAN",
    HINDU = "HINDU",
    JEWISH = "JEWISH",
    MUSLIM = "MUSLIM",
    PROTESTANT = "PROTESTANT",
    OTHER = "OTHER"
}

export function ValuesAndBeliefsFromString(value: string): ValuesAndBeliefsEnum {
    return ValuesAndBeliefsEnum[value.toUpperCase() as keyof typeof ValuesAndBeliefsEnum];
}