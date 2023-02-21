export interface Account {
    userId: number,
    userName: string,
    isActive: boolean,
    typeId: number,
    exp: number,
    jwt: string
}