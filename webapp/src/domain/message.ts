export type Message<T> = SuccessMessage<T> | ErrorMessage

interface SuccessMessage<T> {
    status: "success";
    data: T;
}

interface ErrorMessage {
    status: "error";
    msg: string;
}

export function unwrap<T>(msg: Message<T>): T {
    if (msg.status == "error") {
        throw new Error(msg.msg);
    }

    return msg.data;
}