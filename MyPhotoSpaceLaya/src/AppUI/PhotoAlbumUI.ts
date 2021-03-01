import { DataCenterKey } from "../AppConfig";
import { AlbumDatas, AlbumInfo } from "../Data/AlbumDatas";
import { HMFW } from "../HMFW/HMFW";
import { NetContentType, NetworkManager } from "../Manager/NetworkManager";
import { ui } from "../ui/layaMaxUI";
import { PhotoListUI } from "./PhotoListUI";

export class PhotoAlbumUI extends ui.PhotoAlbumUIUI {
    private datas: AlbumDatas
    constructor() {
        super();
    }

    onAwake() {
        this.albumList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
        this.albumList.selectEnable=true;
        this.albumList.vScrollBarSkin="";
        this.albumList.elasticEnabled=true;
        
        this.albumList.selectHandler=Laya.Handler.create(this,this.onSelect,null,false);
        let datas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
        datas.RegChangeEvent(this, this.showAlbums)
        this.createAlbumBtn.clickHandler = Laya.Handler.create(this, this.onCreateAlbumBtn, null, false);
        this.refreshBtn.clickHandler = Laya.Handler.create(this, this.onRefreshBtn, null, false);
        this.sureCreateBtn.clickHandler = Laya.Handler.create(this, this.onSureCreateBtn, null, false);
        this.closeCreateAlbumBtn.clickHandler = Laya.Handler.create(this, () => {
            this.creatAlbumBox.visible = false;
        })
        this.showAlbums(datas);

    }
    private showAlbums(datas: AlbumDatas) {
        this.creatAlbumBox.visible = false;
        this.datas = datas;
        if (!this.datas.datas || this.datas.datas.length <= 0) {
            this.albumList.array = [];
            this.albumList.refresh();
            return;
        }
        this.albumList.array = datas.datas;
        this.albumList.refresh();
    }
    private onSelect(){
        console.log(this.albumList.selectedIndex);
        HMFW.UIManage.Instance.CloseUI(PhotoAlbumUI)
        HMFW.UIManage.Instance.OpenUI(PhotoListUI,this.datas.datas[this.albumList.selectedIndex]);
       
    }
    private onListRender(cell: Laya.Box, index: number) {
        let albumNameLabel = cell.getChildByName("albumNameLabel") as Laya.Label;
        let countLabel = cell.getChildByName("countLabel") as Laya.Label;
        let createrUserLabel = cell.getChildByName("createrUserLabel") as Laya.Label;
        let lastPhotoTimeLabel = cell.getChildByName("lastPhotoTimeLabel") as Laya.Label;
        if (this.datas && this.datas.datas && index >= 0 && index < this.datas.datas.length) {
            let data = this.datas.datas[index];
            if (data) {
                albumNameLabel.text = data.albumName;
                countLabel.text = data.photoIds ? (data.photoIds.length.toString() + "张") : "0张";
                createrUserLabel.text = data.createrUser;
                lastPhotoTimeLabel.text = data.lastPhotoTime.substring(0,10);
            } else {
                albumNameLabel.text = "";
                countLabel.text = "0张";
                createrUserLabel.text = "";
                lastPhotoTimeLabel.text = "";
            }

        } else {
            albumNameLabel.text = "";
            countLabel.text = "0张";
            createrUserLabel.text = "";
            lastPhotoTimeLabel.text = "";
        }

    }
    private onCreateAlbumBtn() {
        HMFW.UIHelper.playBtnTouchAction(this.createAlbumBtn, () => {
            this.createAlbumInput.text="";
            this.creatAlbumBox.visible = true;
        })
    }
    private onSureCreateBtn() {
        let name = this.createAlbumInput.text;
        if (!name || name.length < 1) {
            HMFW.TipsManager.Instance.showTips("请输入新相册的名字");
            return;
        }
        HMFW.UIHelper.playBtnTouchAction(this.createAlbumBtn, () => {

            NetworkManager.requestNewAlbum(name, null, null);
            this.creatAlbumBox.visible = false;
        })
    }
    private onRefreshBtn() {
        HMFW.UIHelper.playBtnTouchAction(this.refreshBtn, () => {
            NetworkManager.requestAllAlbums();

        })
    }
    onClosed() {
        let datas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
        datas.RemoveEvent(this, this.showAlbums);

    }
}



