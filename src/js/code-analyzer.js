import * as esprima from 'esprima';

const tableRowData = (c1, c2, c3, c4, c5) => ({c1: c1,c2: c2,c3: c3,c4: c4,c5: c5});
const tableRowsData = [];

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

const createTableData = (codeToParse) => {
    tableRowsData.length = 0;
    let parsed = esprima.parseScript(codeToParse,{loc:true});
    createTableEntry(parsed);
    return tableRowsData;
};

const createTableEntry = (json) => {
    let handler = typeHandlers.get(json.type);
    return handler ? handler.call(undefined, json) : null;
};

//------------ Statement Handlers -------------
const handleFuncDec = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,json.id.name,'','');
    tableRowsData.push(entry);
    json.params.forEach(function(param) {
        let pEntry = tableRowData(param.loc.start.line,param.type,param.name,'','');
        tableRowsData.push(pEntry);
    });
    createTableEntry(json.body);
};

const handleVarDec = (json) => {
    json.declarations.forEach((dec) => {
        let entry;
        if(dec.init != null)
            entry = tableRowData(dec.loc.start.line,json.type,dec.id.name,'', handleExp(dec.init));
        else
            entry = tableRowData(dec.loc.start.line,json.type,dec.id.name,'', '');
        tableRowsData.push(entry);
    });
};

const handleBlock = (json) => {
    json.body.forEach(createTableEntry);
};

const handleExpStatement = (json) => {
    createTableEntry(json.expression);
};

const handleAssExp = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,handleExp(json.left),'',handleExp(json.right));
    tableRowsData.push(entry);
};

const handleWhile = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,'',handleExp(json.test),'');
    tableRowsData.push(entry);
    createTableEntry(json.body);
};

const handleIf = (json) =>{
    let entry = tableRowData(json.loc.start.line,json.type,'',handleExp(json.test),'');
    tableRowsData.push(entry);
    createTableEntry(json.consequent);
    createTableEntry(json.alternate);
};

const handleReturn = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,'','',handleExp(json.argument));
    tableRowsData.push(entry);
};

const handleFor = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,'',handleExp(json.test),'');//update the test n shit
    tableRowsData.push(entry);
    if(json.init != null)
        createTableEntry(json.init);
    if(json.update != null)
        createTableEntry(json.update);
    createTableEntry(json.body);
};

const handleUpdate = (json) => {
    let entry = tableRowData(json.loc.start.line,json.type,handleExp(json.argument),'',json.prefix ? json.operator + handleExp(json.argument) : handleExp(json.argument) + json.operator);
    tableRowsData.push(entry);
};

const handleSeq = (json) => {
    json.expressions.forEach(createTableEntry);
};

const handleExp = (exp) => {
    let handler = expHandlers.get(exp.type);
    return handler.call(undefined, exp);//return handler ? handler.call(undefined, exp) : null;
};

//-----------------Expression Handlers-------------------
const handleIdentifier = (exp) => { return exp.name; };
const handleLiteral = (exp) => { return exp.value; };
const handleBinaryExpression = (exp) => { return ((exp.left.type == 'BinaryExpression' ? ('(' + (handleExp(exp.left)) + ')') : (handleExp(exp.left))) + ' ' + exp.operator + ' ' + (exp.right.type == 'BinaryExpression' ? ('(' + (handleExp(exp.right)) + ')') : (handleExp(exp.right)))); };
const handleUnaryExpression = (exp) => { return (exp.operator + handleExp(exp.argument)); };
const handleMemberExpression = (exp) => { return (handleExp(exp.object) + '[' + handleExp(exp.property) + ']'); };
const handleLogicalExpression = (exp) => { return (handleExp(exp.left) + ' ' + exp.operator + ' ' + handleExp(exp.right)); };

const typeHandlers = new Map([
    ['Program',handleBlock],
    ['FunctionDeclaration',handleFuncDec],
    ['VariableDeclaration',handleVarDec],
    ['BlockStatement',handleBlock],
    ['ExpressionStatement',handleExpStatement],
    ['AssignmentExpression',handleAssExp],
    ['WhileStatement',handleWhile],
    ['IfStatement',handleIf],
    ['ReturnStatement',handleReturn],
    ['ForStatement',handleFor],
    ['UpdateExpression',handleUpdate],
    ['SequenceExpression',handleSeq]
]);

const expHandlers = new Map([
    ['Identifier', handleIdentifier],
    ['Literal', handleLiteral],
    ['BinaryExpression', handleBinaryExpression],
    ['UnaryExpression', handleUnaryExpression],
    ['MemberExpression', handleMemberExpression],
    ['LogicalExpression',handleLogicalExpression]
]);

export {parseCode, createTableData};
