export enum ChatStatusEnum {
    TYPING = 'TYPING',
    NONE = 'NONE'
}

// Method to convert string to ChatStatusEnum
export function ChatStatusEnumFactory(value: string): ChatStatusEnum {
    if (Object.values(ChatStatusEnum).includes(value as ChatStatusEnum)) {
        return value as ChatStatusEnum;
    }
    throw new Error("ChatStatusEnumFactory() -> Invalid status value");
}
