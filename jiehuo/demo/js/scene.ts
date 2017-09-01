/// <reference path="../../../../dist/wd.all.d.ts"/>
module sample {
    import GameObject = wd.GameObject;
    import PointEvent = wd.PointEvent;

    @wd.script("sceneScript")
    export class SceneScript implements wd.IScriptBehavior {
        constructor(gameObject:GameObject) {
            this._gameObject = gameObject;
        }

        private _gameObject:GameObject = null;
        private _font:wd.UIObject = null;

        public init(){
            this._font = this._gameObject.findChildByName("font");
        }

        public onPointDown(e:PointEvent){
            wd.EventManager.trigger(wd.CustomEvent.create("pointDown"));

            if(this._gameObject.data && this._gameObject.data.isBuildingSelected){
                this._gameObject.data = {};
            }
            else{
                this._setText("");
            }
        }

        private _setText(text:string){
            this._font.getComponent<wd.PlainFont>(wd.PlainFont).text = text;
        }
    }
}

