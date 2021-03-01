

/**H5小游戏框架 by:HMOK on 20190414 
 * @version 1.0.4 on 20191225 -uiManager,再次打开一个已经开启的UI的时候,会先关闭它,再次打开,避免数据错误
 */
export module HMFW {
    /**数据基类 */
    export abstract class DataBase {


        constructor() {
        }
        private handlers: Laya.Handler[] = [];
        /**注册值改变事件 */
        public RegChangeEvent(call: object, func: Function) {
            let handler = Laya.Handler.create(call, func, null, false);
            this.handlers.push(handler);
        }
        /**移除值改变事件 */
        public RemoveEvent(call: object, func: Function) {
            let delet = -1;
            for (let index = 0; index < this.handlers.length; index++) {
                const element = this.handlers[index];
                if (element.caller === call && element.method === func) {
                    delet = index;
                }

            }
            if (delet >= 0) {
                this.handlers.splice(delet, 1);
            }
        }
        /**调用值改变事件 请改变值之后手动调用一次,好通知所有注册的事件 */
        public CallEvent() {
            this.handlers.forEach(element => {
                element.runWith(this);
            });
        }
    }
    /**各种状态基类 */
    export abstract class StateBase {
        /**状态基类 传入名字和所属的fsm*/
        constructor(myName: string) {
            this.stateName = myName;
        }
        /**状态的名字 */
        public stateName: string;
        /**状态的管理机 */
        public fsm: FsmBase;
        /**帧循环 */
        public abstract OnUpdate();
        /**进入状态 */
        public abstract EnterState(arg?: any[]);
        /**离开状态 */
        public abstract LeaveState(arg?: any[]);
    }
    /**游戏状态基类 */
    export abstract class GameStateBase extends StateBase {

        /**游戏状态基类 参数为具体子类的名字*/
        constructor(myName: string) {
            super(myName);

        }

        /**本状态的fsm */
        public myFsm(): GameStateFsm {
            return this.fsm as GameStateFsm;
        }
        /**进入状态 */
        public EnterState(arg?: any[]) {
            console.debug("进入游戏状态:" + this.stateName)
        };
        /**离开状态 */
        public LeaveState(arg?: any[]) {

            console.debug("离开游戏状态:" + this.stateName)
        };


    }
    /**状态机基类*/
    export abstract class FsmBase {
        /**状态机基类 */
        constructor(ower: Object) {

            this.ower = ower;
            FsmManager.Instance.regFsm(this);

        }
        /**状态机拥有者 */
        ower: Object;
        /**当前状态 */
        public currentState: StateBase;
        /**上一个状态 */
        public lastState: StateBase;
        /**状态字典 */
        stateMap: { [key: string]: StateBase } = {};
        /**向状态管理机注册状态 */
        public RegState(state: StateBase) {
            if (!state) {
                return;
            }

            // console.log("注册状态:"+state.stateName);
            if (!this.stateMap[state.stateName]) {
                this.stateMap[state.stateName] = state;
                state.fsm = this;
            }

        }


        /**改变游戏状态 注意:如果再次改变到当前状态会重走一次当前状态的流程*/
        public ChangeState<T extends StateBase>(stateName: string, arg?: any) {
            //&& this.GetState(stateName) != this.currentState
            var stateTemp = this.GetState<T>(stateName);

            if (stateTemp != null && stateTemp != undefined) {
                var lastStateChangen = false;
                if (this.currentState !== stateTemp) {
                    this.lastState = this.currentState;
                    lastStateChangen = true;
                }

                this.currentState = stateTemp;
                if (this.lastState && lastStateChangen) {
                    this.lastState.LeaveState(arg);
                }

                this.currentState.EnterState(arg);
            } else {
                console.log("状态切换失败:" + stateName);
            }

        }
        /**获取游戏状态 */
        public GetState<T extends StateBase>(stateName: string): T {

            if (!this.stateMap[stateName]) {
                console.log("没有找到Game状态:" + stateName);
                return null;
            }
            return this.stateMap[stateName] as T;

        }

        /**检查当前游戏状态是不是参数传入的状态 */
        public CheckCurrentState<T extends StateBase>(stateName: string): boolean {
            if (this.currentState && (this.currentState).stateName === stateName) {
                return true;
            }
            return false;
        }
        // /**帧循环 */
        // public abstract OnUpdate(): void;
    }
    /**模块基 */
    export abstract class ModuleBase {
        public name: string;
        public constructor(name: string) {

            this.name = name;
            this.OnCreate();
            this.OnRegistMsg();
        }
        public abstract OnCreate(): void;
        public abstract OnLoadLocalConfig(): void;
        public abstract OnLoadDBConfig(): void;
        public abstract OnStart(): void;
        public abstract OnDestroy(): void;
        public abstract OnRegistMsg(): void;
        public abstract OnRegistTimer(): void;
    }
    /**资源管理器,对所有图片资源和音频资源进行管理,设定预加载等操作 */
    export class AssetManager {
        private static _Instance: AssetManager;
        /**获得单例 */
        public static get Instance() {
            if (!AssetManager._Instance) {
                AssetManager._Instance = new AssetManager();
            }
            return AssetManager._Instance;
        }
        /**分组管理的图集资源字典 */
        private assetMap: { [key: string]: string[] } = {};
        /**具体美术资源地址 */
        private assetAliasMap: { [key: string]: any } = {};


        constructor() {

        }

        /**
         * 设置某资源到某个资源组,方便分组加载资源
         * @param teamName 资源组名
         * @param url 要加入的资源
         */
        setLoadAssetToTeam(teamName: string, url: string) {
            if (!this.assetMap[teamName]) {
                this.assetMap[teamName] = [];
            }
            this.assetMap[teamName].push(url);
        }
        /**
         * 设置某组资源到某个资源组,方便分组加载资源
         * @param teamName 资源组名
         * @param urls 要加入的资源组
         */
        setLoadAssetsArrayToTeam(teamName: string, urls: string[]) {
            if (!this.assetMap[teamName]) {
                this.assetMap[teamName] = [];
            }
            for (let index = 0; index < urls.length; index++) {
                const element = urls[index];
                this.assetMap[teamName].push(element);
            }

        }
        /**获取图集资源组数组 */
        getAssetsTeamArray(teamName: string): string[] {
            return this.assetMap[teamName];
        }
        /**
         * 设置资源名称和地址,方便以简单名称获取资源,如果需要预加载请另外调用setLoadAssetToTeam函数,根据设定返回字符串或者字符串数组 
         * @param aliasName 别名
         * @param assetsUrl 资源地址
         */
        setAssetAlias(aliasName: string, assetsUrl: string) {
            this.assetAliasMap[aliasName] = assetsUrl;
        }
        /**设置美术资源名称和地址,方便以简单名称获取美术资源,如果需要预加载请另外调用setLoadAtlas函数,根据设定返回字符串或者字符串数组 */
        setAssetsArrayAlias(aliasName: string, assetsUrlArray: string[]) {
            this.assetAliasMap[aliasName] = assetsUrlArray;
        }
        /**根据简单名称获取资源地址 */
        getAssetUrlFromAlias(assetName: string): string {
            return this.assetAliasMap[assetName];
        }
        /**根据简单名称获取资源地址 */
        getAssetUrlArrayAlias(assetName: string): string[] {
            return this.assetAliasMap[assetName];
        }


    }
    /**数据中心,请使用Instance访问 */
    export class DataCenter {
        private static _Instance: DataCenter;
        public static get Instance() {
            if (DataCenter._Instance == null) {
                DataCenter._Instance = new DataCenter();
                DataCenter._Instance.Init();
            }
            return DataCenter._Instance;
        }
        private DataMap: {} = {};

        constructor() { }

        /**初始化 */
        private Init(): void {

        }
        /**注册数据类型 */
        public regDataType<T extends DataBase>(dataName: string, type: { new(): T }): T {
            if (!this.DataMap[dataName]) {
                this.DataMap[dataName] = new type();
            }
            return this.DataMap[dataName] as T;

        }
        /**获取数据 */
        public getData<T extends DataBase>(dataName: string, type: { new(): T }): T {
            if (!this.DataMap[dataName]) {
                this.DataMap[dataName] = new type();
            }
            return this.DataMap[dataName] as T;
        }
        /**移除这个数据 */
        public removeData<T extends DataBase>(dataName: string, type: { new(): T }) {

            if (!this.DataMap[dataName]) {
                this.DataMap[dataName] = null;
            }
        }
    }
    /**模块管理器 直接调用静态方法即可 */
    export class ModuleManager {
        private static moduleMap = {}; //;

        public static Regist(module: ModuleBase): void {

            ModuleManager.moduleMap[module.name] = module;
        }
        /**各模块读取本地配置文件 */
        public static LoadLocalConfig(): void {
            for (const key in ModuleManager.moduleMap) {
                if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                    const element: ModuleBase = ModuleManager.moduleMap[key];
                    element.OnLoadLocalConfig.call(element);
                }
            }

        }
        /**各模块载入DB数据 */
        public static LoadDBConfig(): void {
            for (const key in ModuleManager.moduleMap) {
                if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                    const element: ModuleBase = ModuleManager.moduleMap[key];
                    element.OnLoadDBConfig.call(element);
                }
            }

        }
        /**注册各模块需要的计时器 */
        public static RegistTimer(): void {
            for (const key in ModuleManager.moduleMap) {
                if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                    const element: ModuleBase = ModuleManager.moduleMap[key];
                    element.OnRegistTimer.call(element);
                }
            }

        }
        /**启动各模块按照onCreat->onRegMsg->onLoadLocalConfig->onLoadDBConfig->onStart->onRegTimer */
        public static Start(): void {
            ModuleManager.LoadLocalConfig();
            ModuleManager.LoadDBConfig();

            for (const key in ModuleManager.moduleMap) {
                if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                    const element: ModuleBase = ModuleManager.moduleMap[key];
                    element.OnStart.call(element);
                }
            }
            ModuleManager.RegistTimer();
        }
        public static Destroy(): void {
            for (const key in ModuleManager.moduleMap) {
                if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                    const element: ModuleBase = ModuleManager.moduleMap[key];
                    element.OnDestroy.call(element);
                }
            }

        }
        /**获取模块 */
        public static Get<T>(name: string): T {
            try {
                return ModuleManager.moduleMap[name.toString()] as T;
            }
            catch (ex) {
                // console.log(ex)
            }
        }

    }
    /**状态机管理器*/
    export class FsmManager {
        private static _instance: FsmManager = null;
        private fsmMap: FsmBase[] = new Array<FsmBase>();
        /**
         * 获取FsmManager的单例
        */
        public static get Instance(): FsmManager {
            if (FsmManager._instance == null) {
                FsmManager._instance = new FsmManager();
                FsmManager._instance.Init();
            }
            return FsmManager._instance;
        };

        constructor() {

            Laya.timer.loop(1, this, this.onUpdate)
        }

        /**帧调用 */
        public onUpdate() {

            this.fsmMap.forEach(element => {

                if (element && element.currentState) {

                    element.currentState.OnUpdate();
                }

            });
        }
        /**注册状态机 */
        public regFsm(fsm: FsmBase) {
            this.fsmMap.push(fsm);
        }
        /**删除状态机 */
        public removeFsm(fsm: FsmBase) {
            var index = this.fsmMap.indexOf(fsm);
            if (index >= 0) {
                this.fsmMap.splice(index, 1);
            }
        }

        /**
         * 初始化
         */
        public Init() {
            console.debug("状态机管理器初始化")
        }



    }
    /**游戏主逻辑状态机 */
    export class GameStateFsm extends FsmBase {

        private static _instance: GameStateFsm;

        /**
         * 获取游戏状态机的单例
        */
        public static get Instance(): GameStateFsm {

            if (!GameStateFsm._instance) {
                GameStateFsm._instance = new GameStateFsm();

            }
            return GameStateFsm._instance;
        };

        /**创建游戏主逻辑状态机 */
        constructor() {
            super(null);
            // console.log("创建游戏主逻辑状态机")

        }
        // public OnUpdate(): void {
        //     if (this.currentState) {
        //         this.currentState.OnUpdate();
        //     }
        // }

    }
    /**自消除的提示框管理器 */
    export class TipsManager {
        private static _instance: TipsManager = null;
        /**设置提示界面的背景 */
        public bgRes: string = "HMFWRES/noteUIBg.png";
        /**
         * 获取UIManage的单例
        */
        public static get Instance(): TipsManager {
            if (TipsManager._instance == null) {
                TipsManager._instance = new TipsManager();

            }

            return TipsManager._instance;
        };
        private tipsShowPanels: Laya.Image[] = [];
        /** tips队列*/
        private tipsArray: string[] = [];
        private panelY: number = 0;
        private alreadShowPanel: Laya.Image[] = [];
        constructor() {
            //最多同时显示几个就添加几个
            this.tipsShowPanels.push(this.createAPanel());
            this.tipsShowPanels.push(this.createAPanel());
            this.tipsShowPanels.push(this.createAPanel());
            this.tipsShowPanels.push(this.createAPanel());
            Laya.timer.frameLoop(1, this, this.startTipsAnim);
        }
        /**创建板子 */
        private createAPanel(): Laya.Image {
            let temp = new Laya.Image(this.bgRes);
            temp.sizeGrid = "26,23,34,34";
            Laya.stage.addChild(temp);
            temp.alpha = 0.8;
            temp.anchorX = 0.5;
            temp.anchorY = 0.5;
            temp.centerX = 0;
            temp.centerY = 0;
            temp.addChild(new Laya.Label()).name = "label";
            let label = temp.getChildByName("label") as Laya.Label;
            label.centerX = 0;
            label.centerY = 0;
            label.anchorX = 0.5;
            label.anchorY = 0.5;
            label.fontSize = 35;
            label.align = "center";
            label.valign = "middle";
            label.color = "#ffffff";

            temp.visible = false;
            temp.zOrder = 1000;
            return temp;
        }

        /**显示Tips */
        showTips(tipstr: string) {
            if (this.tipsArray.filter(x => x == tipstr).length == 0) {
                this.tipsArray.push(tipstr);
            }


        }
        /**开始显示tips(每帧自动调用) */
        private startTipsAnim() {
            if (this.tipsArray.length <= 0) return;
            for (let index = 0; index < this.tipsShowPanels.length; index++) {
                if (this.tipsArray.length <= 0) break;
                const element = this.tipsShowPanels[index];
                if (element.visible == false) {
                    let str = this.tipsArray[0];
                    this.tipsArray.splice(0, 1);

                    //如果有显示了的tips,那么就将其上移
                    if (this.alreadShowPanel.length > 0) {
                        for (let index = 0; index < this.alreadShowPanel.length; index++) {
                            const showPanel = this.alreadShowPanel[index];
                            showPanel.centerY -= (showPanel.height + 20);
                        }
                    }
                    let label = element.getChildByName("label") as Laya.Label;

                    label.text = str;


                    element.width = label.width + 50;
                    element.height = label.height + 30;
                    element.centerX = 0;
                    element.centerY = 0;
                    element.visible = true;
                    //2秒后上移后消失
                    Laya.timer.once(2000, this, this.closeAnimPanel, [index], false);
                    this.alreadShowPanel.push(element);

                }

            }
        }
        /**开始关闭动画 */
        private closeAnimPanel(arg: number) {
            let index = arg;

            Laya.Tween.to(this.tipsShowPanels[index], { centerY: this.tipsShowPanels[index].centerY - 100, alpha: 0 }, 300, null, Laya.Handler.create(this, (index: number) => {
                //关闭并恢复位置
                this.tipsShowPanels[index].visible = false;
                this.tipsShowPanels[index].centerY = 0;
                this.tipsShowPanels[index].alpha = 0.8;
                let delIndex = this.alreadShowPanel.indexOf(this.tipsShowPanels[index]);
                if (delIndex > -1) {
                    this.alreadShowPanel.splice(delIndex, 1);
                }
            }, [index]))
        }
    }
    /**ui管理器 */
    export class UIManage {
        private static _instance: UIManage = null;

        constructor() { }
        /**
         * 获取UIManage的单例
        */
        public static get Instance(): UIManage {
            if (UIManage._instance == null) {
                UIManage._instance = new UIManage();
                UIManage._instance.Init();
            }
            return UIManage._instance;
        };

        public Init() {

        }
        /**已经开启的UI的列表 */
        private alreadyOpenUIs: Laya.Scene[] = [];

        /**打开UI 后开启的置顶-除非锁定了ZOrder值*/
        public OpenUI<T extends Laya.Scene>(type: new () => T, arg?: any, bIn3D: boolean = false, lockZOrder: number = 0): T {
            let ui: Laya.Scene = null;
            let maxZOrder = 0;
            for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                const element = this.alreadyOpenUIs[index];
                if (element instanceof (type)) {
                    this.CloseUI(type);
                    // ui = element;

                } else {
                    if (element["lockZOrder"] == undefined && element.zOrder > maxZOrder) {
                        maxZOrder = element.zOrder
                    }
                }

            }
            if (ui === null) {
                ui = new type();
            }
            if (lockZOrder > 0) {
                ui.zOrder = lockZOrder;
                ui["lockZOrder"] = lockZOrder;
            } else {
                ui.zOrder = maxZOrder + 1;
            }


            ui.open(false, arg);
            if (bIn3D) {
                Laya.stage.addChild(ui);
            }

            this.alreadyOpenUIs.push(ui);
            return <T>ui;
        }

        /**关闭UI */
        public CloseUI<T extends Laya.Scene>(type: new () => T) {
            let indexClose = -1;
            for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                const element = this.alreadyOpenUIs[index];
                if (element instanceof (type)) {

                    indexClose = index;
                    break;
                }
            }
            if (indexClose >= 0) {
                let ui = this.alreadyOpenUIs[indexClose];

                this.alreadyOpenUIs.splice(indexClose, 1);
                ui.close();
                ui.destroy();
            }

        }
        /**关闭UI */
        public CloseAllUI() {
            // console.log("关闭所有UI")
            let indexClose = -1;
            for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                const element = this.alreadyOpenUIs[index];
                element.close();
                element.destroy();
            }
            this.alreadyOpenUIs = [];

        }
        /**查找是否存在某个UI 有的返回这个UI,没有就返回空 */
        public GetOpenUI<T extends Laya.Scene>(type: new () => T): T {
            let exist = false;

            for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                const element = this.alreadyOpenUIs[index];
                if (element instanceof (type)) {
                    //console.log("找到了!")
                    return element;

                }
            }
            return null;
        }
        /**保持图片宽高比-不等比缩放保持宽高比 */
        public matchWidthAndHeight(obj: Laya.Sprite) {
            if (!obj) return;

            let y = window.innerHeight / Laya.stage.height;
            let x = window.innerWidth / Laya.stage.width;
            if (y < x) {
                obj.width = (obj.height * y) / x;
            } else {
                obj.height = (obj.width * x) / y;
            }

        }
        /**父物体保持宽高比(不等比缩放条件下),调节物体内部字体大小,避免父物体因为拉伸改变大小导致文字大小超出范围 */
        public matchFontSize(textSize: number): number {
            if (!textSize) return 0;
            let y = window.innerHeight / Laya.stage.height;
            let x = window.innerWidth / Laya.stage.width;
            if (y < x) {
                return textSize *= y;
            } else {
                return textSize *= x;
            }
        }
    }
    /**事件中心 */
    export class EventCenter {
        private static _instance: EventCenter = null;

        constructor() { }
        /**
         * 获取UIManage的单例
        */
        public static get Instance(): EventCenter {
            if (EventCenter._instance == null) {
                EventCenter._instance = new EventCenter();
                EventCenter._instance.Init();
            }
            return EventCenter._instance;
        };

        public Init() {

        }
        /**事件处理句柄 */
        private eventMap: { [key: string]: Laya.Handler[] } = {};

        /**注册事件回调 */
        public regEvent(key: string, callObje: object, callBack: Function) {
            if (!this.eventMap[key]) {
                this.eventMap[key] = [];
            }
            var handler = Laya.Handler.create(callObje, callBack, null, false);
            this.eventMap[key].push(handler);
        }

        /**移除事件回调 */
        public removeEvent(key: string, callObje: object, callBack: Function) {
            if (!this.eventMap[key]) return;
            var needMoveHadler: Laya.Handler = null;
            var needIndex = -1;
            for (let index = 0; index < this.eventMap[key].length; index++) {
                const element = this.eventMap[key][index] as Laya.Handler;

                if (element.caller === callObje && element.method === callBack) {
                    needMoveHadler = element;
                    needIndex = index;

                    break;
                }
            }

            if (needMoveHadler && needIndex >= 0) {

                this.eventMap[key].splice(needIndex, 1);
                needMoveHadler.clear();
                needMoveHadler.recover();

            }

        }
        /**激活事件 */
        public eventAction(key: string, arg: any = null) {
            if (!this.eventMap[key]) return;
            for (let index = this.eventMap[key].length - 1; index >= 0; index--) {
                const element = this.eventMap[key][index] as Laya.Handler;
                element.runWith(arg);
            }
        }
        /**移除某种事件的所有注册事件 */
        public removeAllEventByKey(key: string) {
            if (!this.eventMap[key]) return;
            for (let index = this.eventMap[key].length - 1; index >= 0; index--) {
                const element = this.eventMap[key][index];
                if (element) {
                    element.clear();
                    element.recover();
                }
            }
            this.eventMap[key] = [];
        }
    }
    /**ui帮助类 */
    export class UIHelper {
        /**按钮动效及防连点控制 */
        public static playBtnTouchAction(btn: Laya.Button, cb: Function, originalScale: number = 1, scaleExternal: number = 1, durationScale: number = 1, clickInterval: number = 500) {
            if (btn["_lastClickTime"] && Date.now() - btn["_lastClickTime"] <= clickInterval) {
                return
            }
            btn["_lastClickTime"] = Date.now()
            if (btn) {
                if (btn["_touchTween"]) {
                    btn["_touchTween"].clear()
                    btn["_touchTween"] = null
                }

                btn.scaleX = originalScale
                btn.scaleY = originalScale

                btn["_touchTween"] = Laya.Tween.to(btn, { scaleX: (originalScale * 1.1 * scaleExternal), scaleY: (originalScale * 1.1 * scaleExternal) }, 100 * durationScale, null, Laya.Handler.create(null, function () {
                    btn["_touchTween"] = Laya.Tween.to(btn, { scaleX: originalScale, scaleY: originalScale }, 50 * durationScale, null, Laya.Handler.create(null, function () {
                        btn["_touchTween"] = null

                        if (typeof cb === "function") {
                            cb()
                        }
                    }))
                }))
            }
        }
        /**ui组件放大动效 */
        static playUIScaleAction(ui: Laya.UIComponent, fromScale: number = 0.1, endScale: number = 1, duration: number = 100, cb: Function = null) {

            if (ui) {
                if (ui["_scaleTween"]) {
                    ui["_scaleTween"].clear()
                    ui["_scaleTween"] = null
                }

                ui.scaleX = fromScale
                ui.scaleY = fromScale

                ui["_scaleTween"] = Laya.Tween.to(ui, { scaleX: endScale, scaleY: endScale }, duration, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                    ui["_scaleTween"] = null

                    if (typeof cb === "function" && cb) {
                        cb()
                    }
                }), 0, false, false)
            }
        }
    }
    /**网络请求帮助类 */
    export class NetworkHelper {
        static convertBase64ToBytes(base64Str) {
            var bytes = window.atob(base64Str);
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return ia;
        }
        /**bytes转文件并获得文件地址 */
        static bytesToUrl(bytes) {
            var binaryData = [];
            binaryData.push(bytes);
            let url = window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }))
            return url;
        }
    }
    /**原生Dom帮助类 */
    export class DomHelper {
        /**选择图片返回字节还有dom对象 */
        static selectImg(btnWidth: number, btnHeight: number, btnPositionLeft: number, btnPositionTop: number, loadCb: Function):any {
            var file: any = Laya.Browser.document.createElement("input");
            //设置file样式
            file.style = "filter:alpha(opacity=0);opacity:0;width:" + this.getPxForX(btnWidth) + "px;height:" + this.getPxForY(btnHeight) + "px;";
            file.type = "file";//设置类型是file类型。
            file.accept = "image/jpeg,image/gif,image/png";//设置文件的格式为png；
            file.style.position = "absolute";
            file.style.left = this.getPxForX(btnPositionLeft).toString() + "px";
            file.style.top = this.getPxForY(btnPositionTop).toString() + "px";
            file.style.zIndex = 999;
            Laya.Browser.document.body.appendChild(file);//添加到页面；
            var fileReader: any = new Laya.Browser.window.FileReader();
            file.onchange = function (e: any): void {
                if (file.files.length > 0) {
                    fileReader.readAsDataURL(file.files[0]);
                }
            };
            fileReader.onload = function (evt): void {
                if (Laya.Browser.window.FileReader.DONE == fileReader.readyState) {
                    loadCb(fileReader.result);
                    // Laya.Browser.document.body.removeChild(file);
                }
            };
            return file;
        }
        /**根据坐标数量x方向 获得真实物理像素 */
        static getPxForX(posX: number) {
            let a= posX/Laya.stage.width*Laya.Browser.clientWidth;
           
            return a;
        }
        /**根据坐标数量y方向 获得真实物理像素 */
        static getPxForY(posY: number) {
            let a= posY/Laya.stage.height*Laya.Browser.clientHeight;
           
            return a;
        }
    }

}
