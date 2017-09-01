/// <reference path="../../../../dist/wd.all.d.ts"/>
module sample {
    import UIObject = wd.UIObject;
    import EEngineEvent = wd.EEngineEvent;
    import EventManager = wd.EventManager;
    import Director = wd.Director;
    import GameObject = wd.GameObject;
    import MathUtils = wd.MathUtils;
    import PointEvent = wd.PointEvent;
    import Vector3 = wd.Vector3;

    @wd.script("arcball")
    export class Arcball implements wd.IScriptBehavior {
        constructor(gameObject:GameObject) {
            this._gameObject = gameObject;
        }

        private _gameObject:GameObject = null;
        private _zoomInUI:UIObject = null;
        private _zoomOutUI:UIObject = null;
        private _rollLeftUI:UIObject = null;
        private _rollRightUI:UIObject = null;
        private _camera:GameObject = null;

        public init(){
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
        }

        private _distance:number = 10;
        // @cloneAttributeAsBasicType()
        get distance(){
            return this._distance;
        }
        set distance(distance:number){
            if(this._distance !== distance){
                this._changeDistance(distance);
            }
        }

        private _minDistance:number = 0.05;
        // @cloneAttributeAsBasicType()
        get minDistance(){
            return this._minDistance;
        }
        set minDistance(minDistance:number){
            this._minDistance = minDistance;

            if(minDistance > this._distance){
                this._changeDistance(minDistance);
            }
        }

        private _phi:number = Math.PI / 2;
        // @cloneAttributeAsBasicType()
        get phi(){
            return this._phi;
        }
        set phi(phi:number){
            if(this._phi !== phi){
                this._changePhi(phi);
            }
        }

        private _theta:number = Math.PI / 2;
        // @cloneAttributeAsBasicType()
        get theta(){
            return this._theta;
        }
        set theta(theta:number){
            if(this._theta !== theta){
                this._changeTheta(theta);
            }
        }

        private _thetaMargin:number = 0.05;
        // @cloneAttributeAsBasicType()
        get thetaMargin(){
            return this._thetaMargin;
        }
        set thetaMargin(thetaMargin:number){
            if(this._thetaMargin !== thetaMargin){
                this._thetaMargin = thetaMargin;

                this._constrainTheta();
            }
        }

        private _target:Vector3 = Vector3.create(0, 0, 0);
        // @cloneAttributeAsCloneable()
        get target(){
            return this._target;
        }
        set target(target:Vector3){
            if(!this._target.isEqual(target)){
                this._changeTarget(target);
            }
        }

        // @cloneAttributeAsBasicType()
        public moveSpeedX:number = 1;
        // @cloneAttributeAsBasicType()
        public moveSpeedY:number = 1;
        // @cloneAttributeAsBasicType()
        public rotateSpeed:number = 1;
        // @cloneAttributeAsBasicType()
        public wheelSpeed:number = 1;

        private _isChange:boolean = true;
        private _pointDragSubscription:wdFrp.IDisposable = null;
        private _pointWheelSubscription:wdFrp.IDisposable = null;
        private _keydownSubscription:wdFrp.IDisposable = null;

        public update(elapsed:number) {
            // super.update(elapsed);

            if(!this._isChange){
                return;
            }

            this._isChange = false;

            this._updateTransform();
        }

        // public dispose() {
        //     super.dispose();
        //
        //     this._removeEvent();
        // }

        //todo treat picked item as the target
        private _bindCanvasEvent() {
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



            EventManager.fromEvent(this._zoomInUI, EEngineEvent.POINT_DOWN).subscribe(() => {
                self._changeDistance(self.distance - 0.2);
            });
            EventManager.fromEvent(this._zoomOutUI, EEngineEvent.POINT_DOWN).subscribe(() => {
                self._changeDistance(self.distance + 0.2);
            });
            EventManager.fromEvent(this._rollLeftUI, EEngineEvent.POINT_DOWN).subscribe(() => {
                self._changePhi(self.phi - Math.PI/8);
            });
            EventManager.fromEvent(this._rollRightUI, EEngineEvent.POINT_DOWN).subscribe(() => {
                self._changePhi(self.phi + Math.PI/8);
            });
        }

        // private _changeOrbit(e:PointEvent) {
        //     var movementDelta = e.movementDelta;
        //
        //     this._isChange = true;
        //
        //     this._changePhi(this._phi + movementDelta.x / (100 / this.rotateSpeed));
        //
        //     this._changeTheta(this._theta - movementDelta.y / (100 / this.rotateSpeed))
        // }

        private _changePhi(phi:number){
            this._isChange = true;

            this._phi = phi;
        }

        private _changeTheta(theta:number){
            this._isChange = true;

            this._theta = theta;

            this._constrainTheta();
        }


        // private _changeTarget(e:KeyboardEvent);
        private _changeTarget(target:Vector3);

        // @require(function(...args){
        //     expect(args[0] instanceof KeyboardEvent || args[0] instanceof Vector3).true;
        // })
        private _changeTarget(...args){
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
        }

        // private _changeDistance(e:PointEvent);
        private _changeDistance(distance:number);

        // @require(function(...args){
        //     expect(JudgeUtils.isNumber(args[0]) || args[0] instanceof PointEvent).true;
        // })
        private _changeDistance(...args){
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
        }

        private _constrainDistance() {
            this.distance = MathUtils.bigThan(this.distance, this.minDistance);
        }

        private _constrainTheta() {
            this._theta = MathUtils.clamp(this._theta, this._thetaMargin, Math.PI - this._thetaMargin);
        }

        // private _removeEvent() {
        //     this._pointDragSubscription.dispose();
        //     this._pointWheelSubscription.dispose();
        //     this._keydownSubscription.dispose();
        // }

        private _updateTransform(){
            /*!
             X= r*cos(phi)*sin(theta);
             Z= r*sin(phi)*sin(theta);
             Y= r*cos(theta);
             */
            var x = null,
                y = null,
                z = null;

            x = ((this.distance) * Math.cos(this.phi) * Math.sin(this.theta) + this.target.x);
            z = ((this.distance) * Math.sin(this.phi) * Math.sin(this.theta) + this.target.z);
            y = ((this.distance) * Math.cos(this.theta) + this.target.y);

            this._camera.transform.position = Vector3.create(x, y, z);
            this._camera.transform.lookAt(this.target);
        }
    }
}

