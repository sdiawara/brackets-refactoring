/*global define, $, brackets, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, runs, waitsFor, waitsForDone, waitsForFail, xit */

define(function (require, exports, module) {
    "use strict";
    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils");
    
    beforeFirst(function () {
        SpecRunnerUtils.createTestWindowAndRun(this, function (w) {
            // see. src/brackets.js#_initTest
            // https://github.com/adobe/brackets/blob/master/src/brackets.js#L147
            var t = w.brackets.test,
                req = t.ExtensionLoader.getRequireContextForExtension("brackets-refactoring");

            this.PM = t.ProjectManager;
            this.DM = t.DocumentManager;
            this.Menus = require('Menus');
            this.target = req("main");
        });
    });

    afterLast(function () {
        SpecRunnerUtils.closeTestWindow();
    });
 
    describe('sdiawara.Refactoring', function () {
        it('should expose a extractVariable method', function () {
            expect(this.target.extractVariable).not.toBeNull();
        });
        
        it('should have menu inline.variable', function () {
            expect(this.Menus.getMenu('inline.variable')).not.toBeNull();
            expect(this.Menus.getMenu('inline.variable')).not.toBe(undefined);
        });
    });
});