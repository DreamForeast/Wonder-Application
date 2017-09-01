var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../../../dist/wd.all.d.ts"/>
var sample;
(function (sample) {
    var SceneScript = (function () {
        function SceneScript(gameObject) {
            this._gameObject = null;
            this._font = null;
            this._gameObject = gameObject;
        }
        SceneScript.prototype.init = function () {
            this._font = this._gameObject.findChildByName("font");
        };
        SceneScript.prototype.onPointDown = function (e) {
            wd.EventManager.trigger(wd.CustomEvent.create("pointDown"));
            if (this._gameObject.data && this._gameObject.data.isBuildingSelected) {
                this._gameObject.data = {};
            }
            else {
                this._setText("");
            }
        };
        SceneScript.prototype._setText = function (text) {
            this._font.getComponent(wd.PlainFont).text = text;
        };
        return SceneScript;
    }());
    SceneScript = __decorate([
        wd.script("sceneScript")
    ], SceneScript);
    sample.SceneScript = SceneScript;
})(sample || (sample = {}));
