/*jslint vars: true*/
/*global define, brackets, console, $*/
define(function (require, exports, module) {
    'use strict';
    var CommandManager = brackets.getModule('command/CommandManager');
    var EditorManager = brackets.getModule('editor/EditorManager');
    var Menus = brackets.getModule('command/Menus');
    var Constants = require('src/Constants');
    
    var handler = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();

        if (selectedText) {
            var document = editor.document;
            var selection = editor.getSelection();

            var originalLine = document.getLine(selection.start.line);
            var lineText = originalLine.trimLeft();
            var numSpaces = originalLine.length - lineText.length;
            var indent = originalLine.substr(0, numSpaces);
            var newStart = {ch : 0, line : selection.start.line };

            var variableDeclaration = 'var extracted = ' + selectedText + ';\n';

            document.batchOperation(function () {
                document.replaceRange(indent + variableDeclaration, newStart);
                document.replaceRange('extracted', editor.getSelection().start, editor.getSelection().end);

                var cursorPos = {ch : numSpaces + 5, line : selection.start.line };
                editor.setCursorPos(cursorPos);
                CommandManager.execute('cmd.findAllAndSelect');
            });

        } else {
            editor.displayErrorMessageAtCursor('You must select text to extract');
        }
    };


    exports.registry = function () {
        CommandManager.register(Constants.VARIABLE_EXTRACT_ITEM_NAME, Constants.VARIABLE_EXTRACT_ITEM_ID, handler);
        Menus.getMenu('sdiawara.refactoring').addMenuItem(Constants.VARIABLE_EXTRACT_ITEM_ID, Constants.VARIABLE_EXTRACT_ITEM_SHORTCUT);
    };
});


