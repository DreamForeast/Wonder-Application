/// <reference path="../../../../dist/wd.all.d.ts"/>
module sample {
    import GameObject = wd.GameObject;
    import PointEvent = wd.PointEvent;

    declare var window:any;

    @wd.script("rayPicking")
    export class RayPicking implements wd.IScriptBehavior {
        constructor(gameObject:GameObject) {
            this._gameObject = gameObject;
        }

        private _gameObject:GameObject = null;
        private _collidingMaterial:wd.Material = null;
        private _originMaterial:wd.Material = null;
        private _font:wd.UIObject = null;
        private _uiRenderer:wd.UIRenderer = null;
        private _isSelected:boolean = false;
        private _textName:string = null;

        public init(){
            var gameObject = this._gameObject,
                data = gameObject.data,
                geometry =  this._gameObject.getComponent<wd.Geometry>(wd.Geometry),
                self = this;

            this._collidingMaterial = wd.LightMaterial.create();


            let color = null;

            if(data && data.color){
                color = data.color;
            }
            else{
                color = "red";
            }

            this._collidingMaterial.color = wd.Color.create(color);

            this._collidingMaterial.geometry = geometry;
            this._collidingMaterial.init();

            this._originMaterial = geometry.material;

            this._font = wd.Director.getInstance().scene.findChildByName("font");
            this._uiRenderer = this._font.getComponent<wd.UIRenderer>(wd.UIRenderer);

            wd.EventManager.fromEvent("pointDown").subscribe(() => {
                if(!self._isSelected){
                    geometry.material = self._originMaterial;
                }

                self._isSelected = false;
            });
        }

        public onPointDown(e:PointEvent){
            this._handleSelect(this._gameObject);

            var renderer = this._uiRenderer;

            var canvas = renderer.canvas,
                canvasWidth = canvas.width,
                canvasHeight = canvas.height;

            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var left = e.locationInView.x + 20;
            var top = e.locationInView.y + 20;

            if(left + canvasWidth  > windowWidth){
                left = windowWidth - canvasWidth;
            }

            if(top + canvasHeight  > windowHeight){
                top = windowHeight - canvasHeight;
            }

            renderer.setCanvas(left, top, null, null);
        }

        private _handleSelect(selectedObj:GameObject) {
            var geometry = this._gameObject.getComponent<wd.Geometry>(wd.Geometry);

            var scene = wd.Director.getInstance().scene;

            geometry.material = this._collidingMaterial;

            this._textName = selectedObj.name || "";
            this._setText(this._textName);

            scene.data = {
                isBuildingSelected : true
            };

            this._isSelected = true;
        }

        private _setText(text:string){
            this._font.getComponent<wd.PlainFont>(wd.PlainFont).text = text;
        }
    }
}
