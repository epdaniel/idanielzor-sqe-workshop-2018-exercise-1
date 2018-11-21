import $ from 'jquery';
import {parseCode, createTableData} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let tableData = createTableData(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        displayTable(tableData);
    });
});

const displayTable = (tableData) => {
    let body = document.getElementById('tableBody');
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    tableData.forEach((tableRow) => {
        let row = createRow(tableRow);
        body.appendChild(row);
    });
    return tableData;
};

const createRow = (tableRow) => {
    let row = document.createElement('tr');
    for (let column in tableRow) {
        if (tableRow.hasOwnProperty(column)) {
            let cell = row.insertCell();
            cell.innerHTML = tableRow[column];
        }
    }
    return row;
};

export {displayTable};