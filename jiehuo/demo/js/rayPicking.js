var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../../../dist/wd.all.d.ts"/>
var sample;
(function (sample) {
    var RayPicking = (function () {
        function RayPicking(gameObject) {
            this._gameObject = null;
            this._collidingMaterial = null;
            this._originMaterial = null;
            this._font = null;
            this._uiRenderer = null;
            this._isSelected = false;
            this._textName = null;
            this._gameObject = gameObject;
        }
        RayPicking.prototype.init = function () {
            var gameObject = this._gameObject, data = gameObject.data, geometry = this._gameObject.getComponent(wd.Geometry), self = this;
            this._collidingMaterial = wd.LightMaterial.create();
            var color = null;
            if (data && data.color) {
                color = data.color;
            }
            else {
                color = "red";
            }
            this._collidingMaterial.color = wd.Color.create(color);
            this._collidingMaterial.geometry = geometry;
            this._collidingMaterial.init();
            this._originMaterial = geometry.material;
            this._font = wd.Director.getInstance().scene.findChildByName("font");
            this._uiRenderer = this._font.getComponent(wd.UIRenderer);
            wd.EventManager.fromEvent("pointDown").subscribe(function () {
                if (!self._isSelected) {
                    geometry.material = self._originMaterial;
                }
                self._isSelected = false;
            });
        };
        RayPicking.prototype.onPointDown = function (e) {
            this._handleSelect(this._gameObject);
            var renderer = this._uiRenderer;
            var canvas = renderer.canvas, canvasWidth = canvas.width, canvasHeight = canvas.height;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var left = e.locationInView.x + 20;
            var top = e.locationInView.y + 20;
            if (left + canvasWidth > windowWidth) {
                left = windowWidth - canvasWidth;
            }
            if (top + canvasHeight > windowHeight) {
                top = windowHeight - canvasHeight;
            }
            renderer.setCanvas(left, top, null, null);
        };
        RayPicking.prototype._handleSelect = function (selectedObj) {
            var geometry = this._gameObject.getComponent(wd.Geometry);
            var scene = wd.Director.getInstance().scene;
            geometry.material = this._collidingMaterial;
            this._textName = selectedObj.name || "";
            this._setText(this._textName);
            scene.data = {
                isBuildingSelected: true
            };
            this._isSelected = true;
        };
        RayPicking.prototype._setText = function (text) {
            this._font.getComponent(wd.PlainFont).text = text;
        };
        return RayPicking;
    }());
    RayPicking = __decorate([
        wd.script("rayPicking")
    ], RayPicking);
    sample.RayPicking = RayPicking;
})(sample || (sample = {}));
