import { DataCenterKey } from "../AppConfig";
import { UserData } from "../Data/UserData";
import { LoginedState } from "../GameState/LoginedState";
import { HMFW } from "../HMFW/HMFW";
import { NetworkManager } from "../Manager/NetworkManager";
import { ui } from "../ui/layaMaxUI";

export class LoginUI extends ui.LoginUIUI{
    onAwake(){
       
      

        this.loginBtn.clickHandler=Laya.Handler.create(this,this.onLoginBtn,null,false);
        let localUserName= Laya.LocalStorage.getItem("LocalUserName");
        if(localUserName&&localUserName.length>0){
            this.userNameInput.text=localUserName;
        }
    }
    onEnable(){
        HMFW.UIHelper.playUIScaleAction(this.loginBox);
    }
    private onLoginBtn(){
        
        HMFW.UIHelper.playBtnTouchAction(this.loginBtn,()=>{
            if(this.userNameInput.text.length<=0||this.passwordInput.text.length<=0){
                HMFW.TipsManager.Instance.showTips("请输入用户名和密码")
                return;
            }
            Laya.LocalStorage.setItem("LocalUserName",this.userNameInput.text);
            NetworkManager.loginRequest(this.userNameInput.text,this.passwordInput.text,(data)=>{

                let userData= HMFW.DataCenter.Instance.getData(DataCenterKey.UserData,UserData);
                userData.userId=data.userInfo.userId;
                userData.username=data.userInfo.username;
                userData.nickName=data.userInfo.nickName;
                userData.token=data.token;
                userData.CallEvent();
                HMFW.GameStateFsm.Instance.ChangeState("LoginedState");
            });
        })
    }
}