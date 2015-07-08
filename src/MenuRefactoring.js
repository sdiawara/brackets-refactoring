/*global define, brackets, console, $*/
define(function (require, exports, module) {
    'use strict';
    var CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        Constants = require('src/Constants');
    
    exports.addItem = function (itemName, itemId, shortcut, handler) {
        CommandManager.register(itemName, itemId, handler);
        Menus.getMenu(Constants.MENU_REFACTORING_ID).addMenuItem(itemId, shortcut);
    };

    exports.register = function () {
        Menus.addMenu(Constants.MENU_REFACTORING_NAME, Constants.MENU_REFACTORING_ID, Menus.BEFORE, 'debug-menu');
    };
});