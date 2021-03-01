import { HMFWEvent } from "../AppConfig";
import { CoverUI } from "../AppUI/CoverUI";
import { LoginUI } from "../AppUI/LoginUI";
import { PhotoAlbumUI } from "../AppUI/PhotoAlbumUI";
import { HMFW } from "../HMFW/HMFW";
import { NetworkManager } from "../Manager/NetworkManager";

export class LoginedState extends HMFW.GameStateBase{
    constructor(){
        super("LoginedState");
    }
    EnterState(arg?: any[]){
        this.regEvent();
        //检查当前所处的状态--如果有
        let albumsUI=HMFW.UIManage.Instance.GetOpenUI(PhotoAlbumUI);
        if(!albumsUI){
            HMFW.UIManage.Instance.OpenUI(PhotoAlbumUI);
        }
        HMFW.UIManage.Instance.CloseUI(LoginUI);
        NetworkManager.requestAllAlbums();
    }
    private regEvent(){
        HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_LOGOUT,this,this.onLogout);
    }
    public OnUpdate() {
       
    }
    private onLogout(){
        HMFW.GameStateFsm.Instance.ChangeState("UnLoginedState");
    }
    LeaveState(arg?: any[]){
        this.removeEvent();
    }
    private removeEvent(){
        HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_LOGOUT,this,this.onLogout);
    }
}