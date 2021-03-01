import { HMFW } from "../HMFW/HMFW";
import { NetworkManager } from "../Manager/NetworkManager";

export class PhotoData extends HMFW.DataBase {
    constructor() {
        super();
    }
    smallPhotoMap: Map<number, string> = new Map();
    bigDataMap: Map<number, string> = new Map();
    photoInfoMap: Map<number, PhotoInfo> = new Map();

    getSmallPhotoInfoAndUrl(photoId: number, callBack: Function) {
        if (this.smallPhotoMap.has(photoId)) {

            callBack(this.photoInfoMap.get(photoId), this.smallPhotoMap.get(photoId));
        } else {
            NetworkManager.requestPhoto(photoId, false, (data) => {
                let photoInfo = new PhotoInfo();
                photoInfo.setData(data);
                this.photoInfoMap.set(photoId, photoInfo);
                let array = HMFW.NetworkHelper.convertBase64ToBytes(data.photoData);
                let url = HMFW.NetworkHelper.bytesToUrl(array)
                this.smallPhotoMap.set(photoId, url);
                callBack(photoInfo, this.smallPhotoMap.get(photoId));

            })
        }
    }
    getBigPhotoInfoAndUrl(photoId: number, callBack: Function) {
        if (this.bigDataMap.has(photoId)) {

            callBack(this.photoInfoMap.get(photoId), this.bigDataMap.get(photoId));
        } else {
            NetworkManager.requestPhoto(photoId, true, (data) => {
                let photoInfo = new PhotoInfo();
                photoInfo.setData(data);
                this.photoInfoMap.set(photoId, photoInfo);
                let array = HMFW.NetworkHelper.convertBase64ToBytes(data.photoData);
                let url = HMFW.NetworkHelper.bytesToUrl(array)
                this.bigDataMap.set(photoId, url);
                callBack(photoInfo, this.bigDataMap.get(photoId));
            })
        }
    }
}
export class PhotoInfo {
    constructor() { };
    photoId: number = -1;
    photoName: string = "";
    creatTime: string = "";
    photoUserName: string = "";
    setData(data) {
        this.photoId = data.photoId;
        this.photoName = data.photoName;
        this.creatTime = data.creatTime;
        this.photoUserName = data.photoUserName;
    }
}