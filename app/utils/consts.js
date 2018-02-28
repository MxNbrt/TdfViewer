angular.module('consts', []);

function getInitialFileUploaderOptions(fileUploadedFunction) {
    return {
        bindingOptions: {
            uploadMode: 'instantly',
            showFileList: true,
            selectButtonText: '"Datei hochladen"',
            labelText: ''
        },
        onOptionChanged: fileUploadedFunction
    };
}

function getInitialSelectBoxOptions(selectionChangedFunction, initializedFunction) {
    return {
        bindingOptions: {
            dataSource: 'businessObjects'
        },
        displayExpr: '_OBJECTID',
        disabled: false,
        placeholder: 'BusinessObjekt auswählen',
        onValueChanged: selectionChangedFunction,
        onInitialized: initializedFunction
    };
}

function getInitialDownloadButtonOptions(clickFunction) {
    return {
        text: 'Herunterladen',
        onClick: clickFunction
    };
}

function getInitialDataGridOptions(initializedFunction) {
    return {
        dataSource: [],
        columnAutoWidth: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        searchPanel: {
            visible: true
        },
        filterRow: {
            visible: true
        },
        noDataText: 'Bitte laden Sie eine Datei hoch und wählen ein BusinessObjekt aus.',
        scrolling: {
            showScrollbar: 'always'
        },
        columnChooser: {
            enabled: true,
            mode: 'select',
            title: 'Spaltenauswahl',
            emptyPanelText: 'BusinessObjekt auswählen'
        },
        editing: {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
            mode: 'cell'
        },
        onInitialized: initializedFunction
    };
}

function getX2Js() {
    return new X2JS({
        keepCData : true,
        emptyNodeForm : 'object',
        skipEmptyTextNodesForObj : false,
        stripWhitespaces : false,
        escapeMode : false
    });
}

var exampleTdf =
    '<?xml version="1.0" encoding="ISO-8859-1"?>' +
    '<TDF>' +

    '<TRANSFER OBJECTID="BdQueryGroup">' +
    '<OPTIONS MODE="2" COMMITCOUNT="0"/>' +
    '<COLUMNS>QueryGroupId,ShortDesc,Description,ParentGroup</COLUMNS>' +
    '<DATA>' +
    '<DR>"61FASTPVQA35","Umlagen",null,"53V9MYPUSE4C"</DR>' +
    '<DR>"69R9LJSA11J3","Kennzahlen",null,"53V9MYPUSE4C"</DR>' +
    '</DATA>' +
    '</TRANSFER>' +

    '<TRANSFER OBJECTID="BdQuery">' +
    '<OPTIONS MODE="2" COMMITCOUNT="0"/>' +
    '<COLUMNS>QueryId,ShortDesc,Description,AppArea,CompanyId,UserId,QueryGroupId,PropPlugInId,PropSearchId,DataViewId,PlugInId,PlugInName,UserDefined,VersionNumber,ControllerId,ViewId,PreDefineByCompany,SkipUserSearchDef</COLUMNS>' +
    '<DATA>' +
    '<DR>"59MAH6FSDA9U","Umlage","Umlage","CS",null,null,"61FASTPVQA35","59MAH6CAMVB7","59MAH6E9NW58","59MAHYWXA45L",null,"CtrBdQueryPlugInExcel",false,"1.0",null,null,null,null</DR>' +
    '<DR>"59MFJI55FB58","Kennzahlen","Kennzahlen","CS",null,null,"69R9LJSA11J3","59MFJIDEDITO","59MFJITNVGGZ","59MFJ2NKE3VU",null,"CtrBdQueryPlugInExcel",false,"1.0",null,null,null,null</DR>' +
    '</DATA>' +
    '</TRANSFER>' +

    '<TRANSFER OBJECTID="BdQueryCustom">' +
    '<OPTIONS MODE="3" COMMITCOUNT="0"/>' +
    '<COLUMNS>QueryId,ShortDesc,IsActive</COLUMNS>' +
    '<DATA>' +
    '<DR>"59MAH6FSDA9U",null,true</DR>' +
    '<DR>"59MFJI55FB58",null,true</DR>' +
    '</DATA>' +
    '</TRANSFER>' +

    '</TDF>';