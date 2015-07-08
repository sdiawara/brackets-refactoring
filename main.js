/*global define, $, brackets, window*/

define(function (require, exports, module) {
    'use strict';
    var AppInit         = brackets.getModule('utils/AppInit'),
        Constants = require('src/Constants'),
        VariableExtractor = require('src/VariableExtractor'),
        MenuRefactoring = require('src/MenuRefactoring');

    AppInit.appReady(function () {
        MenuRefactoring.register();
        
        MenuRefactoring.addItem(Constants.VARIABLE_EXTRACT_ITEM_NAME, Constants.VARIABLE_EXTRACT_ITEM_ID, Constants.VARIABLE_EXTRACT_ITEM_SHORTCUT, VariableExtractor.getHandler);
    });
});