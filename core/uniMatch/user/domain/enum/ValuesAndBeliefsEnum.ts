export enum ValuesAndBeliefsEnum {
    AGNOSTIC = "AGNOSTIC",
    ATHEIST = "ATHEIST",
    BUDDHIST = "BUDDHIST",
    CATHOLIC = "CATHOLIC",
    CHRISTIAN = "CHRISTIAN",
    ISLAM = "ISLAM",
    HINDU = "HINDU",
    JEWISH = "JEWISH",
    MUSLIM = "MUSLIM",
    PROTESTANT = "PROTESTANT",
    OTHER = "OTHER"
}

export function ValuesAndBeliefsFromString(value?: string): ValuesAndBeliefsEnum | undefined {
    return ValuesAndBeliefsEnum[value?.toUpperCase() as keyof typeof ValuesAndBeliefsEnum];
}