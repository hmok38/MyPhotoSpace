import { DataCenterKey, HMFWEvent } from "../AppConfig";
import { AlbumDatas, AlbumInfo } from "../Data/AlbumDatas";
import { PhotoData, PhotoInfo } from "../Data/PhotoData";
import { HMFW } from "../HMFW/HMFW";
import { NetworkManager } from "../Manager/NetworkManager";
import { ui } from "../ui/layaMaxUI";
import { PhotoAlbumUI } from "./PhotoAlbumUI";
import { PhotoImgUI } from "./PhotoImgUI";

export class PhotoListUI extends ui.PhotoListUIUI {
    albumInfo: AlbumInfo
    miniMapDataBase64: string;
    domElement: any;
    constructor() {
        super();
    }
    onAwake() {

       
        this.photoList.renderHandler = Laya.Handler.create(this, this.onRender, null, false);
        this.closeBtn.clickHandler = Laya.Handler.create(this, this.onCloseBtn, null, false);
        this.uploadBox.visible = false;
        this.timerOnce(100, this, () => {
           
            this.domElement =   HMFW.DomHelper.selectImg(this.uploadBtn.width, this.uploadBtn.height, this.uploadBtn.x, this.uploadBtn.y, (result) => {
                

                if (result && result.length > 0) {
                    this.miniMapDataBase64 = result.split(",")[1];
                    this.showUploadBox();
                }
              
                
            })
            this.domElement.disabled=false;
            
        })
        HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_CoveUIVisable,this,this.onCaveUIVisable);
        HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_CoveUIDisable,this,this.onCaveUIDisable);
    }
    private onCaveUIVisable(){
        if(this.domElement){
            this.domElement.disabled=true;
        }
    }
    private onCaveUIDisable(){
        if(this.domElement){
            this.domElement.disabled=false;
        }
    }
    onOpened(arg: AlbumInfo) {
        this.albumInfo = arg;
       
        this.photoList.selectEnable = true;
        this.photoList.vScrollBarSkin = "";
        this.photoList.elasticEnabled = true;
        this.photoList.selectHandler = Laya.Handler.create(this, this.onListSelect, null, false);
        this.uploadBtn.clickHandler = Laya.Handler.create(this, this.onUploadBtn, null, false);
        this.refeshShow();
    }

    private refeshShow(){
        if(this.albumInfo){
            let albumdatas=HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas,AlbumDatas)
            this.albumInfo=albumdatas.getAlbumInfo(this.albumInfo.photoAlbumId);
            this.albumNameLabel.text = this.albumInfo.albumName;
            this.albumCountLabel.text = this.albumInfo.photoIds ? this.albumInfo.photoIds.length + "张" : "0张";
            this.photoList.array = this.albumInfo.photoIds;
            this.photoList.refresh();

        }else{
            this.photoList.array = [];
            this.photoList.refresh();
        }
    }
    private onRender(cell: Laya.Box, index: number) {
        let photoImg = cell.getChildByName("photoImg") as Laya.Image;
        let nameLabel = cell.getChildByName("nameLabel") as Laya.Label;
        let timeLabel = cell.getChildByName("timeLabel") as Laya.Label;
        let id = this.albumInfo.photoIds[index];
        let dataCenter = HMFW.DataCenter.Instance.getData(DataCenterKey.PhotoData, PhotoData);
        dataCenter.getSmallPhotoInfoAndUrl(id, (photoInfo: PhotoInfo, url) => {
            photoImg.skin = url;
            nameLabel.text = photoInfo.photoName;
            timeLabel.text = photoInfo.creatTime.substr(0,10);
        })

    }
    private onListSelect() {
        console.log(this.photoList.selectedIndex);
        HMFW.UIManage.Instance.OpenUI(PhotoImgUI,this.albumInfo.photoIds[this.photoList.selectedIndex]);
        
    }
    private onUploadBtn() {
        HMFW.UIHelper.playBtnTouchAction(this.uploadBtn, () => {

        })

    }
    private onCloseBtn() {
        HMFW.UIHelper.playBtnTouchAction(this.closeBtn, () => {
            HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_CoveUIVisable,this,this.onCaveUIVisable);
            HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_CoveUIDisable,this,this.onCaveUIDisable);
            NetworkManager.requestAllAlbums();
            HMFW.UIManage.Instance.CloseUI(PhotoListUI);
            HMFW.UIManage.Instance.OpenUI(PhotoAlbumUI);
            if (this.domElement) {
                Laya.Browser.document.body.removeChild(this.domElement);
            }

        })

    }
    private hidUploadBox() {
        HMFW.UIHelper.playBtnTouchAction(this.closeUploadBtn, () => {
            this.uploadBox.visible = false;
            this.sureUploadBtn.clickHandler = null;
        })

    }
    private onSureUpload() {
        HMFW.UIHelper.playBtnTouchAction(this.sureUploadBtn, () => {
            NetworkManager.uploadPhoto(this.albumInfo.photoAlbumId,this.uploadNameLabel.text,this.miniMapDataBase64,(albumDatas)=>{
               
                
                this.refeshShow();
                this.hidUploadBox();
                HMFW.TipsManager.Instance.showTips("上传成功");
            },(mes)=>{
                this.hidUploadBox();
            })
        })
    }
    private showUploadBox() {
        this.uploadBox.visible = true;
        let bytes = HMFW.NetworkHelper.convertBase64ToBytes(this.miniMapDataBase64)
        let url = HMFW.NetworkHelper.bytesToUrl(bytes);
        this.uploadImg.skin = url;
        this.closeUploadBtn.clickHandler = Laya.Handler.create(this, this.hidUploadBox, null, false);
        this.sureUploadBtn.clickHandler = Laya.Handler.create(this, this.onSureUpload, null, false);
    }
}