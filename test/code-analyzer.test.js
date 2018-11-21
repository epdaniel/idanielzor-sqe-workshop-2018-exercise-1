import assert from 'assert';
import {parseCode, createTableData} from '../src/js/code-analyzer';
//import {displayTable} from '../src/js/app';


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
    it('is handling a variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('let a = 1;')),
            '[{"c1":1,"c2":"VariableDeclaration","c3":"a","c4":"","c5":1}]'
        );
    });
    it('is handling a variable declaration with no init correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('let b;')),
            '[{"c1":1,"c2":"VariableDeclaration","c3":"b","c4":"","c5":""}]'
        );
    });
    it('is handling a function declaration correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('function funcName(a){\n' +
                '    return -a;\n' +
                '}')),
            '[{"c1":1,"c2":"FunctionDeclaration","c3":"funcName","c4":"","c5":""},{"c1":1,"c2":"Identifier","c3":"a","c4":"","c5":""},{"c1":2,"c2":"ReturnStatement","c3":"","c4":"","c5":"-a"}]'
        );
    });
    it('is handling a while statement correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('while(a > b)\n' +
                '    a = a - 1;')),
            '[{"c1":1,"c2":"WhileStatement","c3":"","c4":"a > b","c5":""},{"c1":2,"c2":"AssignmentExpression","c3":"a","c4":"","c5":"a - 1"}]'
        );
    });
    it('is handling a for statement correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('for(let i = 1; i < n && i != 0 ; i++, n--)\n' +
                '    a = 2;')),
            '[{"c1":1,"c2":"ForStatement","c3":"","c4":"i < n && i != 0","c5":""},{"c1":1,"c2":"VariableDeclaration","c3":"i","c4":"","c5":1},{"c1":1,"c2":"UpdateExpression","c3":"i","c4":"","c5":"i++"},{"c1":1,"c2":"UpdateExpression","c3":"n","c4":"","c5":"n--"},{"c1":2,"c2":"AssignmentExpression","c3":"a","c4":"","c5":2}]'
        );
    });
    it('is handling a for statement with no init and update, correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('for(; i<n; ){\n' +
                '    a++;\n' +
                '}')),
            '[{"c1":1,"c2":"ForStatement","c3":"","c4":"i < n","c5":""},{"c1":2,"c2":"UpdateExpression","c3":"a","c4":"","c5":"a++"}]'
        );
    });
    it('is handling an if statement correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('if( a > b )\n' +
                '    arr[mid]=0;\n' +
                'else\n' +
                '    arr[mid]--;')),
            '[{"c1":1,"c2":"IfStatement","c3":"","c4":"a > b","c5":""},{"c1":2,"c2":"AssignmentExpression","c3":"arr[mid]","c4":"","c5":0},{"c1":4,"c2":"UpdateExpression","c3":"arr[mid]","c4":"","c5":"arr[mid]--"}]'
        );
    });
    it('is handling an incorrect input correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('badInput')),
            '[]'
        );
    });
    it('is handling an update expression with prefix correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('--a;')),
            '[{"c1":1,"c2":"UpdateExpression","c3":"a","c4":"","c5":"--a"}]'
        );
    });
    it('is handling a binary expression with nested binary expressions correctly', () => {
        assert.equal(
            JSON.stringify(createTableData('a = (mid - 1) / (n - 2);')),
            '[{"c1":1,"c2":"AssignmentExpression","c3":"a","c4":"","c5":"(mid - 1) / (n - 2)"}]'
        );
    });
});