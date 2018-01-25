angular.module('fileUtils', []);

function readFile(filename, filecontent) {
    var x2js = new X2JS({
        keepCData : true
    });
    var document = x2js.xml2js(filecontent);

    var fileExtension = filename.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'tdf':
        case 'tmf':
            // cast to make sure its an array
            return _.castArray(document.TDF.TRANSFER);
        default:
            alert('Das Dateiformat ' + fileExtension + 'wird aktuell nicht unterstützt')
    }
};

function exportFile(filename, BOCollection) {
    var fileExtension = filename.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'tdf':
            return exportTdfFile(BOCollection, true);
            break;
        case 'tmf':
            return exportTdfFile(BOCollection, false);
            break;
    }
};