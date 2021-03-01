import { DataCenterKey } from "../AppConfig";
import { CoverUI } from "../AppUI/CoverUI";
import { AlbumDatas } from "../Data/AlbumDatas";
import { PhotoData } from "../Data/PhotoData";
import { UserData } from "../Data/UserData";
import { HMFW } from "../HMFW/HMFW";
import { LibEdit } from "../LibEdit/LibEdit";
import { LoginedState } from "./LoginedState";
import { UnLoginedState } from "./UnLoginedState";

export class InitState extends HMFW.GameStateBase{
    constructor(){
        super("InitState");
    }
    EnterState(arg?: any[]){
        LibEdit.Edit();
        this.initApp();
        HMFW.GameStateFsm.Instance.ChangeState("UnLoginedState");
    }
    public initApp(){
        
        if (window["Laya3D"]) Laya3D.init(Laya.Browser.width, Laya.Browser.height);
		else Laya.init(Laya.Browser.width, Laya.Browser.height, Laya["WebGL"]);
        
        HMFW.DataCenter.Instance.regDataType(DataCenterKey.UserData,UserData);
        HMFW.DataCenter.Instance.regDataType(DataCenterKey.AlbumDatas,AlbumDatas);
        HMFW.DataCenter.Instance.regDataType(DataCenterKey.PhotoData,PhotoData);
        HMFW.GameStateFsm.Instance.RegState(new LoginedState() );
        HMFW.GameStateFsm.Instance.RegState(new UnLoginedState() );
    }

    public OnUpdate() {
       
    }
    LeaveState(){

    }
}