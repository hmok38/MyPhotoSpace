import { HMFW } from "../HMFW/HMFW";

export class AlbumDatas extends HMFW.DataBase {
    constructor() {
        super();
    }
    datas: AlbumInfo[] = []
    setNewAllDatas(datas) {
        this.datas = [];
        for (let index = 0; index < datas.length; index++) {
            const element = datas[index];
            let aa = new AlbumInfo();
            aa.setData(element);
            this.datas.push(aa);
        }
        this.CallEvent();
    }
    setOneData(alibumId:number,data){
      let info=  this.getAlbumInfo(alibumId);
      if(info){
          info.setData(data);
      }else{
         info= new AlbumInfo();
         info.setData(data);
         this.datas.push(info);
      }
    }
    getAlbumInfo(albumId:number):AlbumInfo{
      let albumInfoIndex=  this.datas.findIndex(x=>{return x.photoAlbumId==albumId})
      if(albumInfoIndex>=0){
          return this.datas[albumInfoIndex]
      }
      return null;
    }
}
export class AlbumInfo {
    photoAlbumId: number = -1;
    albumName: string = "";
    creatTime: string = "";
    createrUser: string = "";
    lastPhotoTime: string = "";
    photoIds: number[] = [];
    setData(dataInfo) {
        this.photoAlbumId = dataInfo.photoAlbumId;
        this.albumName = dataInfo.albumName;
        this.creatTime = dataInfo.creatTime;
        this.createrUser = dataInfo.createrUser;
        this.lastPhotoTime = dataInfo.lastPhotoTime;
        this.photoIds = dataInfo.photoIds;
    }
}