import { CoverUI } from "../AppUI/CoverUI";
import { LoginUI } from "../AppUI/LoginUI";
import { PhotoAlbumUI } from "../AppUI/PhotoAlbumUI";
import { HMFW } from "../HMFW/HMFW";

export class UnLoginedState extends HMFW.GameStateBase{
    
    constructor(){
        super("UnLoginedState");
    }
    EnterState(arg?: any[]){
        HMFW.UIManage.Instance.OpenUI(CoverUI,null,false,1000);
        HMFW.UIManage.Instance.OpenUI(LoginUI,null,false,998);
    }
    public OnUpdate() {
       
    }
    LeaveState(arg?: any[]){
        
    }

}