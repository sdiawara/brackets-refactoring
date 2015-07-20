/*global define, brackets, console, $*/
define(function (require, exports, module) {
    'use strict';
    this.EString = function (sentence) {
        this.sentence = sentence;
    };

    this.EString.prototype.wordAt = function (position) {
        var separator = /(\s|\.)/,
            words = this.sentence.split(separator),
            tmp = '',
            wordsPosition = -1,
            matchedWord;

        while (tmp.length <= position) {
            wordsPosition += 1;
            tmp += words[wordsPosition];
        }

        matchedWord = words[wordsPosition];
        return separator.test(matchedWord) ? null : matchedWord;
    };
});
