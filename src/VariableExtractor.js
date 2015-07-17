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

        if (/\./.test(line.charAt(indexOfText - 1))) {
            var words = line.split(/(\.|\(|\s)/).reverse();
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
        
        indexOfText = line.indexOf(textToReplace);
        var restOfExpression = line.substring(indexOfText + textToReplace.length, line.length);

        if (/^\([\w\W]*\);$/.test(restOfExpression)) {
            textToReplace = textToReplace + restOfExpression;
            textToReplace = textToReplace.replace(';', '');
        }

        return { declaration :  'var extracted = ' + textToReplace + ';', newLine :  line.replace(textToReplace, 'extracted')};
    }
    
    exports.extract = extract;
    
    exports.getHandler = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        var selection = editor.getSelection();
        var document = editor.document;

        var originalLine = document.getLine(selection.start.line);
        var numSpaces = originalLine.length - originalLine.trimLeft().length;

        var extraction;
        try {
            extraction = extract(originalLine, selectedText);
        } catch (exception) {
            editor.displayErrorMessageAtCursor(exception);
            return;
        }

        var newStart = {ch : numSpaces, line : selection.start.line };
        document.batchOperation(function () {
            console.log(extraction.declaration);
            document.replaceRange(extraction.declaration + '\n', newStart);
            document.replaceRange(extraction.newLine + '\n', {ch : 0, line : editor.getSelection().start.line}, {ch : originalLine.length, line : editor.getSelection().start.line});

            var cursorPos = {ch : numSpaces + 5, line : selection.start.line };
            editor.setCursorPos(cursorPos);
            CommandManager.execute('cmd.findAllAndSelect');
        });
    };
});