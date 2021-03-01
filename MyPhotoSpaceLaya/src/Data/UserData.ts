import { HMFW } from "../HMFW/HMFW";

export class UserData extends HMFW.DataBase{
    constructor(){
        super();
    }
    public userId:number;
    public username:string;
    public nickName:string;
    public token:string;
}