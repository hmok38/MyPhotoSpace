export default class WidgetMgr extends Laya.Script {
    constructor() { 
        super(); 
        /** @prop {name:layoutParent, tips:"布局参考对象[parent, stage]", type:Option, option:"parent,stage", default:"parent"}*/
        this.layoutParent = "parent"

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
        this.onLayout()
    }

    onDisable() {
        // off
        Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);
    }

    onResize() {
        this.onLayout()
    }

    onLayout() {
        let doLayout = function () {
            console.log("Layout ...")

            let _layoutParent = this.getLayoutParent()
            if (!_layoutParent) {
                return
            }

            if (this.isAlignLeft && this.isAlignRight) {
                this.owner.width = _layoutParent.width - this.left - this.right
            }

            if (this.isAlignTop && this.isAlignBottom) {
                this.owner.height = _layoutParent.height - this.top - this.bottom
            }

            if (this.isAlignHorizontalCenter) {
                this.owner.x = _layoutParent.width / 2.0 - this.owner.width + this._getLayoutCenterOffsetX() + this.horizontalCenter
            }
            else {
                if (this.isAlignLeft) {
                    this.owner.x = this.left + this._getLayoutCenterOffsetX()
                }
                else if (this.isAlignRight) {
                    this.owner.x = _layoutParent.width - this.right - this.owner.width + this._getLayoutCenterOffsetX()
                }
            }

            if (this.isAlignVerticalCenter) {
                this.owner.y = _layoutParent.height / 2.0 - this.owner.height + this._getLayoutCenterOffsetY() + this.verticalCenter
            }
            else {
                if (this.isAlignTop) {
                    this.owner.y = this.top + this._getLayoutCenterOffsetY()
                }
                else if (this.isAlignBottom) {
                    this.owner.y = _layoutParent.height - this.bottom - this.owner.height + this._getLayoutCenterOffsetY()
                }
            }
        }.bind(this)
    
        // Laya.timer.frameOnce(1, null, doLayout)

        doLayout()
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