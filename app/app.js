angular.module('myApp', [
  'fileUtils',
  'ngRoute',
  'dx'
])

.controller('myCtrl', function ($scope) {
  var currentFile = '';

  $scope.fileUploaderOptions = {
    bindingOptions: {
      multiple: false,
      uploadMode: "instantly",
      showFileList: false,
      selectButtonText: '"Datei hochladen"',
      labelText: ""
    }
  };

  $scope.selectBoxOptions = { 
    bindingOptions: { 
      dataSource: 'businessObjects' 
    }, 
    displayExpr: 'objectId', 
    placeholder: 'BusinessObject auswählen',
    onSelectionChanged: selectionChanged
  };

  $scope.downloadButtonOptions = {
    text: 'Herunterladen',
    onClick: downloadButtonClick
  };

  function selectionChanged(e) {
    $scope.dataGridOptions = {
      dataSource: e.selectedItem.datasets
    };
  }

  function downloadButtonClick() {
    alert('downloadclick');
  }

  function fileUploaded(files) {
    currentFile = files.target.files[0].name;

    const reader = new FileReader()
    reader.onload = result => $scope.businessObjects = processFile(currentFile, result.target.result);
    reader.onerror = error => alert(error)

    reader.readAsText(files.target.files[0]);
  }
  
  // $scope.businessObjects = processFile('test.tdf', '<?xml version="1.0" encoding="ISO-8859-1"?><TDF LANGUAGE="D">'+
  // '<TRANSFER OBJECTID="FsEbaRulePart"><COLUMNS>_CID,_CGID,PartId,RuleId,SearchType,OISearchKind,OISignificants,OIPosFrom,'+
  // 'OIPosTo,OILessPercent,SearchExpr,StmtField,OIField,CompareValue,_CreateUser,_CreateDate,_ModifyUser,_ModifyDate</COLUMNS>'+
  // '<DATA><DR>"~","~","RSDNWHETSJIRDA","RSDNWHESWIPFDQ","V",2,3,null,null,null,"~~","PurposeCombined","Desc2",null,"cobra",'+
  // '2018-01-05 13:37:32,"cobra",2018-01-05 13:37:32</DR><DR>"~","~","RSDNWHILNFFHZR","RSDNWHESWIPFDQ","V",0,null,null,null,'+
  // 'null,"&#x3C;=","Amount","ActOIAmountIC",null,"cobra",2018-01-05 13:39:11,null,null</DR></DATA></TRANSFER></TDF>');

  //Bind upload event to dxfileuploader
  document.getElementById('fileUploader').addEventListener('change', fileUploaded, false);
});