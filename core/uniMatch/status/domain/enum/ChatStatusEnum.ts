export enum ChatStatusEnum {
    ONLINE = "ONLINE",
    TYPING = "TYPING",
}

export function ChatStatusEnumFactory(value: string): ChatStatusEnum {
    if (Object.values(ChatStatusEnum).includes(value as ChatStatusEnum)) {
        return value as ChatStatusEnum;
    }
    throw new Error("ChatStatusEnumFactory() -> Invalid status value");
}
