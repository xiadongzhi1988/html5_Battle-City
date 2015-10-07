var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var game;
(function (game) {
    (function (direction) {
        direction[direction["U"] = 0] = "U";
        direction[direction["D"] = 1] = "D";
        direction[direction["R"] = 2] = "R";
        direction[direction["L"] = 3] = "L";
    })(game.direction || (game.direction = {}));
    var direction = game.direction;
    var tank = (function (_super) {
        __extends(tank, _super);
        function tank(imgKey, troops, point, opt) {
            _super.call(this, imgKey, point);
            //#region 移动
            this.run = {
                speed: 0,
                sTime: 200,
                startPoint: 0,
                endPoint: 0,
                startRunTime: 0,
                isRuning: false
            };
            this.runingDirection = direction.U;
            //#endregion
            //#region 攻击
            this.attackIntervale = 500; //发射间隔
            this.lastAttackTime = 0; //最后发射时间
            opt && common.extend(this, opt);
            this.run.speed = this.point.width / 2;
            this.troops = troops;
        }
        tank.prototype.draw = function (canvas) {
            if (this.run.isRuning) {
                var t = +new Date() - this.run.startRunTime, //花的时间
                result, isComplete = false;
                if (t > this.run.sTime) {
                    console.log(t, this.point);
                    result = this.run.endPoint;
                    isComplete = true;
                }
                else {
                    debugger;
                    result = this.run.speed * t / this.run.sTime;
                    if (this.run.endPoint < this.run.startPoint) {
                        result = this.run.startPoint - result;
                    }
                    else {
                        result = this.run.startPoint + result;
                    }
                }
                if (this.runingDirection === direction.R || this.runingDirection === direction.L) {
                    this.point.x = result;
                }
                if (this.runingDirection === direction.U || this.runingDirection === direction.D) {
                    this.point.y = result;
                }
                if (isComplete) {
                    //每次走完，执行下一次路程
                    this.run.isRuning = false;
                    if (this.nextMove) {
                        //this.nextMove();
                        this.nextMove = null;
                    }
                }
            }
            if (this.troops === game.troops.scourge) {
                //天灾军团... 电脑玩家
                //保持直线前进，发生碰撞时转弯
                if (this.runingDirection === direction.R) {
                    this.moveR();
                }
                if (this.runingDirection === direction.L) {
                    this.moveL();
                }
                if (this.runingDirection === direction.U) {
                    this.moveU();
                }
                if (this.runingDirection === direction.D) {
                    this.moveD();
                }
                //发射子弹
                this.attack();
            }
            _super.prototype.draw.call(this, canvas);
        };
        tank.prototype.moveL = function () {
            if (this.run.isRuning) {
                this.nextMove = this.moveL;
                return;
            }
            this.rotate = 270;
            this.move(this.point.x, -this.run.speed, direction.L);
        };
        tank.prototype.moveR = function () {
            if (this.run.isRuning) {
                this.nextMove = this.moveR;
                return;
            }
            this.rotate = 90;
            this.move(this.point.x, this.run.speed, direction.R);
        };
        tank.prototype.moveU = function () {
            if (this.run.isRuning) {
                this.nextMove = this.moveU;
                return;
            }
            this.rotate = 0;
            this.move(this.point.y, -this.run.speed, direction.U);
        };
        tank.prototype.moveD = function () {
            if (this.run.isRuning) {
                this.nextMove = this.moveD;
                return;
            }
            this.rotate = 180;
            this.move(this.point.y, this.run.speed, direction.D);
        };
        tank.prototype.move = function (start, speed, direc) {
            this.run.startPoint = start;
            this.run.endPoint = start + speed;
            this.runingDirection = direc;
            var sourcePoint = common.simpleClone(this.point);
            if (this.runingDirection === direction.R || this.runingDirection === direction.L) {
                this.point.x = this.run.endPoint;
                console.log(this.point.x);
            }
            if (this.runingDirection === direction.U || this.runingDirection === direction.D) {
                this.point.y = this.run.endPoint;
                console.log(this.point.y);
            }
            if (game.scene.testOutBorderAndOverlap(this)) {
                this.point = sourcePoint;
                if (this.troops === game.troops.scourge) {
                    //天灾军团... 电脑玩家
                    this.runingDirection = [direction.U, direction.D, direction.R, direction.L][common.getRandomNum(1, 4) - 1];
                }
                return;
            }
            this.point = sourcePoint;
            this.run.startRunTime = +new Date();
            this.run.isRuning = true;
        };
        tank.prototype.attack = function () {
            if (+new Date() - this.lastAttackTime < this.attackIntervale) {
                return;
            }
            this.lastAttackTime = +new Date;
            var x, y;
            //计算子弹发射位置
            switch (this.runingDirection) {
                case direction.D:
                    x = this.point.x + this.point.width / 2 - game.config.missileWH / 2;
                    y = this.point.y + this.point.height;
                    break;
                case direction.U:
                    x = this.point.x + this.point.width / 2 - game.config.missileWH / 2;
                    y = this.point.y;
                    break;
                case direction.L:
                    x = this.point.x;
                    y = this.point.y + this.point.height / 2 - game.config.missileWH / 2;
                    break;
                case direction.R:
                    x = this.point.x + this.point.width;
                    y = this.point.y + this.point.height / 2 - game.config.missileWH / 2;
                    break;
            }
            game.scene.addSpirit(new game.missile(this.runingDirection, {
                height: game.config.missileWH,
                width: game.config.missileWH,
                x: x,
                y: y
            }));
        };
        return tank;
    })(game.spirit);
    game.tank = tank;
})(game || (game = {}));
