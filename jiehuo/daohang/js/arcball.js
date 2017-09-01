var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../../../dist/wd.all.d.ts"/>
var sample;
(function (sample) {
    var EEngineEvent = wd.EEngineEvent;
    var EventManager = wd.EventManager;
    var Director = wd.Director;
    var MathUtils = wd.MathUtils;
    var Vector3 = wd.Vector3;
    var Arcball = (function () {
        function Arcball(gameObject) {
            this._gameObject = null;
            this._zoomInUI = null;
            this._zoomOutUI = null;
            this._rollLeftUI = null;
            this._rollRightUI = null;
            this._camera = null;
            this._distance = 10;
            this._minDistance = 0.05;
            this._phi = Math.PI / 2;
            this._theta = Math.PI / 2;
            this._thetaMargin = 0.05;
            this._target = Vector3.create(0, 0, 0);
            // @cloneAttributeAsBasicType()
            this.moveSpeedX = 1;
            // @cloneAttributeAsBasicType()
            this.moveSpeedY = 1;
            // @cloneAttributeAsBasicType()
            this.rotateSpeed = 1;
            // @cloneAttributeAsBasicType()
            this.wheelSpeed = 1;
            this._isChange = true;
            this._pointDragSubscription = null;
            this._pointWheelSubscription = null;
            this._keydownSubscription = null;
            this._gameObject = gameObject;
        }
        Arcball.prototype.init = function () {
            var scene = Director.getInstance().scene;
            this._camera = scene.currentCamera;
            this._zoomInUI = scene.findChildByName("zoom_in");
            this._zoomOutUI = scene.findChildByName("zoom_out");
            this._rollLeftUI = scene.findChildByName("roll_left");
            this._rollRightUI = scene.findChildByName("roll_right");
            this.distance = 6;
            this.target = Vector3.create(0, 0, 0);
            this.theta = Math.PI / 3;
            this.phi = Math.PI / 4;
            this._bindCanvasEvent();
            this._updateTransform();
            this._isChange = false;
        };
        Object.defineProperty(Arcball.prototype, "distance", {
            // @cloneAttributeAsBasicType()
            get: function () {
                return this._distance;
            },
            set: function (distance) {
                if (this._distance !== distance) {
                    this._changeDistance(distance);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arcball.prototype, "minDistance", {
            // @cloneAttributeAsBasicType()
            get: function () {
                return this._minDistance;
            },
            set: function (minDistance) {
                this._minDistance = minDistance;
                if (minDistance > this._distance) {
                    this._changeDistance(minDistance);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arcball.prototype, "phi", {
            // @cloneAttributeAsBasicType()
            get: function () {
                return this._phi;
            },
            set: function (phi) {
                if (this._phi !== phi) {
                    this._changePhi(phi);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arcball.prototype, "theta", {
            // @cloneAttributeAsBasicType()
            get: function () {
                return this._theta;
            },
            set: function (theta) {
                if (this._theta !== theta) {
                    this._changeTheta(theta);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arcball.prototype, "thetaMargin", {
            // @cloneAttributeAsBasicType()
            get: function () {
                return this._thetaMargin;
            },
            set: function (thetaMargin) {
                if (this._thetaMargin !== thetaMargin) {
                    this._thetaMargin = thetaMargin;
                    this._constrainTheta();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arcball.prototype, "target", {
            // @cloneAttributeAsCloneable()
            get: function () {
                return this._target;
            },
            set: function (target) {
                if (!this._target.isEqual(target)) {
                    this._changeTarget(target);
                }
            },
            enumerable: true,
            configurable: true
        });
        Arcball.prototype.update = function (elapsed) {
            // super.update(elapsed);
            if (!this._isChange) {
                return;
            }
            this._isChange = false;
            this._updateTransform();
        };
        // public dispose() {
        //     super.dispose();
        //
        //     this._removeEvent();
        // }
        //todo treat picked item as the target
        Arcball.prototype._bindCanvasEvent = function () {
            var self = this;
            // scene = Director.getInstance().scene,
            // pointwheel = EventManager.fromEvent(scene, EEngineEvent.POINT_SCALE);
            // pointdrag = EventManager.fromEvent(scene, EEngineEvent.POINT_DRAG),
            // keydown = EventManager.fromEvent(EEventName.KEYDOWN);
            // this._pointDragSubscription = pointdrag.subscribe((e:CustomEvent) => {
            //     self._changeOrbit(e.userData);
            // });
            // this._pointWheelSubscription = pointwheel.subscribe((e:CustomEvent) => {
            //     var pointEvent:PointEvent = e.userData;
            //
            //     pointEvent.preventDefault();
            //
            //     self._changeDistance(pointEvent);
            // });
            // this._keydownSubscription = keydown.subscribe(function (e) {
            //     self._changeTarget(e);
            // });
            EventManager.fromEvent(this._zoomInUI, EEngineEvent.POINT_DOWN).subscribe(function () {
                self._changeDistance(self.distance - 0.2);
            });
            EventManager.fromEvent(this._zoomOutUI, EEngineEvent.POINT_DOWN).subscribe(function () {
                self._changeDistance(self.distance + 0.2);
            });
            EventManager.fromEvent(this._rollLeftUI, EEngineEvent.POINT_DOWN).subscribe(function () {
                self._changePhi(self.phi - Math.PI / 8);
            });
            EventManager.fromEvent(this._rollRightUI, EEngineEvent.POINT_DOWN).subscribe(function () {
                self._changePhi(self.phi + Math.PI / 8);
            });
        };
        // private _changeOrbit(e:PointEvent) {
        //     var movementDelta = e.movementDelta;
        //
        //     this._isChange = true;
        //
        //     this._changePhi(this._phi + movementDelta.x / (100 / this.rotateSpeed));
        //
        //     this._changeTheta(this._theta - movementDelta.y / (100 / this.rotateSpeed))
        // }
        Arcball.prototype._changePhi = function (phi) {
            this._isChange = true;
            this._phi = phi;
        };
        Arcball.prototype._changeTheta = function (theta) {
            this._isChange = true;
            this._theta = theta;
            this._constrainTheta();
        };
        // @require(function(...args){
        //     expect(args[0] instanceof KeyboardEvent || args[0] instanceof Vector3).true;
        // })
        Arcball.prototype._changeTarget = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._isChange = true;
            // if(args[0] instanceof Vector3){
            this._target = args[0];
            // }
            // else{
            //     let e:KeyboardEvent = args[0],
            //         moveSpeedX = this.moveSpeedX,
            //         moveSpeedY = this.moveSpeedY,
            //         dx = null,
            //         dy = null,
            //         keyState = e.keyState,
            //         transform = this.entityObject.transform;
            //
            //     if (keyState["a"] || keyState["left"]) {
            //         dx = -moveSpeedX;
            //     }
            //     else if(keyState["d"] || keyState["right"]) {
            //         dx = moveSpeedX;
            //     }
            //     else if(keyState["w"] || keyState["up"]) {
            //         dy = moveSpeedY;
            //     }
            //     else if(keyState["s"] || keyState["down"]) {
            //         dy = -moveSpeedY;
            //     }
            //
            //     this._target.add(Vector3.create(transform.right.x * (dx), 0, transform.right.z * (dx)));
            //     this._target.add(Vector3.create(transform.up.x * dy, transform.up.y * dy, 0));
            // }
        };
        // @require(function(...args){
        //     expect(JudgeUtils.isNumber(args[0]) || args[0] instanceof PointEvent).true;
        // })
        Arcball.prototype._changeDistance = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._isChange = true;
            // if(JudgeUtils.isNumber(args[0])){
            this._distance = args[0];
            // }
            // else{
            //     let e:PointEvent = args[0];
            //
            //     this._distance -= this.wheelSpeed * e.wheel;
            // }
            this._constrainDistance();
        };
        Arcball.prototype._constrainDistance = function () {
            this.distance = MathUtils.bigThan(this.distance, this.minDistance);
        };
        Arcball.prototype._constrainTheta = function () {
            this._theta = MathUtils.clamp(this._theta, this._thetaMargin, Math.PI - this._thetaMargin);
        };
        // private _removeEvent() {
        //     this._pointDragSubscription.dispose();
        //     this._pointWheelSubscription.dispose();
        //     this._keydownSubscription.dispose();
        // }
        Arcball.prototype._updateTransform = function () {
            /*!
             X= r*cos(phi)*sin(theta);
             Z= r*sin(phi)*sin(theta);
             Y= r*cos(theta);
             */
            var x = null, y = null, z = null;
            x = ((this.distance) * Math.cos(this.phi) * Math.sin(this.theta) + this.target.x);
            z = ((this.distance) * Math.sin(this.phi) * Math.sin(this.theta) + this.target.z);
            y = ((this.distance) * Math.cos(this.theta) + this.target.y);
            this._camera.transform.position = Vector3.create(x, y, z);
            this._camera.transform.lookAt(this.target);
        };
        return Arcball;
    }());
    Arcball = __decorate([
        wd.script("arcball")
    ], Arcball);
    sample.Arcball = Arcball;
})(sample || (sample = {}));
