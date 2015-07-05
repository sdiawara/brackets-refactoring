/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window*/

define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule('command/CommandManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        Dialogs = brackets.getModule('widgets/Dialogs'),
        Menus          = brackets.getModule('command/Menus');
    
 
    console.log(CommandManager.getAll());
    var MENU_ID = 'sdiawara.refactoring';
    var MENU_NAME = 'Refactoring';
    var menuRefactoring = Menus.addMenu(MENU_NAME, MENU_ID, Menus.BEFORE, 'debug-menu');

    function extractVariable() {
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
    }
    
    var EXTRACT_VARIBALE_COMMAND = 'sdiawara.refactoring.extract_variable';
    CommandManager.register("Extract variable", EXTRACT_VARIBALE_COMMAND, extractVariable);

    var menu = Menus.getMenu(MENU_ID);
    
    menu.addMenuItem(EXTRACT_VARIBALE_COMMAND, "Ctrl-Alt-V");
    
    exports.extractVariable = extractVariable;
});