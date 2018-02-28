angular.module('fileUtils', [
    'consts'
]);

function readFile(filename, filecontent) {
    var document = getX2Js().xml2js(filecontent);

    var fileExtension = filename.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'tdf':
        case 'tmf':
            // cast to make sure its an array
            return _.castArray(document.TDF.TRANSFER);
        case 'xml':
            return '';
        default:
            alert('Das Dateiformat ' + fileExtension + 'wird aktuell nicht unterstützt');
    }
}

function exportFile(filename, BOCollection) {
    var document = {'TDF': {'TRANSFER': BOCollection}};
    var bos = getX2Js().js2xml(document);

    var fileExtension = filename.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'tdf':
        case 'tmf':
            return bos;
    }
}