(function () {
    'use strict';

    class WidgetMgr extends Laya.Script {
        constructor() { 
            super(); 
            /** @prop {name:layoutParent, tips:"布局参考对象[parent, stage]", type:Option, option:"parent,stage", default:"parent"}*/
            this.layoutParent = "parent";

            /** @prop {name:isAlignTop, tips:"是否对齐上边", type:Bool, default:false}*/
            this.isAlignTop = false;
            /** @prop {name:top, tips:"本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用", type:Number, default:0}*/
            this.top = 0;

            /** @prop {name:isAlignBottom, tips:"是否对齐下边", type:Bool, default:false}*/
            this.isAlignBottom = false;
            /** @prop {name:bottom, tips:"本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用", type:Number, default:0}*/
            this.bottom = 0;

            /** @prop {name:isAlignLeft, tips:"是否对齐左边", type:Bool, default:false}*/
            this.isAlignLeft = false;
            /** @prop {name:left, tips:"本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用", type:Number, default:0}*/
            this.left = 0;

            /** @prop {name:isAlignRight, tips:"是否对齐右边", type:Bool, default:false}*/
            this.isAlignRight = false;
            /** @prop {name:right, tips:"本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用", type:Number, default:0}*/
            this.right = 0;

            /** @prop {name:isAlignHorizontalCenter, tips:"是否水平方向对齐中点，开启此选项将会忽视水平方向其他对齐选项取消", type:Bool, default:false}*/
            this.isAlignHorizontalCenter = false;
            /** @prop {name:horizontalCenter, tips:"水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用", type:Number, default:0}*/
            this.horizontalCenter = 0;

            /** @prop {name:isAlignVerticalCenter, tips:"是否垂直方向对齐中点，开启此项将会忽视垂直方向其他对齐选项取消", type:Bool, default:false}*/
            this.isAlignVerticalCenter = false;
            /** @prop {name:verticalCenter, tips:"垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用", type:Number, default:0}*/
            this.verticalCenter = 0;

        }
        
        onEnable() {
            // on
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);

            // layout
            this.onLayout();
        }

        onDisable() {
            // off
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);
        }

        onResize() {
            this.onLayout();
        }

        onLayout() {
            let doLayout = function () {
                console.log("Layout ...");

                let _layoutParent = this.getLayoutParent();
                if (!_layoutParent) {
                    return
                }

                if (this.isAlignLeft && this.isAlignRight) {
                    this.owner.width = _layoutParent.width - this.left - this.right;
                }

                if (this.isAlignTop && this.isAlignBottom) {
                    this.owner.height = _layoutParent.height - this.top - this.bottom;
                }

                if (this.isAlignHorizontalCenter) {
                    this.owner.x = _layoutParent.width / 2.0 - this.owner.width + this._getLayoutCenterOffsetX() + this.horizontalCenter;
                }
                else {
                    if (this.isAlignLeft) {
                        this.owner.x = this.left + this._getLayoutCenterOffsetX();
                    }
                    else if (this.isAlignRight) {
                        this.owner.x = _layoutParent.width - this.right - this.owner.width + this._getLayoutCenterOffsetX();
                    }
                }

                if (this.isAlignVerticalCenter) {
                    this.owner.y = _layoutParent.height / 2.0 - this.owner.height + this._getLayoutCenterOffsetY() + this.verticalCenter;
                }
                else {
                    if (this.isAlignTop) {
                        this.owner.y = this.top + this._getLayoutCenterOffsetY();
                    }
                    else if (this.isAlignBottom) {
                        this.owner.y = _layoutParent.height - this.bottom - this.owner.height + this._getLayoutCenterOffsetY();
                    }
                }
            }.bind(this);
        
            // Laya.timer.frameOnce(1, null, doLayout)

            doLayout();
        }

        getLayoutParent() {
            if (this.layoutParent === "parent") {
                return this.owner.parent
            }
            else {
                return Laya.stage
            }
        }

        _getLayoutCenterOffsetX() {
            if (typeof this.owner.pivotX !== "undefined" && !isNaN(this.owner.pivotX)
                && typeof this.owner.anchorX !== "undefined" && !isNaN(this.owner.anchorX)) {
                if (this.owner.pivotX === 0 && this.owner.anchorX === 0) {
                    return 0
                }
                else if (this.owner.pivotX !== 0) {
                    return this.owner.pivotX
                }
                else {
                    return this.owner.width * this.owner.anchorX
                }
            }
            else if (typeof this.owner.pivotX !== "undefined" && !isNaN(this.owner.pivotX)) {
                return this.owner.pivotX
            }
            else {
                return this.owner.width * this.owner.anchorX
            }
        }

        _getLayoutCenterOffsetY() {
            if (typeof this.owner.pivotY !== "undefined" && !isNaN(this.owner.pivotY)
                && typeof this.owner.anchorY !== "undefined" && !isNaN(this.owner.anchorY)) {
                if (this.owner.pivotY === 0 && this.owner.anchorY === 0) {
                    return 0
                }
                else if (this.owner.pivotY !== 0) {
                    return this.owner.pivotY
                }
                else {
                    return this.owner.height * this.owner.anchorY
                }
            }
            else if (typeof this.owner.pivotY !== "undefined" && !isNaN(this.owner.pivotY)) {
                return this.owner.pivotY
            }
            else {
                return this.owner.height * this.owner.anchorY
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("HMFW/WidgetMgr.js", WidgetMgr);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "PhotoAlbumUI.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = false;
    GameConfig.init();

    var HMFWEvent;
    (function (HMFWEvent) {
        HMFWEvent["E_LOGOUT"] = "E_LOGOUT";
        HMFWEvent["E_LOGIN"] = "E_LOGIN";
        HMFWEvent["E_CoveUIVisable"] = "E_CoveUIVisable";
        HMFWEvent["E_CoveUIDisable"] = "E_CoveUIDisable";
    })(HMFWEvent || (HMFWEvent = {}));
    var DataCenterKey;
    (function (DataCenterKey) {
        DataCenterKey["UserData"] = "UserData";
        DataCenterKey["AlbumDatas"] = "AlbumDatas";
        DataCenterKey["PhotoData"] = "PhotoData";
    })(DataCenterKey || (DataCenterKey = {}));

    var HMFW;
    (function (HMFW) {
        class DataBase {
            constructor() {
                this.handlers = [];
            }
            RegChangeEvent(call, func) {
                let handler = Laya.Handler.create(call, func, null, false);
                this.handlers.push(handler);
            }
            RemoveEvent(call, func) {
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
            CallEvent() {
                this.handlers.forEach(element => {
                    element.runWith(this);
                });
            }
        }
        HMFW.DataBase = DataBase;
        class StateBase {
            constructor(myName) {
                this.stateName = myName;
            }
        }
        HMFW.StateBase = StateBase;
        class GameStateBase extends StateBase {
            constructor(myName) {
                super(myName);
            }
            myFsm() {
                return this.fsm;
            }
            EnterState(arg) {
                console.debug("进入游戏状态:" + this.stateName);
            }
            ;
            LeaveState(arg) {
                console.debug("离开游戏状态:" + this.stateName);
            }
            ;
        }
        HMFW.GameStateBase = GameStateBase;
        class FsmBase {
            constructor(ower) {
                this.stateMap = {};
                this.ower = ower;
                FsmManager.Instance.regFsm(this);
            }
            RegState(state) {
                if (!state) {
                    return;
                }
                if (!this.stateMap[state.stateName]) {
                    this.stateMap[state.stateName] = state;
                    state.fsm = this;
                }
            }
            ChangeState(stateName, arg) {
                var stateTemp = this.GetState(stateName);
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
                }
                else {
                    console.log("状态切换失败:" + stateName);
                }
            }
            GetState(stateName) {
                if (!this.stateMap[stateName]) {
                    console.log("没有找到Game状态:" + stateName);
                    return null;
                }
                return this.stateMap[stateName];
            }
            CheckCurrentState(stateName) {
                if (this.currentState && (this.currentState).stateName === stateName) {
                    return true;
                }
                return false;
            }
        }
        HMFW.FsmBase = FsmBase;
        class ModuleBase {
            constructor(name) {
                this.name = name;
                this.OnCreate();
                this.OnRegistMsg();
            }
        }
        HMFW.ModuleBase = ModuleBase;
        class AssetManager {
            constructor() {
                this.assetMap = {};
                this.assetAliasMap = {};
            }
            static get Instance() {
                if (!AssetManager._Instance) {
                    AssetManager._Instance = new AssetManager();
                }
                return AssetManager._Instance;
            }
            setLoadAssetToTeam(teamName, url) {
                if (!this.assetMap[teamName]) {
                    this.assetMap[teamName] = [];
                }
                this.assetMap[teamName].push(url);
            }
            setLoadAssetsArrayToTeam(teamName, urls) {
                if (!this.assetMap[teamName]) {
                    this.assetMap[teamName] = [];
                }
                for (let index = 0; index < urls.length; index++) {
                    const element = urls[index];
                    this.assetMap[teamName].push(element);
                }
            }
            getAssetsTeamArray(teamName) {
                return this.assetMap[teamName];
            }
            setAssetAlias(aliasName, assetsUrl) {
                this.assetAliasMap[aliasName] = assetsUrl;
            }
            setAssetsArrayAlias(aliasName, assetsUrlArray) {
                this.assetAliasMap[aliasName] = assetsUrlArray;
            }
            getAssetUrlFromAlias(assetName) {
                return this.assetAliasMap[assetName];
            }
            getAssetUrlArrayAlias(assetName) {
                return this.assetAliasMap[assetName];
            }
        }
        HMFW.AssetManager = AssetManager;
        class DataCenter {
            constructor() {
                this.DataMap = {};
            }
            static get Instance() {
                if (DataCenter._Instance == null) {
                    DataCenter._Instance = new DataCenter();
                    DataCenter._Instance.Init();
                }
                return DataCenter._Instance;
            }
            Init() {
            }
            regDataType(dataName, type) {
                if (!this.DataMap[dataName]) {
                    this.DataMap[dataName] = new type();
                }
                return this.DataMap[dataName];
            }
            getData(dataName, type) {
                if (!this.DataMap[dataName]) {
                    this.DataMap[dataName] = new type();
                }
                return this.DataMap[dataName];
            }
            removeData(dataName, type) {
                if (!this.DataMap[dataName]) {
                    this.DataMap[dataName] = null;
                }
            }
        }
        HMFW.DataCenter = DataCenter;
        class ModuleManager {
            static Regist(module) {
                ModuleManager.moduleMap[module.name] = module;
            }
            static LoadLocalConfig() {
                for (const key in ModuleManager.moduleMap) {
                    if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                        const element = ModuleManager.moduleMap[key];
                        element.OnLoadLocalConfig.call(element);
                    }
                }
            }
            static LoadDBConfig() {
                for (const key in ModuleManager.moduleMap) {
                    if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                        const element = ModuleManager.moduleMap[key];
                        element.OnLoadDBConfig.call(element);
                    }
                }
            }
            static RegistTimer() {
                for (const key in ModuleManager.moduleMap) {
                    if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                        const element = ModuleManager.moduleMap[key];
                        element.OnRegistTimer.call(element);
                    }
                }
            }
            static Start() {
                ModuleManager.LoadLocalConfig();
                ModuleManager.LoadDBConfig();
                for (const key in ModuleManager.moduleMap) {
                    if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                        const element = ModuleManager.moduleMap[key];
                        element.OnStart.call(element);
                    }
                }
                ModuleManager.RegistTimer();
            }
            static Destroy() {
                for (const key in ModuleManager.moduleMap) {
                    if (ModuleManager.moduleMap.hasOwnProperty(key)) {
                        const element = ModuleManager.moduleMap[key];
                        element.OnDestroy.call(element);
                    }
                }
            }
            static Get(name) {
                try {
                    return ModuleManager.moduleMap[name.toString()];
                }
                catch (ex) {
                }
            }
        }
        ModuleManager.moduleMap = {};
        HMFW.ModuleManager = ModuleManager;
        class FsmManager {
            constructor() {
                this.fsmMap = new Array();
                Laya.timer.loop(1, this, this.onUpdate);
            }
            static get Instance() {
                if (FsmManager._instance == null) {
                    FsmManager._instance = new FsmManager();
                    FsmManager._instance.Init();
                }
                return FsmManager._instance;
            }
            ;
            onUpdate() {
                this.fsmMap.forEach(element => {
                    if (element && element.currentState) {
                        element.currentState.OnUpdate();
                    }
                });
            }
            regFsm(fsm) {
                this.fsmMap.push(fsm);
            }
            removeFsm(fsm) {
                var index = this.fsmMap.indexOf(fsm);
                if (index >= 0) {
                    this.fsmMap.splice(index, 1);
                }
            }
            Init() {
                console.debug("状态机管理器初始化");
            }
        }
        FsmManager._instance = null;
        HMFW.FsmManager = FsmManager;
        class GameStateFsm extends FsmBase {
            constructor() {
                super(null);
            }
            static get Instance() {
                if (!GameStateFsm._instance) {
                    GameStateFsm._instance = new GameStateFsm();
                }
                return GameStateFsm._instance;
            }
            ;
        }
        HMFW.GameStateFsm = GameStateFsm;
        class TipsManager {
            constructor() {
                this.bgRes = "HMFWRES/noteUIBg.png";
                this.tipsShowPanels = [];
                this.tipsArray = [];
                this.panelY = 0;
                this.alreadShowPanel = [];
                this.tipsShowPanels.push(this.createAPanel());
                this.tipsShowPanels.push(this.createAPanel());
                this.tipsShowPanels.push(this.createAPanel());
                this.tipsShowPanels.push(this.createAPanel());
                Laya.timer.frameLoop(1, this, this.startTipsAnim);
            }
            static get Instance() {
                if (TipsManager._instance == null) {
                    TipsManager._instance = new TipsManager();
                }
                return TipsManager._instance;
            }
            ;
            createAPanel() {
                let temp = new Laya.Image(this.bgRes);
                temp.sizeGrid = "26,23,34,34";
                Laya.stage.addChild(temp);
                temp.alpha = 0.8;
                temp.anchorX = 0.5;
                temp.anchorY = 0.5;
                temp.centerX = 0;
                temp.centerY = 0;
                temp.addChild(new Laya.Label()).name = "label";
                let label = temp.getChildByName("label");
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
            showTips(tipstr) {
                if (this.tipsArray.filter(x => x == tipstr).length == 0) {
                    this.tipsArray.push(tipstr);
                }
            }
            startTipsAnim() {
                if (this.tipsArray.length <= 0)
                    return;
                for (let index = 0; index < this.tipsShowPanels.length; index++) {
                    if (this.tipsArray.length <= 0)
                        break;
                    const element = this.tipsShowPanels[index];
                    if (element.visible == false) {
                        let str = this.tipsArray[0];
                        this.tipsArray.splice(0, 1);
                        if (this.alreadShowPanel.length > 0) {
                            for (let index = 0; index < this.alreadShowPanel.length; index++) {
                                const showPanel = this.alreadShowPanel[index];
                                showPanel.centerY -= (showPanel.height + 20);
                            }
                        }
                        let label = element.getChildByName("label");
                        label.text = str;
                        element.width = label.width + 50;
                        element.height = label.height + 30;
                        element.centerX = 0;
                        element.centerY = 0;
                        element.visible = true;
                        Laya.timer.once(2000, this, this.closeAnimPanel, [index], false);
                        this.alreadShowPanel.push(element);
                    }
                }
            }
            closeAnimPanel(arg) {
                let index = arg;
                Laya.Tween.to(this.tipsShowPanels[index], { centerY: this.tipsShowPanels[index].centerY - 100, alpha: 0 }, 300, null, Laya.Handler.create(this, (index) => {
                    this.tipsShowPanels[index].visible = false;
                    this.tipsShowPanels[index].centerY = 0;
                    this.tipsShowPanels[index].alpha = 0.8;
                    let delIndex = this.alreadShowPanel.indexOf(this.tipsShowPanels[index]);
                    if (delIndex > -1) {
                        this.alreadShowPanel.splice(delIndex, 1);
                    }
                }, [index]));
            }
        }
        TipsManager._instance = null;
        HMFW.TipsManager = TipsManager;
        class UIManage {
            constructor() {
                this.alreadyOpenUIs = [];
            }
            static get Instance() {
                if (UIManage._instance == null) {
                    UIManage._instance = new UIManage();
                    UIManage._instance.Init();
                }
                return UIManage._instance;
            }
            ;
            Init() {
            }
            OpenUI(type, arg, bIn3D = false, lockZOrder = 0) {
                let ui = null;
                let maxZOrder = 0;
                for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                    const element = this.alreadyOpenUIs[index];
                    if (element instanceof (type)) {
                        this.CloseUI(type);
                    }
                    else {
                        if (element["lockZOrder"] == undefined && element.zOrder > maxZOrder) {
                            maxZOrder = element.zOrder;
                        }
                    }
                }
                if (ui === null) {
                    ui = new type();
                }
                if (lockZOrder > 0) {
                    ui.zOrder = lockZOrder;
                    ui["lockZOrder"] = lockZOrder;
                }
                else {
                    ui.zOrder = maxZOrder + 1;
                }
                ui.open(false, arg);
                if (bIn3D) {
                    Laya.stage.addChild(ui);
                }
                this.alreadyOpenUIs.push(ui);
                return ui;
            }
            CloseUI(type) {
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
            CloseAllUI() {
                let indexClose = -1;
                for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                    const element = this.alreadyOpenUIs[index];
                    element.close();
                    element.destroy();
                }
                this.alreadyOpenUIs = [];
            }
            GetOpenUI(type) {
                let exist = false;
                for (let index = 0; index < this.alreadyOpenUIs.length; index++) {
                    const element = this.alreadyOpenUIs[index];
                    if (element instanceof (type)) {
                        return element;
                    }
                }
                return null;
            }
            matchWidthAndHeight(obj) {
                if (!obj)
                    return;
                let y = window.innerHeight / Laya.stage.height;
                let x = window.innerWidth / Laya.stage.width;
                if (y < x) {
                    obj.width = (obj.height * y) / x;
                }
                else {
                    obj.height = (obj.width * x) / y;
                }
            }
            matchFontSize(textSize) {
                if (!textSize)
                    return 0;
                let y = window.innerHeight / Laya.stage.height;
                let x = window.innerWidth / Laya.stage.width;
                if (y < x) {
                    return textSize *= y;
                }
                else {
                    return textSize *= x;
                }
            }
        }
        UIManage._instance = null;
        HMFW.UIManage = UIManage;
        class EventCenter {
            constructor() {
                this.eventMap = {};
            }
            static get Instance() {
                if (EventCenter._instance == null) {
                    EventCenter._instance = new EventCenter();
                    EventCenter._instance.Init();
                }
                return EventCenter._instance;
            }
            ;
            Init() {
            }
            regEvent(key, callObje, callBack) {
                if (!this.eventMap[key]) {
                    this.eventMap[key] = [];
                }
                var handler = Laya.Handler.create(callObje, callBack, null, false);
                this.eventMap[key].push(handler);
            }
            removeEvent(key, callObje, callBack) {
                if (!this.eventMap[key])
                    return;
                var needMoveHadler = null;
                var needIndex = -1;
                for (let index = 0; index < this.eventMap[key].length; index++) {
                    const element = this.eventMap[key][index];
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
            eventAction(key, arg = null) {
                if (!this.eventMap[key])
                    return;
                for (let index = this.eventMap[key].length - 1; index >= 0; index--) {
                    const element = this.eventMap[key][index];
                    element.runWith(arg);
                }
            }
            removeAllEventByKey(key) {
                if (!this.eventMap[key])
                    return;
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
        EventCenter._instance = null;
        HMFW.EventCenter = EventCenter;
        class UIHelper {
            static playBtnTouchAction(btn, cb, originalScale = 1, scaleExternal = 1, durationScale = 1, clickInterval = 500) {
                if (btn["_lastClickTime"] && Date.now() - btn["_lastClickTime"] <= clickInterval) {
                    return;
                }
                btn["_lastClickTime"] = Date.now();
                if (btn) {
                    if (btn["_touchTween"]) {
                        btn["_touchTween"].clear();
                        btn["_touchTween"] = null;
                    }
                    btn.scaleX = originalScale;
                    btn.scaleY = originalScale;
                    btn["_touchTween"] = Laya.Tween.to(btn, { scaleX: (originalScale * 1.1 * scaleExternal), scaleY: (originalScale * 1.1 * scaleExternal) }, 100 * durationScale, null, Laya.Handler.create(null, function () {
                        btn["_touchTween"] = Laya.Tween.to(btn, { scaleX: originalScale, scaleY: originalScale }, 50 * durationScale, null, Laya.Handler.create(null, function () {
                            btn["_touchTween"] = null;
                            if (typeof cb === "function") {
                                cb();
                            }
                        }));
                    }));
                }
            }
            static playUIScaleAction(ui, fromScale = 0.1, endScale = 1, duration = 100, cb = null) {
                if (ui) {
                    if (ui["_scaleTween"]) {
                        ui["_scaleTween"].clear();
                        ui["_scaleTween"] = null;
                    }
                    ui.scaleX = fromScale;
                    ui.scaleY = fromScale;
                    ui["_scaleTween"] = Laya.Tween.to(ui, { scaleX: endScale, scaleY: endScale }, duration, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                        ui["_scaleTween"] = null;
                        if (typeof cb === "function" && cb) {
                            cb();
                        }
                    }), 0, false, false);
                }
            }
        }
        HMFW.UIHelper = UIHelper;
        class NetworkHelper {
            static convertBase64ToBytes(base64Str) {
                var bytes = window.atob(base64Str);
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                return ia;
            }
            static bytesToUrl(bytes) {
                var binaryData = [];
                binaryData.push(bytes);
                let url = window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }));
                return url;
            }
        }
        HMFW.NetworkHelper = NetworkHelper;
        class DomHelper {
            static selectImg(btnWidth, btnHeight, btnPositionLeft, btnPositionTop, loadCb) {
                var file = Laya.Browser.document.createElement("input");
                file.style = "filter:alpha(opacity=0);opacity:0;width:" + this.getPxForX(btnWidth) + "px;height:" + this.getPxForY(btnHeight) + "px;";
                file.type = "file";
                file.accept = "image/jpeg,image/gif,image/png";
                file.style.position = "absolute";
                file.style.left = this.getPxForX(btnPositionLeft).toString() + "px";
                file.style.top = this.getPxForY(btnPositionTop).toString() + "px";
                file.style.zIndex = 999;
                Laya.Browser.document.body.appendChild(file);
                var fileReader = new Laya.Browser.window.FileReader();
                file.onchange = function (e) {
                    if (file.files.length > 0) {
                        fileReader.readAsDataURL(file.files[0]);
                    }
                };
                fileReader.onload = function (evt) {
                    if (Laya.Browser.window.FileReader.DONE == fileReader.readyState) {
                        loadCb(fileReader.result);
                    }
                };
                return file;
            }
            static getPxForX(posX) {
                let a = posX / Laya.stage.width * Laya.Browser.clientWidth;
                return a;
            }
            static getPxForY(posY) {
                let a = posY / Laya.stage.height * Laya.Browser.clientHeight;
                return a;
            }
        }
        HMFW.DomHelper = DomHelper;
    })(HMFW || (HMFW = {}));

    class AlbumDatas extends HMFW.DataBase {
        constructor() {
            super();
            this.datas = [];
        }
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
        setOneData(alibumId, data) {
            let info = this.getAlbumInfo(alibumId);
            if (info) {
                info.setData(data);
            }
            else {
                info = new AlbumInfo();
                info.setData(data);
                this.datas.push(info);
            }
        }
        getAlbumInfo(albumId) {
            let albumInfoIndex = this.datas.findIndex(x => { return x.photoAlbumId == albumId; });
            if (albumInfoIndex >= 0) {
                return this.datas[albumInfoIndex];
            }
            return null;
        }
    }
    class AlbumInfo {
        constructor() {
            this.photoAlbumId = -1;
            this.albumName = "";
            this.creatTime = "";
            this.createrUser = "";
            this.lastPhotoTime = "";
            this.photoIds = [];
        }
        setData(dataInfo) {
            this.photoAlbumId = dataInfo.photoAlbumId;
            this.albumName = dataInfo.albumName;
            this.creatTime = dataInfo.creatTime;
            this.createrUser = dataInfo.createrUser;
            this.lastPhotoTime = dataInfo.lastPhotoTime;
            this.photoIds = dataInfo.photoIds;
        }
    }

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class CoverUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(CoverUIUI.uiView);
            }
        }
        CoverUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "mouseThrough": true, "mouseEnabled": true, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "layoutParent": "stage", "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "bottom": 0, "runtime": "HMFW/WidgetMgr.js" }, "compId": 3 }, { "type": "Box", "props": { "var": "bgBox", "top": 0, "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0, "bgColor": "#f3ebea" }, "compId": 4 }, { "type": "Image", "props": { "zOrder": 1000, "width": 150, "var": "controlImg", "top": 0, "skin": "AppRes/moveControlP.png", "right": 0, "height": 150, "alpha": 0.5 }, "compId": 6 }], "loadList": ["AppRes/moveControlP.png"], "loadList3D": [] };
        ui.CoverUIUI = CoverUIUI;
        REG("ui.CoverUIUI", CoverUIUI);
        class LoginUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(LoginUIUI.uiView);
            }
        }
        LoginUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "runtime": "HMFW/WidgetMgr.js" }, "compId": 3 }, { "type": "Box", "props": { "top": 0, "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0, "bgColor": "#0b0b0b", "alpha": 0.5 }, "compId": 11 }, { "type": "Box", "props": { "width": 650, "var": "loginBox", "scaleY": 1, "scaleX": 1, "mouseThrough": true, "mouseEnabled": true, "height": 560, "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Image", "props": { "top": 0, "skin": "AppRes/qd5.png", "sizeGrid": "18,12,21,12", "right": 0, "left": 0, "bottom": 0 }, "compId": 5, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 6, "text": "登 录", "strokeColor": "#f9fdfd", "fontSize": 60, "font": "SimHei", "color": "#080808", "centerX": 0, "bold": false, "align": "center" }, "compId": 6 }, { "type": "TextInput", "props": { "width": 400, "var": "userNameInput", "valign": "middle", "skin": "AppRes/yx4.png", "sizeGrid": "12,8,8,8", "promptColor": "#403f3f", "prompt": "请输入用户名", "maxChars": 20, "height": 100, "fontSize": 50, "font": "Microsoft YaHei", "centerY": -110, "centerX": 0, "bold": false, "align": "center" }, "compId": 9 }, { "type": "TextInput", "props": { "width": 400, "var": "passwordInput", "valign": "middle", "skin": "AppRes/yx4.png", "sizeGrid": "12,8,8,8", "promptColor": "#404040", "prompt": "请输入密码", "maxChars": 20, "height": 100, "fontSize": 50, "font": "Microsoft YaHei", "centerY": 18, "centerX": 0, "bold": false, "align": "center" }, "compId": 8 }, { "type": "Button", "props": { "width": 300, "var": "loginBtn", "stateNum": 1, "skin": "AppRes/share_btn.png", "labelStrokeColor": "#353538", "labelSize": 50, "labelFont": "Microsoft YaHei", "labelColors": "#353538,#353538,#353538", "labelBold": true, "labelAlign": "center", "label": "登 录", "height": 100, "centerX": 0, "bottom": 72, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }] }] }], "loadList": ["AppRes/qd5.png", "AppRes/yx4.png", "AppRes/share_btn.png"], "loadList3D": [] };
        ui.LoginUIUI = LoginUIUI;
        REG("ui.LoginUIUI", LoginUIUI);
        class PhotoAlbumUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(PhotoAlbumUIUI.uiView);
            }
        }
        PhotoAlbumUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "runtime": "HMFW/WidgetMgr.js" }, "compId": 3 }, { "type": "Box", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "bgColor": "#eae4e4" }, "compId": 12, "child": [{ "type": "List", "props": { "var": "albumList", "top": 150, "spaceY": 20, "spaceX": 10, "selectEnable": true, "right": 0, "left": 10, "elasticEnabled": true, "bottom": 300 }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 20, "x": 10, "width": 340, "skin": "AppRes/qd5.png", "renderType": "render", "name": "render", "height": 400 }, "compId": 5, "child": [{ "type": "Image", "props": { "y": 87, "width": 150, "skin": "AppRes/PhotoAlbum.png", "name": "mainImg", "height": 150, "centerX": 0 }, "compId": 6 }, { "type": "Label", "props": { "y": 19, "x": 9, "width": 316, "valign": "middle", "text": "相册", "strokeColor": "#060606", "name": "albumNameLabel", "height": 38, "fontSize": 45, "font": "Microsoft YaHei", "color": "#090a0a", "align": "center" }, "compId": 7 }, { "type": "Label", "props": { "y": 250, "x": 12, "width": 313, "valign": "middle", "text": "113张", "strokeColor": "#201355", "stroke": 0, "name": "countLabel", "height": 29, "fontSize": 25, "color": "#393737", "align": "center" }, "compId": 8 }, { "type": "Label", "props": { "y": 294, "x": 13, "width": 314, "valign": "middle", "text": "时光机器", "strokeColor": "#24315d", "stroke": 0, "name": "createrUserLabel", "height": 31, "fontSize": 25, "font": "Microsoft YaHei", "color": "#060606", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 337, "x": 14, "width": 314, "valign": "middle", "text": "2020/02/08", "strokeColor": "#24315d", "stroke": 0, "name": "lastPhotoTimeLabel", "height": 31, "fontSize": 25, "font": "Microsoft YaHei", "color": "#393737", "align": "center" }, "compId": 11 }] }] }, { "type": "Button", "props": { "width": 189, "var": "createAlbumBtn", "stateNum": 1, "skin": "AppRes/tjbj2.png", "pivotY": 37, "pivotX": 95, "labelStrokeColor": "#0e114e", "labelStroke": 3, "labelSize": 40, "labelFont": "SimSun", "labelColors": "#ffffff,#ffffff,#888888", "label": "新相册", "height": 74, "centerX": -124, "bottom": 100 }, "compId": 14 }, { "type": "Button", "props": { "width": 189, "var": "refreshBtn", "stateNum": 1, "skin": "AppRes/tjbj2.png", "pivotY": 37, "pivotX": 95, "labelStrokeColor": "#0e114e", "labelStroke": 3, "labelSize": 40, "labelFont": "SimSun", "labelColors": "#ffffff,#ffffff,#888888", "label": "刷新", "height": 74, "centerX": 193, "bottom": 100 }, "compId": 16 }, { "type": "Label", "props": { "y": 55, "x": 390, "valign": "middle", "text": "我们的相册", "fontSize": 60, "font": "SimHei", "color": "#050404", "align": "center" }, "compId": 24 }] }, { "type": "Box", "props": { "var": "creatAlbumBox", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 17, "child": [{ "type": "Image", "props": { "top": 0, "skin": "AppRes/mask.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 19 }, { "type": "Image", "props": { "width": 500, "skin": "AppRes/qd5.png", "sizeGrid": "12,15,24,14", "height": 400, "centerY": 0, "centerX": 0 }, "compId": 18, "child": [{ "type": "Label", "props": { "y": 12, "x": 137.5, "text": "创建新相册", "strokeColor": "#507ef6", "stroke": 0, "fontSize": 45, "font": "SimSun", "color": "#0b0b0b" }, "compId": 20 }, { "type": "TextInput", "props": { "y": 127, "x": 66.5, "width": 367, "var": "createAlbumInput", "valign": "middle", "skin": "AppRes/yx4.png", "sizeGrid": "8,7,10,6", "promptColor": "#232222", "prompt": "输入新相册的名字", "maxChars": 10, "height": 86, "fontSize": 40, "font": "SimSun", "align": "center" }, "compId": 21 }, { "type": "Button", "props": { "y": 265, "x": 157, "width": 183, "var": "sureCreateBtn", "stateNum": 1, "skin": "AppRes/share_btn.png", "labelSize": 40, "labelFont": "SimSun", "label": "创建", "height": 74 }, "compId": 22 }, { "type": "Button", "props": { "y": 9.5, "x": 437.5, "var": "closeCreateAlbumBtn", "stateNum": 1, "skin": "AppRes/insert_ad_close_btn.png" }, "compId": 23 }] }] }], "loadList": ["AppRes/qd5.png", "AppRes/PhotoAlbum.png", "AppRes/tjbj2.png", "AppRes/mask.png", "AppRes/yx4.png", "AppRes/share_btn.png", "AppRes/insert_ad_close_btn.png"], "loadList3D": [] };
        ui.PhotoAlbumUIUI = PhotoAlbumUIUI;
        REG("ui.PhotoAlbumUIUI", PhotoAlbumUIUI);
        class PhotoImgUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(PhotoImgUIUI.uiView);
            }
        }
        PhotoImgUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "mouseThrough": false, "mouseEnabled": true, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "runtime": "HMFW/WidgetMgr.js" }, "compId": 3 }, { "type": "Box", "props": { "top": 0, "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0, "bgColor": "#080808" }, "compId": 5 }, { "type": "Image", "props": { "width": 100, "var": "mainImg", "skin": "AppRes/photoBg.png", "height": 100, "centerY": 0, "centerX": 0 }, "compId": 4 }], "loadList": ["AppRes/photoBg.png"], "loadList3D": [] };
        ui.PhotoImgUIUI = PhotoImgUIUI;
        REG("ui.PhotoImgUIUI", PhotoImgUIUI);
        class PhotoListUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(PhotoListUIUI.uiView);
            }
        }
        PhotoListUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "runtime": "HMFW/WidgetMgr.js" }, "compId": 4 }, { "type": "Box", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "bgColor": "#dbd5d5" }, "compId": 5, "child": [{ "type": "Label", "props": { "y": 25, "width": 618, "var": "albumNameLabel", "valign": "middle", "text": "相册名字", "strokeColor": "#21678e", "height": 63, "fontSize": 60, "font": "SimSun", "color": "#0e0e0f", "centerX": 0, "bold": true, "align": "center" }, "compId": 17 }, { "type": "Label", "props": { "y": 25, "width": 212, "var": "albumCountLabel", "valign": "middle", "text": "34张", "strokeColor": "#21678e", "height": 63, "fontSize": 50, "font": "SimSun", "color": "#666161", "centerX": 412, "bold": true, "align": "center" }, "compId": 18 }, { "type": "List", "props": { "var": "photoList", "top": 100, "spaceY": 30, "spaceX": 15, "right": 20, "left": 20, "bottom": 200 }, "compId": 7, "child": [{ "type": "Image", "props": { "width": 330, "skin": "AppRes/mask.png", "sizeGrid": "16,18,26,17", "renderType": "render", "name": "render", "height": 500 }, "compId": 8, "child": [{ "type": "Image", "props": { "top": 5, "skin": "AppRes/mask.png", "sizeGrid": "8,6,7,8", "right": 5, "name": "photoImg", "left": 5, "height": 320 }, "compId": 9 }, { "type": "Label", "props": { "y": 334, "wordWrap": true, "width": 345, "valign": "middle", "text": "照片名字", "strokeColor": "#2e334c", "stroke": 0, "overflow": "hidden", "name": "nameLabel", "height": 102, "fontSize": 40, "font": "SimHei", "color": "#0d0c0c", "centerX": 0, "bold": false, "align": "center" }, "compId": 10 }, { "type": "Label", "props": { "y": 447, "width": 348, "valign": "middle", "text": "2021/03/03", "strokeColor": "#2e334c", "stroke": 0, "overflow": "hidden", "name": "timeLabel", "italic": true, "height": 36, "fontSize": 35, "font": "SimSun", "color": "#3b3c3d", "centerX": -1, "bold": false, "align": "center" }, "compId": 11 }] }] }, { "type": "Button", "props": { "y": 65, "x": 0, "width": 200, "var": "closeBtn", "stateNum": 1, "skin": "AppRes/tj1.png", "pivotY": 65, "height": 130 }, "compId": 12 }, { "type": "Button", "props": { "width": 200, "var": "uploadBtn", "stateNum": 1, "skin": "AppRes/upload.png", "height": 200, "centerX": 0, "bottom": 100 }, "compId": 19 }] }, { "type": "Box", "props": { "var": "uploadBox", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "top": 0, "skin": "AppRes/mask.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 }, "compId": 21 }, { "type": "Image", "props": { "width": 600, "skin": "AppRes/qd5.png", "sizeGrid": "15,15,27,14", "height": 700, "centerY": -100, "centerX": 0 }, "compId": 22, "child": [{ "type": "Label", "props": { "y": 25, "x": 0, "width": 618, "valign": "middle", "text": "上传照片", "strokeColor": "#21678e", "stroke": 3, "height": 63, "fontSize": 50, "font": "SimSun", "color": "#48bcfd", "centerX": 0, "bold": true, "align": "center" }, "compId": 24 }, { "type": "Image", "props": { "y": 110, "width": 300, "var": "uploadImg", "skin": "AppRes/photoBg.png", "height": 300, "centerX": 0 }, "compId": 25 }, { "type": "TextInput", "props": { "y": 439, "x": 116.5, "width": 367, "var": "uploadNameLabel", "valign": "middle", "skin": "AppRes/yx4.png", "sizeGrid": "8,7,10,6", "promptColor": "#dbd1d1", "prompt": "输入照片的名字", "maxChars": 10, "height": 65, "fontSize": 40, "font": "SimSun", "align": "center" }, "compId": 32 }, { "type": "Button", "props": { "y": -16.5, "x": 536, "width": 82, "var": "closeUploadBtn", "stateNum": 1, "skin": "AppRes/insert_ad_close_btn.png", "height": 83 }, "compId": 31 }, { "type": "Button", "props": { "y": 557, "x": 205, "width": 188, "var": "sureUploadBtn", "stateNum": 1, "skin": "AppRes/share_btn.png", "labelStrokeColor": "#21678e", "labelStroke": 3, "labelSize": 30, "labelFont": "SimSun", "labelColors": "#48bcfd", "label": "上 传", "height": 80 }, "compId": 30 }] }] }], "loadList": ["AppRes/mask.png", "AppRes/tj1.png", "AppRes/upload.png", "AppRes/qd5.png", "AppRes/photoBg.png", "AppRes/yx4.png", "AppRes/insert_ad_close_btn.png", "AppRes/share_btn.png"], "loadList3D": [] };
        ui.PhotoListUIUI = PhotoListUIUI;
        REG("ui.PhotoListUIUI", PhotoListUIUI);
        class WaitNetUIUI extends Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(WaitNetUIUI.uiView);
            }
        }
        WaitNetUIUI.uiView = { "type": "Scene", "props": { "width": 1080, "mouseEnabled": true, "height": 1920 }, "compId": 2, "child": [{ "type": "Script", "props": { "isAlignTop": true, "isAlignRight": true, "isAlignLeft": true, "isAlignBottom": true, "runtime": "HMFW/WidgetMgr.js" }, "compId": 3 }, { "type": "Box", "props": { "top": 0, "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0, "bgColor": "#505055", "alpha": 0.8 }, "compId": 4 }, { "type": "Image", "props": { "y": 960, "x": 540, "width": 150, "var": "waitImg", "skin": "AppRes/waitNet.png", "rotation": 359, "mouseEnabled": false, "height": 150, "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }], "loadList": ["AppRes/waitNet.png"], "loadList3D": [] };
        ui.WaitNetUIUI = WaitNetUIUI;
        REG("ui.WaitNetUIUI", WaitNetUIUI);
    })(ui || (ui = {}));

    class WaitNetUI extends ui.WaitNetUIUI {
        constructor() {
            super();
        }
        onAwake() {
            this.frameLoop(1, this, () => {
                this.waitImg.rotation += 6;
            });
        }
    }

    class UserData extends HMFW.DataBase {
        constructor() {
            super();
        }
    }

    class NetworkManager {
        static get BaseUrl() {
            return "http://47.98.55.138:8080/api/";
        }
        static uploadPhoto(PhotoAlbumId, name, base64Str, suc, fail) {
            HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
            this.PostSever(this.BaseUrl + "Photo/UploadPhoto", NetContentType.jsonType, { "PhotoAlbumId": PhotoAlbumId, "Name": name, "File": base64Str }, (data) => {
                let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
                albumDatas.setOneData(data.photoAlbumId, data);
                if (suc) {
                    suc(data);
                }
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            }, (mes) => {
                if (fail) {
                    fail(mes);
                }
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
            }, true);
        }
        static requestPhoto(photoId, big, suc) {
            this.PostSever(this.BaseUrl + "Photo/GetPhoto", NetContentType.jsonType, { "PhotoId": photoId, "BeBig": big }, (data) => {
                if (suc) {
                    suc(data);
                }
            }, null, true);
        }
        static requestNewAlbum(newAlbumName, suc, fail) {
            HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
            this.PostSever(this.BaseUrl + "Photo/CreatPhotoAlbum", NetContentType.jsonType, { "Name": newAlbumName }, (data) => {
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
                let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
                albumDatas.setNewAllDatas(data);
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
        static requestAllAlbums(suc = null, fail = null) {
            HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
            this.PostSever(this.BaseUrl + "Photo/GetPhotoAlbums", NetContentType.jsonType, null, (data) => {
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
                let albumDatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
                albumDatas.setNewAllDatas(data);
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
        static loginRequest(userName, password, suc) {
            HMFW.UIManage.Instance.OpenUI(WaitNetUI, null, false, 999);
            this.PostSever(this.BaseUrl + "login", NetContentType.jsonType, { userName: userName, password: password }, (data) => {
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
                if (suc) {
                    suc(data);
                }
            }, (mes) => {
                HMFW.UIManage.Instance.CloseUI(WaitNetUI);
                HMFW.TipsManager.Instance.showTips(mes);
            }, false);
        }
        static PostSever(url, type, data, sucessCb, failCb, needToken = true, responseType = "json") {
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
                                }
                                else {
                                    sucessCb();
                                }
                            }
                            else {
                                sucessCb(oReq.response);
                            }
                        }
                    }
                    else if (oReq.status === 400) {
                        if (failCb) {
                            if (oReq.responseType == "json" || oReq.responseType == "") {
                                var res = JSON.parse(oReq.responseText);
                                if (res && res.message) {
                                    HMFW.TipsManager.Instance.showTips(res.message);
                                    failCb(res.message);
                                }
                            }
                            else {
                                HMFW.TipsManager.Instance.showTips("错误的请求");
                                failCb("错误的请求");
                            }
                        }
                    }
                    else if (oReq.status === 401) {
                        HMFW.TipsManager.Instance.showTips("未登录或者登录过期");
                        if (failCb) {
                            failCb("未登录或者登录过期");
                        }
                        HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_LOGOUT);
                    }
                    else {
                        HMFW.TipsManager.Instance.showTips("请求错误,状态码:" + oReq.status);
                        if (failCb) {
                            failCb("请求错误,状态码:" + oReq.status);
                        }
                    }
                }
            };
            oReq.setRequestHeader("Content-type", type);
            if (needToken) {
                let userData = HMFW.DataCenter.Instance.getData(DataCenterKey.UserData, UserData);
                if (userData && userData.token) {
                    oReq.setRequestHeader("Authorization", "Bearer " + userData.token);
                }
            }
            if (data) {
                oReq.send(JSON.stringify(data));
            }
            else {
                oReq.send();
            }
        }
    }
    var NetContentType;
    (function (NetContentType) {
        NetContentType["jsonType"] = "application/json";
        NetContentType["fileType"] = "multipart/form-data";
    })(NetContentType || (NetContentType = {}));

    class PhotoData extends HMFW.DataBase {
        constructor() {
            super();
            this.smallPhotoMap = new Map();
            this.bigDataMap = new Map();
            this.photoInfoMap = new Map();
        }
        getSmallPhotoInfoAndUrl(photoId, callBack) {
            if (this.smallPhotoMap.has(photoId)) {
                callBack(this.photoInfoMap.get(photoId), this.smallPhotoMap.get(photoId));
            }
            else {
                NetworkManager.requestPhoto(photoId, false, (data) => {
                    let photoInfo = new PhotoInfo();
                    photoInfo.setData(data);
                    this.photoInfoMap.set(photoId, photoInfo);
                    let array = HMFW.NetworkHelper.convertBase64ToBytes(data.photoData);
                    let url = HMFW.NetworkHelper.bytesToUrl(array);
                    this.smallPhotoMap.set(photoId, url);
                    callBack(photoInfo, this.smallPhotoMap.get(photoId));
                });
            }
        }
        getBigPhotoInfoAndUrl(photoId, callBack) {
            if (this.bigDataMap.has(photoId)) {
                callBack(this.photoInfoMap.get(photoId), this.bigDataMap.get(photoId));
            }
            else {
                NetworkManager.requestPhoto(photoId, true, (data) => {
                    let photoInfo = new PhotoInfo();
                    photoInfo.setData(data);
                    this.photoInfoMap.set(photoId, photoInfo);
                    let array = HMFW.NetworkHelper.convertBase64ToBytes(data.photoData);
                    let url = HMFW.NetworkHelper.bytesToUrl(array);
                    this.bigDataMap.set(photoId, url);
                    callBack(photoInfo, this.bigDataMap.get(photoId));
                });
            }
        }
    }
    class PhotoInfo {
        constructor() {
            this.photoId = -1;
            this.photoName = "";
            this.creatTime = "";
            this.photoUserName = "";
        }
        ;
        setData(data) {
            this.photoId = data.photoId;
            this.photoName = data.photoName;
            this.creatTime = data.creatTime;
            this.photoUserName = data.photoUserName;
        }
    }

    class LibEdit {
        static Edit() {
            if (Laya.List) {
                Object.defineProperty(Laya.List.prototype, "selectedIndex", {
                    get: function () {
                        return this._selectedIndex;
                    },
                    set: function (value) {
                        this._selectedIndex = value;
                        this.changeSelectStatus();
                        this.event(Laya.Event.CHANGE);
                        this.selectHandler && this.selectHandler.runWith(value);
                        this.startIndex = this._startIndex;
                    }
                });
            }
        }
    }

    class LoginUI extends ui.LoginUIUI {
        onAwake() {
            this.loginBtn.clickHandler = Laya.Handler.create(this, this.onLoginBtn, null, false);
            let localUserName = Laya.LocalStorage.getItem("LocalUserName");
            if (localUserName && localUserName.length > 0) {
                this.userNameInput.text = localUserName;
            }
        }
        onEnable() {
            HMFW.UIHelper.playUIScaleAction(this.loginBox);
        }
        onLoginBtn() {
            HMFW.UIHelper.playBtnTouchAction(this.loginBtn, () => {
                if (this.userNameInput.text.length <= 0 || this.passwordInput.text.length <= 0) {
                    HMFW.TipsManager.Instance.showTips("请输入用户名和密码");
                    return;
                }
                Laya.LocalStorage.setItem("LocalUserName", this.userNameInput.text);
                NetworkManager.loginRequest(this.userNameInput.text, this.passwordInput.text, (data) => {
                    let userData = HMFW.DataCenter.Instance.getData(DataCenterKey.UserData, UserData);
                    userData.userId = data.userInfo.userId;
                    userData.username = data.userInfo.username;
                    userData.nickName = data.userInfo.nickName;
                    userData.token = data.token;
                    userData.CallEvent();
                    HMFW.GameStateFsm.Instance.ChangeState("LoginedState");
                });
            });
        }
    }

    class PhotoImgUI extends ui.PhotoImgUIUI {
        constructor() {
            super();
            this.mainImgStartPoint = new Laya.Point();
            this.clickTimes = 0;
            this.mouseDownFrame = 0;
            this.clickFrame = 0;
            this.beDraging = false;
            this.mouseStartPoint = new Laya.Point();
        }
        onAwake() {
            this.dataCenter = HMFW.DataCenter.Instance.getData(DataCenterKey.PhotoData, PhotoData);
            this.regevent();
            this.timerOnce(300, this, () => {
                this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
                this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
                this.frameLoop(1, this, this.onUpdate, null, false);
            });
        }
        onOpened(photoId) {
            this.photoId = photoId;
            this.dataCenter.getSmallPhotoInfoAndUrl(this.photoId, (photoinfo, url) => {
                this.mainImg.skin = url;
                if (Laya.stage.width >= Laya.stage.height) {
                    this.mainImg.width = Laya.stage.height;
                    this.mainImg.height = Laya.stage.height;
                }
                else {
                    this.mainImg.width = Laya.stage.width;
                    this.mainImg.height = Laya.stage.width;
                }
            });
            this.dataCenter.getBigPhotoInfoAndUrl(this.photoId, (photoinfo, url) => {
                let img = new Image();
                img.src = url;
                img.onload = () => {
                    this.bigPhotoMaxWidth = img.width * Laya.Browser.pixelRatio;
                    this.bigPhotoMaxHeight = img.height * Laya.Browser.pixelRatio;
                    this.mainImg.skin = url;
                    let stageRate = Laya.stage.width / Laya.stage.height;
                    this.bigPhotoRate = this.bigPhotoMaxWidth / this.bigPhotoMaxHeight;
                    if (this.bigPhotoRate >= stageRate) {
                        this.bigPhotoMinWidth = Laya.stage.width;
                        this.bigPhotoMinHeight = Laya.stage.width / this.bigPhotoRate;
                    }
                    else {
                        this.bigPhotoMinWidth = Laya.stage.height * this.bigPhotoRate;
                        this.bigPhotoMinHeight = Laya.stage.height;
                    }
                    this.mainImg.width = this.bigPhotoMinWidth;
                    this.mainImg.height = this.bigPhotoMinHeight;
                };
            });
        }
        onMouseDown(e) {
            var touches = e.touches;
            if (touches && touches.length == 1) {
                console.log("单指按下");
                this.mouseStartPoint.x = Laya.MouseManager.instance.mouseX;
                this.mouseStartPoint.y = Laya.MouseManager.instance.mouseY;
                this.mouseDownFrame = Laya.timer.currFrame;
                this.mainImgStartPoint.x = this.mainImg.x;
                this.mainImgStartPoint.y = this.mainImg.y;
                this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            }
            else if (touches && touches.length == 2) {
            }
        }
        onMouseMove(e) {
            var touches = e.touches;
            if (touches && touches.length == 1) {
                let dx = Laya.MouseManager.instance.mouseX - this.mouseStartPoint.x;
                let dy = Laya.MouseManager.instance.mouseY - this.mouseStartPoint.y;
                this.mainImg.x = this.mainImgStartPoint.x + dx;
                this.mainImg.y = this.mainImgStartPoint.y + dy;
            }
        }
        onMouseUp(e) {
            var touches = e.touches;
            this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            if (touches && touches.length == 1) {
                console.log("多指释放,还剩1个");
            }
            else if (touches && touches.length == 2) {
                console.log("多指释放,还剩2个");
            }
            else {
                console.log("释放还剩0个");
                let dx = Laya.MouseManager.instance.mouseX - this.mouseStartPoint.x;
                let dy = Laya.MouseManager.instance.mouseY - this.mouseStartPoint.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 20 && Laya.timer.currFrame - this.mouseDownFrame <= 20) {
                    console.log("Click");
                    this.clickTimes++;
                    if (this.clickTimes == 1) {
                        this.clickFrame = Laya.timer.currFrame;
                    }
                    else if (this.clickTimes >= 2) {
                        console.log("DoubleClick");
                        this.clickTimes = 0;
                        this.sizeChange();
                    }
                }
            }
        }
        sizeChange() {
            if (Math.abs(this.mainImg.width - this.bigPhotoMinWidth) <= 10 && Math.abs(this.mainImg.height - this.bigPhotoMinHeight) <= 10) {
                this.mainImg.width = this.bigPhotoMaxWidth;
                this.mainImg.height = this.bigPhotoMaxHeight;
            }
            else {
                this.mainImg.width = this.bigPhotoMinWidth;
                this.mainImg.height = this.bigPhotoMinHeight;
            }
        }
        getMouseMoveDis() {
        }
        getDistance(points) {
            var distance = 0;
            if (points && points.length == 2) {
                var dx = points[0].stageX - points[1].stageX;
                var dy = points[0].stageY - points[1].stageY;
                distance = Math.sqrt(dx * dx + dy * dy);
            }
            return distance;
        }
        onClick() {
            console.log("ClickEvent");
            this.clickTimes++;
        }
        onDoubleClick() {
        }
        onUpdate() {
            if (this.clickTimes == 1 && Laya.timer.currFrame - this.clickFrame >= 20) {
                console.log("Click" + (Laya.timer.currFrame - this.clickFrame));
                HMFW.UIManage.Instance.CloseUI(PhotoImgUI);
                this.clickTimes = 0;
            }
        }
        regevent() {
        }
        showMiniPhoto() {
        }
    }

    class PhotoListUI extends ui.PhotoListUIUI {
        constructor() {
            super();
        }
        onAwake() {
            this.photoList.renderHandler = Laya.Handler.create(this, this.onRender, null, false);
            this.closeBtn.clickHandler = Laya.Handler.create(this, this.onCloseBtn, null, false);
            this.uploadBox.visible = false;
            this.timerOnce(100, this, () => {
                this.domElement = HMFW.DomHelper.selectImg(this.uploadBtn.width, this.uploadBtn.height, this.uploadBtn.x, this.uploadBtn.y, (result) => {
                    if (result && result.length > 0) {
                        this.miniMapDataBase64 = result.split(",")[1];
                        this.showUploadBox();
                    }
                });
                this.domElement.disabled = false;
            });
            HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_CoveUIVisable, this, this.onCaveUIVisable);
            HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_CoveUIDisable, this, this.onCaveUIDisable);
        }
        onCaveUIVisable() {
            if (this.domElement) {
                this.domElement.disabled = true;
            }
        }
        onCaveUIDisable() {
            if (this.domElement) {
                this.domElement.disabled = false;
            }
        }
        onOpened(arg) {
            this.albumInfo = arg;
            this.photoList.selectEnable = true;
            this.photoList.vScrollBarSkin = "";
            this.photoList.elasticEnabled = true;
            this.photoList.selectHandler = Laya.Handler.create(this, this.onListSelect, null, false);
            this.uploadBtn.clickHandler = Laya.Handler.create(this, this.onUploadBtn, null, false);
            this.refeshShow();
        }
        refeshShow() {
            if (this.albumInfo) {
                let albumdatas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
                this.albumInfo = albumdatas.getAlbumInfo(this.albumInfo.photoAlbumId);
                this.albumNameLabel.text = this.albumInfo.albumName;
                this.albumCountLabel.text = this.albumInfo.photoIds ? this.albumInfo.photoIds.length + "张" : "0张";
                this.photoList.array = this.albumInfo.photoIds;
                this.photoList.refresh();
            }
            else {
                this.photoList.array = [];
                this.photoList.refresh();
            }
        }
        onRender(cell, index) {
            let photoImg = cell.getChildByName("photoImg");
            let nameLabel = cell.getChildByName("nameLabel");
            let timeLabel = cell.getChildByName("timeLabel");
            let id = this.albumInfo.photoIds[index];
            let dataCenter = HMFW.DataCenter.Instance.getData(DataCenterKey.PhotoData, PhotoData);
            dataCenter.getSmallPhotoInfoAndUrl(id, (photoInfo, url) => {
                photoImg.skin = url;
                nameLabel.text = photoInfo.photoName;
                timeLabel.text = photoInfo.creatTime.substr(0, 10);
            });
        }
        onListSelect() {
            console.log(this.photoList.selectedIndex);
            HMFW.UIManage.Instance.OpenUI(PhotoImgUI, this.albumInfo.photoIds[this.photoList.selectedIndex]);
        }
        onUploadBtn() {
            HMFW.UIHelper.playBtnTouchAction(this.uploadBtn, () => {
            });
        }
        onCloseBtn() {
            HMFW.UIHelper.playBtnTouchAction(this.closeBtn, () => {
                HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_CoveUIVisable, this, this.onCaveUIVisable);
                HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_CoveUIDisable, this, this.onCaveUIDisable);
                NetworkManager.requestAllAlbums();
                HMFW.UIManage.Instance.CloseUI(PhotoListUI);
                HMFW.UIManage.Instance.OpenUI(PhotoAlbumUI);
                if (this.domElement) {
                    Laya.Browser.document.body.removeChild(this.domElement);
                }
            });
        }
        hidUploadBox() {
            HMFW.UIHelper.playBtnTouchAction(this.closeUploadBtn, () => {
                this.uploadBox.visible = false;
                this.sureUploadBtn.clickHandler = null;
            });
        }
        onSureUpload() {
            HMFW.UIHelper.playBtnTouchAction(this.sureUploadBtn, () => {
                NetworkManager.uploadPhoto(this.albumInfo.photoAlbumId, this.uploadNameLabel.text, this.miniMapDataBase64, (albumDatas) => {
                    this.refeshShow();
                    this.hidUploadBox();
                    HMFW.TipsManager.Instance.showTips("上传成功");
                }, (mes) => {
                    this.hidUploadBox();
                });
            });
        }
        showUploadBox() {
            this.uploadBox.visible = true;
            let bytes = HMFW.NetworkHelper.convertBase64ToBytes(this.miniMapDataBase64);
            let url = HMFW.NetworkHelper.bytesToUrl(bytes);
            this.uploadImg.skin = url;
            this.closeUploadBtn.clickHandler = Laya.Handler.create(this, this.hidUploadBox, null, false);
            this.sureUploadBtn.clickHandler = Laya.Handler.create(this, this.onSureUpload, null, false);
        }
    }

    class PhotoAlbumUI extends ui.PhotoAlbumUIUI {
        constructor() {
            super();
        }
        onAwake() {
            this.albumList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
            this.albumList.selectEnable = true;
            this.albumList.vScrollBarSkin = "";
            this.albumList.elasticEnabled = true;
            this.albumList.selectHandler = Laya.Handler.create(this, this.onSelect, null, false);
            let datas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
            datas.RegChangeEvent(this, this.showAlbums);
            this.createAlbumBtn.clickHandler = Laya.Handler.create(this, this.onCreateAlbumBtn, null, false);
            this.refreshBtn.clickHandler = Laya.Handler.create(this, this.onRefreshBtn, null, false);
            this.sureCreateBtn.clickHandler = Laya.Handler.create(this, this.onSureCreateBtn, null, false);
            this.closeCreateAlbumBtn.clickHandler = Laya.Handler.create(this, () => {
                this.creatAlbumBox.visible = false;
            });
            this.showAlbums(datas);
        }
        showAlbums(datas) {
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
        onSelect() {
            console.log(this.albumList.selectedIndex);
            HMFW.UIManage.Instance.CloseUI(PhotoAlbumUI);
            HMFW.UIManage.Instance.OpenUI(PhotoListUI, this.datas.datas[this.albumList.selectedIndex]);
        }
        onListRender(cell, index) {
            let albumNameLabel = cell.getChildByName("albumNameLabel");
            let countLabel = cell.getChildByName("countLabel");
            let createrUserLabel = cell.getChildByName("createrUserLabel");
            let lastPhotoTimeLabel = cell.getChildByName("lastPhotoTimeLabel");
            if (this.datas && this.datas.datas && index >= 0 && index < this.datas.datas.length) {
                let data = this.datas.datas[index];
                if (data) {
                    albumNameLabel.text = data.albumName;
                    countLabel.text = data.photoIds ? (data.photoIds.length.toString() + "张") : "0张";
                    createrUserLabel.text = data.createrUser;
                    lastPhotoTimeLabel.text = data.lastPhotoTime.substring(0, 10);
                }
                else {
                    albumNameLabel.text = "";
                    countLabel.text = "0张";
                    createrUserLabel.text = "";
                    lastPhotoTimeLabel.text = "";
                }
            }
            else {
                albumNameLabel.text = "";
                countLabel.text = "0张";
                createrUserLabel.text = "";
                lastPhotoTimeLabel.text = "";
            }
        }
        onCreateAlbumBtn() {
            HMFW.UIHelper.playBtnTouchAction(this.createAlbumBtn, () => {
                this.createAlbumInput.text = "";
                this.creatAlbumBox.visible = true;
            });
        }
        onSureCreateBtn() {
            let name = this.createAlbumInput.text;
            if (!name || name.length < 1) {
                HMFW.TipsManager.Instance.showTips("请输入新相册的名字");
                return;
            }
            HMFW.UIHelper.playBtnTouchAction(this.createAlbumBtn, () => {
                NetworkManager.requestNewAlbum(name, null, null);
                this.creatAlbumBox.visible = false;
            });
        }
        onRefreshBtn() {
            HMFW.UIHelper.playBtnTouchAction(this.refreshBtn, () => {
                NetworkManager.requestAllAlbums();
            });
        }
        onClosed() {
            let datas = HMFW.DataCenter.Instance.getData(DataCenterKey.AlbumDatas, AlbumDatas);
            datas.RemoveEvent(this, this.showAlbums);
        }
    }

    class LoginedState extends HMFW.GameStateBase {
        constructor() {
            super("LoginedState");
        }
        EnterState(arg) {
            this.regEvent();
            let albumsUI = HMFW.UIManage.Instance.GetOpenUI(PhotoAlbumUI);
            if (!albumsUI) {
                HMFW.UIManage.Instance.OpenUI(PhotoAlbumUI);
            }
            HMFW.UIManage.Instance.CloseUI(LoginUI);
            NetworkManager.requestAllAlbums();
        }
        regEvent() {
            HMFW.EventCenter.Instance.regEvent(HMFWEvent.E_LOGOUT, this, this.onLogout);
        }
        OnUpdate() {
        }
        onLogout() {
            HMFW.GameStateFsm.Instance.ChangeState("UnLoginedState");
        }
        LeaveState(arg) {
            this.removeEvent();
        }
        removeEvent() {
            HMFW.EventCenter.Instance.removeEvent(HMFWEvent.E_LOGOUT, this, this.onLogout);
        }
    }

    class CoverUI extends ui.CoverUIUI {
        constructor() { super(); }
        onAwake() {
            this.regEvent();
        }
        regEvent() {
            this.controlImg.on(Laya.Event.DOUBLE_CLICK, this, this.onClickControlImg);
        }
        removeEvent() {
        }
        onClickControlImg() {
            this.bgBox.visible = !this.bgBox.visible;
            if (this.bgBox.visible) {
                this.controlImg.clearTimer(this, this.onMyVisible);
                this.controlImg.offAll();
                this.controlImg.timerOnce(1000, this, this.onMyVisible);
                HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_CoveUIVisable);
            }
            else {
                this.controlImg.clearTimer(this, this.onMyVisible);
                this.controlImg.offAll();
                this.controlImg.on(Laya.Event.CLICK, this, this.onClickControlImg);
                HMFW.EventCenter.Instance.eventAction(HMFWEvent.E_CoveUIDisable);
            }
        }
        onMyVisible() {
            this.controlImg.on(Laya.Event.DOUBLE_CLICK, this, this.onClickControlImg);
        }
        onOpened() {
        }
        onClosed() {
            this.removeEvent();
        }
    }

    class UnLoginedState extends HMFW.GameStateBase {
        constructor() {
            super("UnLoginedState");
        }
        EnterState(arg) {
            HMFW.UIManage.Instance.OpenUI(CoverUI, null, false, 1000);
            HMFW.UIManage.Instance.OpenUI(LoginUI, null, false, 998);
        }
        OnUpdate() {
        }
        LeaveState(arg) {
        }
    }

    class InitState extends HMFW.GameStateBase {
        constructor() {
            super("InitState");
        }
        EnterState(arg) {
            LibEdit.Edit();
            this.initApp();
            HMFW.GameStateFsm.Instance.ChangeState("UnLoginedState");
        }
        initApp() {
            if (window["Laya3D"])
                Laya3D.init(Laya.Browser.width, Laya.Browser.height);
            else
                Laya.init(Laya.Browser.width, Laya.Browser.height, Laya["WebGL"]);
            HMFW.DataCenter.Instance.regDataType(DataCenterKey.UserData, UserData);
            HMFW.DataCenter.Instance.regDataType(DataCenterKey.AlbumDatas, AlbumDatas);
            HMFW.DataCenter.Instance.regDataType(DataCenterKey.PhotoData, PhotoData);
            HMFW.GameStateFsm.Instance.RegState(new LoginedState());
            HMFW.GameStateFsm.Instance.RegState(new UnLoginedState());
        }
        OnUpdate() {
        }
        LeaveState() {
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            HMFW.GameStateFsm.Instance.RegState(new InitState());
            HMFW.GameStateFsm.Instance.ChangeState("InitState");
        }
    }
    new Main();

}());
