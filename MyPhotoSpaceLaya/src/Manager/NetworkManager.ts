import { DataCenterKey, HMFWEvent } from "../AppConfig";
import { LoginUI } from "../AppUI/LoginUI";
import { WaitNetUI } from "../AppUI/WaitNetUI";
import { AlbumDatas } from "../Data/AlbumDatas";
import { PhotoData } from "../Data/PhotoData";
import { UserData } from "../Data/UserData";
import { HMFW } from "../HMFW/HMFW";

export class NetworkManager {
    private static get BaseUrl() {
        return "http://47.98.55.138:8080/api/";
    }
    static uploadPhoto(PhotoAlbumId:number ,name:string,base64Str:string,suc: Function,fail:Function){
        HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
        this.PostSever(this.BaseUrl + "Photo/UploadPhoto", NetContentType.jsonType, { "PhotoAlbumId": PhotoAlbumId, "Name": name ,"File":base64Str}, (data) => {
            let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
            albumDatas.setOneData(data.photoAlbumId,data)
            if (suc) {
                suc(data);
            }
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
        }, (mes)=>{
            if(fail){
                fail(mes)
            }
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
        }, true);
    }
    static requestPhoto(photoId: number, big: boolean, suc: Function) {
        this.PostSever(this.BaseUrl + "Photo/GetPhoto", NetContentType.jsonType, { "PhotoId": photoId, "BeBig": big }, (data) => {
            if (suc) {
                suc(data);
            }
        }, null, true);

    }
    static requestNewAlbum(newAlbumName: string, suc: Function, fail: Function) {
        HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
        this.PostSever(this.BaseUrl + "Photo/CreatPhotoAlbum", NetContentType.jsonType, { "Name": newAlbumName }, (data) => {

            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
            albumDatas.setNewAllDatas(data)
            if (suc) {
                suc(data);
            }
        }, (mes) => {
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            if (fail) {
                fail(mes);
            }

        });
    }
    static requestAllAlbums(suc: Function = null, fail: Function = null) {
        HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
        this.PostSever(this.BaseUrl + "Photo/GetPhotoAlbums", NetContentType.jsonType, null, (data) => {
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
            albumDatas.setNewAllDatas(data)
            if (suc) {
                suc(data);
            }
        }, (mes) => {
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            if (fail) {
                fail(mes);
            }

        })
    }

    static loginRequest(userName: string, password: string, suc: Function) {
        HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
        this.PostSever(this.BaseUrl + "login", NetContentType.jsonType, { userName: userName, password: password }, (data) => {
            //console.log(data);
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);

            if (suc) {
                suc(data);
            }
        }, (mes) => {
            HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            HMFW.TipsManager.Instance.showTips(mes)
        }, false);
    }

    private static PostSever(url: string, type: NetContentType, data: any, sucessCb: Function, failCb: Function, needToken: boolean = true, responseType: string = "json") {
        var oReq = new XMLHttpRequest();

        oReq.open("Post", url, true);
        if (responseType == "arraybuffer") {
            oReq.responseType = "arraybuffer";
        }
        oReq.onreadystatechange = () => {
            if (oReq.readyState === 4) {
                if (oReq.status === 200) {
                    if (sucessCb) {
                        if (oReq.responseType == "json" || oReq.responseType == "") {
                            var res = JSON.parse(oReq.responseText);
                            if (res && res.data) {
                                sucessCb(res.data);
                            } else {
                                sucessCb();
                            }
                        } else {

                            sucessCb(oReq.response)
                        }


                    }
                } else if (oReq.status === 400) {
                    if (failCb) {
                        if (oReq.responseType == "json" || oReq.responseType == "") {
                            var res = JSON.parse(oReq.responseText);
                            if (res && res.message) {
                                HMFW.TipsManager.Instance.showTips(res.message)
                                failCb(res.message);
                            }
                        } else {
                            HMFW.TipsManager.Instance.showTips("错误的请求")
                            failCb("错误的请求");
                        }
                    }
                }
                else if (oReq.status === 401) {
                    HMFW.TipsManager.Instance.showTips("未登录或者登录过期")
                    if (failCb) {
                        failCb("未登录或者登录过期");
                    }
                    HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_LOGOUT);
                } else {
                    HMFW.TipsManager.Instance.showTips("请求错误,状态码:" + oReq.status)
                    if (failCb) {
                        failCb("请求错误,状态码:" + oReq.status);
                    }

                }
            }
        }
        oReq.setRequestHeader("Content-type", type)
        if (needToken) {
            let userData = HMFW.DataCenter.Instance.getData(DataCenterKey.UserData, UserData);
            if (userData && userData.token) {
                oReq.setRequestHeader("Authorization", "Bearer " + userData.token);
            }

        }
        if (data) {
            oReq.send(JSON.stringify(data));
        } else {
            oReq.send();
        }

    }


   
}
export enum NetContentType {
    jsonType = 'application/json',
    fileType = 'multipart/form-data'
}