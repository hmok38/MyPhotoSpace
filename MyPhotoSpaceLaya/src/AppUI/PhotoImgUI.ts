import { DataCenterKey } from "../AppConfig";
import { PhotoData } from "../Data/PhotoData";
import { HMFW } from "../HMFW/HMFW";
import { ui } from "../ui/layaMaxUI";

export class PhotoImgUI extends ui.PhotoImgUIUI {
    dataCenter: PhotoData;
    photoId: number;
    private bigPhotoMaxWidth: number;
    private bigPhotoMaxHeight: number;
    private bigPhotoMinWidth: number;
    private bigPhotoMinHeight: number
    private bigPhotoRate: number;
    private mainImgStartPoint: Laya.Point = new Laya.Point();

    private clickTimes: number = 0;
    private mouseDownFrame: number = 0;
    private clickFrame: number = 0;

    private beDraging: boolean = false;
    private mouseStartPoint: Laya.Point = new Laya.Point();
    constructor() {
        super();
    }
    onAwake() {
        this.dataCenter = HMFW.DataCenter.Instance.getData(DataCenterKey.PhotoData, PhotoData);
        this.regevent();
        //防止点击列表的时候造成的连续点击产生的影响
        this.timerOnce(300, this, () => {

            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            
            this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            //this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
            this.frameLoop(1, this, this.onUpdate, null, false)
        })

    }
    onOpened(photoId: number) {
        this.photoId = photoId;
        this.dataCenter.getSmallPhotoInfoAndUrl(this.photoId, (photoinfo, url) => {
            this.mainImg.skin = url;
            if (Laya.stage.width >= Laya.stage.height) {
                this.mainImg.width = Laya.stage.height;
                this.mainImg.height = Laya.stage.height;
            } else {
                this.mainImg.width = Laya.stage.width;
                this.mainImg.height = Laya.stage.width;
            }

        })
        this.dataCenter.getBigPhotoInfoAndUrl(this.photoId, (photoinfo, url) => {
            let img = new Image();
            img.src = url;
            img.onload = () => {
                this.bigPhotoMaxWidth = img.width*Laya.Browser.pixelRatio;
                this.bigPhotoMaxHeight = img.height*Laya.Browser.pixelRatio;
                
                this.mainImg.skin = url;
                let stageRate = Laya.stage.width / Laya.stage.height;
                this.bigPhotoRate = this.bigPhotoMaxWidth / this.bigPhotoMaxHeight;

                if (this.bigPhotoRate >= stageRate) {
                    this.bigPhotoMinWidth = Laya.stage.width;
                    this.bigPhotoMinHeight = Laya.stage.width / this.bigPhotoRate;

                } else {
                    this.bigPhotoMinWidth = Laya.stage.height * this.bigPhotoRate;
                    this.bigPhotoMinHeight = Laya.stage.height;
                }
                this.mainImg.width = this.bigPhotoMinWidth;
                this.mainImg.height = this.bigPhotoMinHeight;
            }

        })
    }
    private onMouseDown(e: Laya.Event) {
        var touches: Array<any> = e.touches;
        //移动
        if (touches && touches.length == 1) {
            console.log("单指按下")
            this.mouseStartPoint.x = Laya.MouseManager.instance.mouseX;
            this.mouseStartPoint.y = Laya.MouseManager.instance.mouseY;
            this.mouseDownFrame = Laya.timer.currFrame;
            this.mainImgStartPoint.x = this.mainImg.x;
            this.mainImgStartPoint.y = this.mainImg.y;
            this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        //多点触碰双指缩放
        else if (touches && touches.length == 2) {
            // this.lastDistance = this.getDistance(touches);

            // Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
        }
    }
    private onMouseMove(e: Laya.Event) {

        var touches: Array<any> = e.touches;
        //移动
        if (touches && touches.length == 1) {
            let dx = Laya.MouseManager.instance.mouseX - this.mouseStartPoint.x;
            let dy = Laya.MouseManager.instance.mouseY - this.mouseStartPoint.y;
            this.mainImg.x = this.mainImgStartPoint.x + dx;
            this.mainImg.y = this.mainImgStartPoint.y + dy;
        }
    }
    private onMouseUp(e: Laya.Event) {
        var touches: Array<any> = e.touches;
        this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);

        if (touches && touches.length == 1) {
            console.log("多指释放,还剩1个")

        } else if (touches && touches.length == 2) {
            console.log("多指释放,还剩2个")
        } else {
            console.log("释放还剩0个")
            let dx = Laya.MouseManager.instance.mouseX - this.mouseStartPoint.x;
            let dy = Laya.MouseManager.instance.mouseY - this.mouseStartPoint.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            //是快速点击
            if (distance < 20 && Laya.timer.currFrame - this.mouseDownFrame <= 20) {
                console.log("Click")
                this.clickTimes++;
                if (this.clickTimes == 1) {
                    this.clickFrame = Laya.timer.currFrame;
                }

                //快速多次点击
                else if (this.clickTimes >= 2) {
                    console.log("DoubleClick")
                    this.clickTimes = 0;
                    this.sizeChange();

                }
            }
        }
    }

    private sizeChange() {
        if (Math.abs(this.mainImg.width - this.bigPhotoMinWidth) <= 10 && Math.abs(this.mainImg.height - this.bigPhotoMinHeight) <= 10) {
            //变大
            this.mainImg.width = this.bigPhotoMaxWidth;
            this.mainImg.height = this.bigPhotoMaxHeight;
        } else {
            this.mainImg.width = this.bigPhotoMinWidth;
            this.mainImg.height = this.bigPhotoMinHeight;
        }
    }
    private getMouseMoveDis() {


    }
    /**计算两个触摸点之间的距离*/
    private getDistance(points: Array<any>): number {
        var distance: number = 0;
        if (points && points.length == 2) {
            var dx: number = points[0].stageX - points[1].stageX;
            var dy: number = points[0].stageY - points[1].stageY;

            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    }
    private onClick() {
        console.log("ClickEvent")
        this.clickTimes++;


    }
    private onDoubleClick() {

    }
    private onUpdate() {
        if (this.clickTimes == 1 && Laya.timer.currFrame - this.clickFrame >= 20) {
            console.log("Click" + (Laya.timer.currFrame - this.clickFrame))
            HMFW.UIManage.Instance.CloseUI(PhotoImgUI);
            this.clickTimes = 0;
        }

    }
    private regevent() {


    }
    private showMiniPhoto() {

    }


}