/**H5小游戏框架3D部分 by:HMOK 
 *
 */
export module HMFW3D {
   
    /**3D对象池对象基类,所有使用对象池的对象必须加载此类的子类,继承了Laya.Sprite3D */
    export abstract class PoolFor3DObjBase extends Laya.Script3D {
        gameObject: Laya.Sprite3D;
        /**是否已经被回收 */
        recoved: boolean = false;

        constructor() { super(); }
        /**初始化物体,从对象池中取出时,必须先初始化! */
        public init() {
            this.gameObject = this.owner as Laya.Sprite3D;

            this.gameObject.active = true;
            this.recoved = false;
        }
        /**回收对象 */
        public recover() {
            this.gameObject.active = false;
            HMFW3D.PoolFor3D.Instance.recoverObj(this);
            this.recoved = true;
        }

    }
    /**3d的对象池_所有的对象都是基于3D场景的.所以需要使用场景进行初始化,当场景被清理时,需要结束本对象池 */
    export class PoolFor3D {
        private static _instance: PoolFor3D = null;
        private scene: Laya.Scene3D;
        /**未使用的objmap */
        public unusedMap: { [key: string]: PoolFor3DObjBase[] };
        /**正在使用的objMap */
        private usedMap: { [key: string]: PoolFor3DObjBase[] };
        constructor() { }
        /**
         * 获取3d的对象池的单例
        */
        public static get Instance(): PoolFor3D {
            if (PoolFor3D._instance == null) {
                PoolFor3D._instance = new PoolFor3D();
                // PoolFor3D._instance.Init();
            }
            return PoolFor3D._instance;
        };
        /**初始化3D对象池,更换一个场景就需要重新初始化一次,否则生成的Obj无法显示 */
        public InitWithNewScene(scene: Laya.Scene3D) {
            this.currentSceneOver();
            this.scene = scene;
            this.unusedMap = {};
            this.usedMap = {};
        }
        /**本次对象池使用完毕,释放相应对象 */
        public currentSceneOver() {
            if (this.unusedMap) {
                for (const key in this.unusedMap) {
                    if (this.unusedMap.hasOwnProperty(key)) {
                        var components = this.unusedMap[key];
                        for (let index = 0; index < components.length; index++) {
                            const element = components[index];
                            if (element && !element.destroyed) {
                                if (element.owner && !element.destroyed) {
                                    element.owner.destroy();
                                }
                                element.destroy();
                            }

                        }

                    }
                }
            }
            this.unusedMap = {};
            if (this.usedMap) {
                for (const key in this.usedMap) {
                    if (this.usedMap.hasOwnProperty(key)) {
                        var components = this.usedMap[key];
                        for (let index = 0; index < components.length; index++) {
                            const element = components[index];
                            if (element && !element.destroyed) {
                                if (element.owner && !element.destroyed) {
                                    element.owner.destroy();
                                }
                                element.destroy();
                            }

                        }

                    }
                }
            }
            this.usedMap = {};
            this.scene = null;

        }

        /**创建对象池物体组件脚本的实例-包含3d物体 */
        private creatOBJ<T extends PoolFor3DObjBase>(obj: Laya.Sprite3D, component: new () => T): T {
            var objTeamp = Laya.Sprite3D.instantiate(obj);
            var comp = objTeamp.addComponent(component) as T;
            comp.owner.active = false;
            comp.recoved = true;
            this.scene.addChild(comp.owner);
            return comp;
        }
        /**
         * 初始化池中的3D物体
         * @param obj 3d物体
         * @param component 挂载的脚本
         * @param count 数量
         */
        public init3DObjInPool<T extends PoolFor3DObjBase>(obj: Laya.Sprite3D, component: new () => T, count: number) {

            var key = component.name;

            if (!this.unusedMap[key]) {
                this.unusedMap[key] = [];

            }
            for (var index = 0; index < count; index++) {
                var objTemp = this.creatOBJ(obj, component) as T;
                this.unusedMap[key].push(objTemp);
            }
           // console.log("对象池创建成功:" + key)
            //console.log(this.unusedMap)

        }
        /**根据类来获取3D物体 */
        public get3DOBJByClass<T extends PoolFor3DObjBase>(poolFor3DObjClass: new () => T): T {
            var key = poolFor3DObjClass.name;

            if (this.unusedMap[key]) {
                if (this.unusedMap[key].length <= 0) {
                    if (this.usedMap[key] && this.usedMap[key].length > 0) {
                        var temp = this.creatOBJ(this.usedMap[key][0].owner as Laya.Sprite3D, poolFor3DObjClass);
                        this.unusedMap[key].push(temp)
                    }
                }


                if (this.unusedMap[key].length > 0) {
                    var teamp = this.unusedMap[key].shift();
                    if (!this.usedMap[key]) {
                        this.usedMap[key] = [];
                    }
                    this.usedMap[key].push(teamp);
                    teamp.recoved = false;
                    return teamp as T;
                } else {
                    console.error("3d对象池错误,未初始化:" + poolFor3DObjClass)
                    return null;
                }

            } else {
                console.error("3d对象池错误,未初始化:" + poolFor3DObjClass)
                return null;
            }
        }
        /**回收物体,各物体实例中直接调用,无需手动调用 */
        public recoverObj<T extends PoolFor3DObjBase>(component: T) {
            var key = component.constructor.name;

            if (this.usedMap[key] && this.unusedMap[key]) {
                var temp = this.usedMap[key].indexOf(component);
                this.usedMap[key].splice(temp, 1);
                this.unusedMap[key].push(component);
            }

        }
    }
    /**
     * 配合HMFWLayaSceneDataTools工具使用的导入场景数据的工具
     */
    export class SceneDataImportTools {

        /**预制体名单 */
        public static prefebNames: string[];
        public static prefebBaseUrl;
        private static needLoadCount: number = 0;
        private static loadedCount: number = 0;
        private static startIndexOnThisFrame: number = 0;
        /**预制体Map */
        private static prefebsMap: Map<string, Laya.Sprite3D>;
        /**需要载入预制体的数据(一般为这个预制体的第一个实例) */
        private static needLoadPrefebDatas: any[];
        /**需要复制实例化的数据 */
        private static needInstantiateDatas: any[];

        /**
         * 载入预制体名单
         * @param prefebBaseUrl 预制体的根目录,一般在资源版本号目录下,此目录下包含Conventional目录,GameLevel目录,prefabsNames.txt文件
         * @param cb 加载完毕后的回调
         */
        public static loadPrefebNamesFile(prefebBaseUrl: string, cb: Laya.Handler) {

            if (SceneDataImportTools.prefebNames && SceneDataImportTools.prefebNames.length > 0) {

                if (cb) {
                    cb.run();
                }

            } else {
                SceneDataImportTools.prefebBaseUrl = prefebBaseUrl;
                Laya.loader.create(SceneDataImportTools.prefebBaseUrl + "/prefabsNames.txt", Laya.Handler.create(SceneDataImportTools, SceneDataImportTools.loadPrefebNamesComplete, [cb]), null)
            }

        }

        private static loadPrefebNamesComplete(cb, arg: string) {
            console.log("载入prefebNames完毕!")
            //console.log(arg)
            if (arg.length > 0) {
                SceneDataImportTools.prefebNames = arg.split("|");
                //console.log(SceneDataImportTools.prefebName)
                if (cb) {
                    cb.run();
                }
            }

        }
        /**
         * 请求关卡场景数据文件
         * @param url 关卡场景数据文件地址
         * @param callOBj 回调的域
         * @param func 解析后回调函数
         */
        public static loadGameLevelSceneData(url: string, cb: Laya.Handler) {


            Laya.loader.create(url, Laya.Handler.create(SceneDataImportTools, SceneDataImportTools.loadGameLevelSceneDataComplete, [cb]), null, "json")

        }
        /**载入关卡场景数据文件结束的回调 */
        private static loadGameLevelSceneDataComplete(cb, arg) {
            //console.log("载入关卡场景数据文件完毕!开始解析!");
            //console.log(arg);
            //console.log("物体总数=" + arg.data.length);
            SceneDataImportTools.replacePrefebsType(arg, cb)

        }
        /**将预制体序号替换为预制体的地址*/
        private static replacePrefebsType(arg, cb: Laya.Handler) {
            if (!SceneDataImportTools.prefebNames) {
                console.error("请先使用本工具loadPrefebNamesFile接口载入预制体名单文件:prefabsNames.txt")
                return;
            }
            //console.log( SceneDataImportTools.prefebName)
            if (arg && arg.data && Array.isArray(arg.data)) {
                for (let index = 0; index < arg.data.length; index++) {
                    const element = arg.data[index];
                    //如果输入的是数字,那么就代表未解析过.需要解析一次
                    if (Number.parseInt(element.T) >= 0) {
                        let prefebName = SceneDataImportTools.prefebNames[Number.parseInt(element.T)]
                        prefebName = SceneDataImportTools.prefebBaseUrl + "/Conventional/" + prefebName + ".lh";
                        arg.data[index].T = prefebName;
                    }

                }
            } else {
                console.error("收到的预制体文件错误:")
                console.error(arg)
                return;
            }
            if (cb) {
                cb.runWith(arg);
            }
        }
        /**
         * 根据场景数据文件获得生成好的3D场景
         * @param sceneData 场景数据文件
         * @param scene 要挂载的场景对象
         * @param cb 完成回调
         * @param extraObj 额外的预制体名称数组(也就是增加场景数据文件中可能不存在的预制体,如果数据文件中没有此预制体,被实例化后会被关闭)
         */
        public static getSceneFromDataFile(sceneData: any, scene: Laya.Scene3D, cb: Laya.Handler, extraObj: [{ N: string, T: string }] = null) {
            let datas = sceneData.data;


            //console.log(sceneData.data)
            SceneDataImportTools.getLoadAndInstantiteDatas(datas);
            //console.log(SceneDataImportTools.needLoadPrefebDatas);
            if (extraObj) {
                for (let index = 0; index < extraObj.length; index++) {
                    const element = extraObj[index];
                    //如果没有就额外增加这个DemoOBj
                    let have = false;
                    for (let prefebDatasIndex = 0; prefebDatasIndex < SceneDataImportTools.needLoadPrefebDatas.length; prefebDatasIndex++) {
                        const prefebData = SceneDataImportTools.needLoadPrefebDatas[prefebDatasIndex];
                        //console.log(prefebData.N)
                        //console.log(element.N)
                        if (prefebData.N.indexOf(element.N) == 0) {
                            have = true;
                            //console.log("有金币")
                            break;
                        }
                    }
                    //没有就添加进来
                    if (have == false) {
                        var data = { T: element.T, N: element.N, D: true };
                        SceneDataImportTools.needLoadPrefebDatas.push(data)
                    }

                }
            }





            SceneDataImportTools.needLoadCount = SceneDataImportTools.needLoadPrefebDatas.length;
            SceneDataImportTools.loadedCount = 0;


            for (let index = 0; index < SceneDataImportTools.needLoadPrefebDatas.length; index++) {
                const element = SceneDataImportTools.needLoadPrefebDatas[index];
                //console.log(element.T)
                // console.log("getSceneFromDataFile:"+ Laya.timer.currFrame);
                Laya.Sprite3D.load(element.T, Laya.Handler.create(this, this.onLoadPrefeb, [element, scene, cb]))
            }
        }



        private static onLoadPrefeb(data, scene: Laya.Scene3D, cb: Laya.Handler, obj: Laya.Sprite3D) {
            //console.log("onLoadPrefeb:" + Laya.timer.currFrame + "  name=" + data.N);
            SceneDataImportTools.loadedCount++;
            //console.log("已经加载了:" + SceneDataImportTools.loadedCount + " 总数量:" + SceneDataImportTools.needLoadCount)
            scene.addChild(obj);
            obj.name = data.N;
            //如果是额外扩展物体
            if (data.D) {
                obj.transform.position = new Laya.Vector3(1000, 1000, 1000);
                obj.transform.rotation = new Laya.Quaternion(0, 0, 0, 0);
                obj.transform.localScale = new Laya.Vector3(1, 1, 1);
                obj.active = false;//关闭显示
            } else {
                obj.transform.position = new Laya.Vector3(data.P[0], data.P[1], data.P[2]);
                obj.transform.rotation = new Laya.Quaternion(data.R[0], data.R[1], data.R[2], data.R[3]);
                obj.transform.localScale = new Laya.Vector3(data.S[0], data.S[1], data.S[2]);
                SceneDataImportTools.prefebsMap.set(data.T, obj);
            }


            //需要load的都加载完了,现在开始复制
            if (SceneDataImportTools.loadedCount >= SceneDataImportTools.needLoadCount && cb) {

                Laya.timer.frameOnce(1, this, this.instantiateObjOnFrame, [scene, cb]);
            }

        }
        /**下一帧执行复制对象 */
        private static instantiateObjOnFrame(scene, cb) {
            SceneDataImportTools.startIndexOnThisFrame = 0;

            if (SceneDataImportTools.needInstantiateDatas.length > 0) {
                SceneDataImportTools.instantiateObj(scene, 0, cb);
            } else {
                console.log("场景全部生成完毕,当前=" + Laya.timer.currFrame)
                console.log("场景子物体总数=" + scene.numChildren)
                Laya.timer.frameOnce(1, this, () => { cb.run(); })
            }


            //     for (let index = 0; index < SceneDataImportTools.needInstantiateDatas.length; index++) {
            //         const element = SceneDataImportTools.needInstantiateDatas[index];
            //         let copyTargt = SceneDataImportTools.prefebsMap.get(element.T) as Laya.Sprite3D;

            //         let instantOBJ = Laya.Sprite3D.instantiate(copyTargt, scene, false);
            //         instantOBJ.name = element.N;
            //         instantOBJ.transform.position = new Laya.Vector3(element.P[0], element.P[1], element.P[2]);
            //         instantOBJ.transform.rotation = new Laya.Quaternion(element.R[0], element.R[1], element.R[2], element.R[3]);
            //         instantOBJ.transform.localScale = new Laya.Vector3(element.S[0], element.S[1], element.S[2]);

            //     }
            //    Laya.timer.frameOnce(1,this,()=>{cb.run();}) 
        }
        private static instantiateObj(scene, index: number, cb) {
            const element = SceneDataImportTools.needInstantiateDatas[index];
            let copyTargt = SceneDataImportTools.prefebsMap.get(element.T) as Laya.Sprite3D;
            let instantOBJ = Laya.Sprite3D.instantiate(copyTargt, scene, false);
            instantOBJ.name = element.N;
            instantOBJ.transform.position = new Laya.Vector3(element.P[0], element.P[1], element.P[2]);
            instantOBJ.transform.rotation = new Laya.Quaternion(element.R[0], element.R[1], element.R[2], element.R[3]);
            instantOBJ.transform.localScale = new Laya.Vector3(element.S[0], element.S[1], element.S[2]);
            this.onInstantiateObjCompelete(scene, index, cb)
        }

        private static onInstantiateObjCompelete(scene: Laya.Scene3D, index: number, cb) {

            //全部完成了就回调
            if (index >= SceneDataImportTools.needInstantiateDatas.length - 1) {
                console.log("场景全部生成完毕,当前=" + Laya.timer.currFrame)
                console.log("场景子物体总数=" + scene.numChildren)
                Laya.timer.frameOnce(1, this, () => { cb.run(); })
            } else {
                //每帧就实例化5个物体,超过10个就下一帧再创建
                if (index + 1 > SceneDataImportTools.startIndexOnThisFrame + 10) {
                    SceneDataImportTools.startIndexOnThisFrame = index + 1;
                    Laya.timer.frameOnce(1, this, this.instantiateObj, [scene, SceneDataImportTools.startIndexOnThisFrame, cb]);
                } else {
                    SceneDataImportTools.instantiateObj(scene, index + 1, cb);
                }

            }
        }



        /**分解需要load的和需要复制的预制体数据*/
        private static getLoadAndInstantiteDatas(datas: any) {
            SceneDataImportTools.prefebsMap = new Map<string, Laya.Sprite3D>();
            SceneDataImportTools.needInstantiateDatas = [];
            SceneDataImportTools.needLoadPrefebDatas = [];

            let map = SceneDataImportTools.prefebsMap;
            for (let index = 0; index < datas.length; index++) {
                const element = datas[index];
                if (map.has(element.T)) {
                    //有了的就等会复制
                    SceneDataImportTools.needInstantiateDatas.push(element);
                } else {
                    //没有的就Load
                    map.set(element.T, null);
                    SceneDataImportTools.needLoadPrefebDatas.push(element);

                }
            }
            // console.log("需要复制的物体数量:" + SceneDataImportTools.needInstantiateDatas.length)
            // console.log("需要加载的物体数量:" + SceneDataImportTools.needLoadPrefebDatas.length)
        }

    }
}