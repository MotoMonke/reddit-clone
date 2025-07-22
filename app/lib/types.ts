export type Payload={
    userId:number,
    userEmail:string,
    username:string,
    exp:number,
}
export type PasswordProps = {
  changeState: () => void;
  changePassword: (value: string) => void;
  password: string;
};