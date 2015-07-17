/*jslint vars: true*/
/*global define, brackets, console, $*/
define(function (require, exports, module) {
    'use strict';
    var CommandManager = brackets.getModule('command/CommandManager');
    var EditorManager = brackets.getModule('editor/EditorManager');
    
    function assertNotEmpty(text) {
        if (!text) {
            throw 'You must select variable to extract';
        }
    }
    
    function assertNotVariableDeclaration(text) {
        if (/([\w\s]*)=([\w\s]*)/.test(text)) {
            throw 'Declaration can not extract in variable';
        }
    }
    
    function assertNotStartOrEndWithDot(text) {
        if (/^\./.test(text) || /\.$/.test(text)) {
            throw 'Variable can not start or end with dot';
        }
    }
    
    function extract(line, text) {
        var textToReplace = text;
        var indexOfText = line.indexOf(text);
        var indexOfEqual = line.indexOf('=');
    
        if (indexOfEqual > indexOfText) {
            throw 'Can not perform refactoring\nSelected block should represent expression';
        }
        
        if (/\w/.test(line.charAt(indexOfText - 1)) || /\w/.test(line.charAt(indexOfText + text.length))) {
            throw 'Can not perform refactoring\nSelected block should represent expression';
        }

        var restOfExpression = line.substring(indexOfText + text.length, line.length);

        if (/^\(\w*\);$/.test(restOfExpression)) {
            textToReplace = textToReplace + restOfExpression;
            textToReplace = textToReplace.replace(';', '');
        }
        
        if (/\./.test(line.charAt(indexOfText - 1))) {
            var words = line.split(/(\.|\()/).reverse();
            var index;
            var replacement = text;
            for (index = words.indexOf(text) + 1; index < words.length; index = index + 2) {
                if (words[index] === '.') {
                    replacement = words[index + 1] + '.' + replacement;
                } else {
                    break;
                }
            }
            textToReplace = replacement;
        }

        return line.replace(textToReplace, 'extracted');
    }
    
    exports.extract = extract;
    
    exports.getHandler = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        
        try {
            assertNotEmpty(selectedText);
            assertNotVariableDeclaration(selectedText);
            assertNotStartOrEndWithDot(selectedText);
        } catch (exception) {
            editor.displayErrorMessageAtCursor(exception);
            return;
        }
        
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
    };
});


