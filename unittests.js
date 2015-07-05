/*global define, describe, it, expect*/

define(function (require, exports, module) {
    "use strict";

    var main = require("main");

    describe('sdiawara.Refactoring extension', function () {

        it('should expose a extractVariable method', function () {
            expect(main.extractVariable).not.toBeNull();
        });
    });
});