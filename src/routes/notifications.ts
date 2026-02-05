export interface NotificationItem {
    id: number;
    message: string;
    color: "red" | "green";
    timeoutId?: ReturnType<typeof setTimeout>;
    visible: boolean;
}
