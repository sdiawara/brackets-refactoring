/*global define, brackets, console, $*/
define(function (require, exports, module) {
    'use strict';
    
    var VariableInliner = function () {
        this.CommandManager = brackets.getModule('command/CommandManager');
        this.EditorManager = brackets.getModule('editor/EditorManager');
        this.Menus = brackets.getModule('command/Menus');
        this.id = 'sdiawara.menu.VariableInliner';
        this.label = "Inline variable";
        this.shortcut = "Ctrl-Alt-I";
    };
    
    VariableInliner.prototype.getHandler = function () {
        console.log(this.label);
    };
    
    VariableInliner.prototype.registry = function () {
        this.CommandManager.register(this.label, this.id, this.getHandler);
        this.Menus.getMenu('sdiawara.refactoring').addMenuItem(this.id, this.shortcut);
    };
    
    exports.registry = function () {
        new VariableInliner().registry();
    };
});