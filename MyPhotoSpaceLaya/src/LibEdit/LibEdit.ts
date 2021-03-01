export class LibEdit {
    public static Edit() {
   
        //修复List的Item不能多次点击
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

            })
        }
    }
}

