export interface Bill {
    billId: number,
    userId: number,
    issueDate: Date,
    deadline: Date,
    price: number,
    isPaid: boolean
}