var game;
(function (game) {
    //游戏场景
    var playing = (function () {
        function playing(canvas) {
            var _this = this;
            //Spirits
            this.spirits = [];
            //添加Spirit
            this.addSpirit = function (spirit) {
                _this.spirits.push(spirit);
            };
            //删除Spirit
            this.removeSpirit = function (spirit) {
                _this.spirits.filter(function (value) {
                    if (value.id === spirit.id) {
                        return false;
                    }
                    return true;
                });
            };
            //添加事件
            this.addEventListener = function (name, handler) {
                switch (name) {
                }
            };
            this.fps = 10000 / 60;
            this.lasttime = new Date();
            this.canvas = canvas;
        }
        return playing;
    })();
    game.playing = playing;
})(game || (game = {}));