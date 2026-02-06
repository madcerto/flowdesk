export interface NotificationItem {
    id: number;
    message: string;
    color: "red" | "green";
    timeoutId?: ReturnType<typeof setTimeout>;
    visible: boolean;
}

export function createNotification(message: string, notifications: NotificationItem[], nextNotifId: number) {
    let newNotif: NotificationItem = {
        id: nextNotifId,
        message,
        color: "red",
        visible: true
    };
    newNotif.timeoutId = setTimeout(() => {
        const notif = notifications.find((n) => n.id == newNotif.id);
        if (notif) {
            if (notif.timeoutId) clearTimeout(notif.timeoutId);
            notif.visible = false;
            setTimeout(() => notifications = notifications.filter((n) => n.id !== notif?.id), 300);
        }
    }, 8000);
    notifications.push(newNotif);
    nextNotifId += 1;
}
