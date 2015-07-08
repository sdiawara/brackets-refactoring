/*jslint vars: true*/
/*global define, $, brackets, window*/

define(function (require, exports, module) {
    'use strict';
    var AppInit = brackets.getModule('utils/AppInit');
    var Menus = brackets.getModule('command/Menus');
    var Constants = require('src/Constants');
    
    Menus.addMenu(Constants.MENU_REFACTORING_NAME, Constants.MENU_REFACTORING_ID, Menus.BEFORE, 'debug-menu');
    
    var VariableExtractor = require('src/VariableExtractor');
    
    AppInit.appReady(function () {
        VariableExtractor.registry();
    });
});