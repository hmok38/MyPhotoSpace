import { ui } from "../ui/layaMaxUI";

export class  WaitNetUI extends ui.WaitNetUIUI
 {
    constructor() {
        super();
    }

    onAwake(){
        this.frameLoop(1,this,()=>{
            this.waitImg.rotation+=6;
        })
    }
    
}