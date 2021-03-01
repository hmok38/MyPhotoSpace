import { HMFWEvent } from "../AppConfig";
import { HMFW } from "../HMFW/HMFW";
import { ui } from "../ui/layaMaxUI"

export class CoverUI extends ui.CoverUIUI {
    constructor() { super() }
    onAwake() {
        this.regEvent();
    }
    
    private regEvent() {
        this.controlImg.on(Laya.Event.DOUBLE_CLICK,this,this.onClickControlImg);    
    }
    private removeEvent(){

    }
    private onClickControlImg(){
        this.bgBox.visible=!this.bgBox.visible;
        if(this.bgBox.visible){
            this.controlImg.clearTimer(this,this.onMyVisible)
            this.controlImg.offAll(); 
            
            this.controlImg.timerOnce(1000,this,this.onMyVisible)
            
            HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_CoveUIVisable);
        }else{
            this.controlImg.clearTimer(this,this.onMyVisible)
            this.controlImg.offAll();   
            this.controlImg.on(Laya.Event.CLICK,this,this.onClickControlImg);   
            HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_CoveUIDisable);
        }
    }
    private onMyVisible(){
        this.controlImg.on(Laya.Event.DOUBLE_CLICK,this,this.onClickControlImg);   
    }
    onOpened() {

    }
    onClosed() {
        this.removeEvent();
    }


}