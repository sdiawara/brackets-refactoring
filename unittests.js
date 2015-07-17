/*global define, $, brackets, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, runs, waitsFor, waitsForDone, waitsForFail*/
/*jslint vars:true*/

define(function (require, exports, module) {
    "use strict";
    var variableExtractor = require('src/VariableExtractor');
     
    describe('sdiawara.Refactoring', function () {
        var ERROR_MESSAGE = 'Can not perform refactoring\nSelected block should represent expression';
        var declarationLine;
        var declarationLineWithParameters;
        var tryExtract = function (declarationLine, toExtract) {
            try {
                variableExtractor.extract(declarationLine, toExtract);
            } catch (error) {
                return error;
            }
        };
        
        beforeEach(function () {
            declarationLine = 'var variable = toto.getTata();';
            declarationLineWithParameters = 'var variable = toto.getTata(coucou.hello.toc);';
        });
        
        it('extract variabe used to call function', function () {
            var lineAfterExtract = variableExtractor.extract(declarationLine, 'toto');
            
            expect(lineAfterExtract).toBe('var variable = extracted.getTata();');
        });
        
        it('extract function call', function () {
            var lineAfterExtract = variableExtractor.extract(declarationLine, 'toto.getTata');
            
            expect(lineAfterExtract).toBe('var variable = extracted;');
        });
                
        it('extract variable in chained expression', function () {
            var lineAfterExtract = variableExtractor.extract(declarationLineWithParameters, 'hello');
            
            expect(lineAfterExtract).toBe('var variable = toto.getTata(extracted.toc);');
        });
        
        it('cant not extract declaration of variable', function () {
            var message = tryExtract(declarationLine, 'variable');
            
            expect(message).toBe(ERROR_MESSAGE);
        });
        
        it('cant not split in bad expression', function () {
            var message = tryExtract(declarationLine, 'to.get');
            
            expect(message).toBe(ERROR_MESSAGE);
        });
        
        it('cant not split in bad expression', function () {
            var message = tryExtract(declarationLine, 'toto.get');
            
            expect(message).toBe(ERROR_MESSAGE);
        });
    });
});