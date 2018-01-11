angular.module('myApp', [
  'ngRoute',
  'dx'
])

.controller('myCtrl', function ($scope) {
  var currentFile = '';
  $scope.accept = ".tdf,.tmf,.tsf,.xml";
  $scope.buttonText = "Datei hochladen";

  $scope.fileUploaderOptions = {
    bindingOptions: {
      multiple: false,
      accept: "accept",
      uploadMode: "instantly",
      showFileList: false,
      selectButtonText: "buttonText",
      labelText: ""
    }
  };

  $scope.selectBoxOptions = { 
    bindingOptions: { 
      dataSource: 'businessObjects' 
    }, 
    displayExpr: 'objectId', 
    placeholder: 'BusinessObject auswählen'
  };

  $scope.downloadButtonOptions = {
    text: 'Herunterladen',
    onClick: downloadButtonClick
  };

  function downloadButtonClick() {

  }

  function fileUploaded(event1) {
    const reader = new FileReader()
    reader.onload = event2 => 
      processFile(event2.target.result);
    reader.onerror = error => alert(error)

    currentFile = event1.target.files[0].name;
    reader.readAsText(event1.target.files[0]);
  }

  function processFile(file) {
    var xmlDoc = new DOMParser().parseFromString(file,"text/xml").childNodes[0];
    var fileExtension = currentFile.split('.').pop().toLowerCase();
    switch(fileExtension) {
      case 'tdf':
      case 'tmf':
        readTdfFile(xmlDoc);
        break;
      default:
          alert('Das Dateiformat ' + fileExtension + 'wird aktuell nicht unterstützt')
    }
  }

  function readTdfFile(xmlNode) {
    
    var BOCollection = [];
    $scope.businessObjects = [];

    for (let i = 0; i < xmlNode.childNodes.length; i++) {
      const BOElement = xmlNode.childNodes[i];
      if (BOElement.nodeName.toLowerCase() !== 'transfer')
        continue;
      
      var currentBO = {};
      var currentColumns;
      
      for (let j = 0; j < BOElement.attributes.length; j++) {
        const BOAttribute = BOElement.attributes[j];
        if (BOAttribute.name.toLowerCase() !== 'objectid')
          continue;

        currentBO.objectId = BOAttribute.nodeValue;
      }

      for (let k = 0; k < BOElement.childNodes.length; k++) {
        const childElement = BOElement.childNodes[k];
        switch (childElement.nodeName.toLowerCase()) {
          case 'columns':
          currentColumns = _.split(childElement.innerText, ',');
            break;
          case 'data':
              
            break;
        }
      }

      BOCollection.push(currentBO);
    }

    // todo befüllen mit stringlist der obejctids (mit lodash)
    $scope.businessObjects = [];
    document.getElementById('output').innerHTML = 'fertig';
  }

  currentFile = 'test.tdf';
  processFile('<?xml version="1.0" encoding="ISO-8859-1"?><TDF LANGUAGE="D"><TRANSFER OBJECTID="FsEbaRulePart"><COLUMNS>_CID,_CGID,PartId,RuleId,SearchType,OISearchKind,OISignificants,OIPosFrom,OIPosTo,OILessPercent,SearchExpr,StmtField,OIField,CompareValue,_CreateUser,_CreateDate,_ModifyUser,_ModifyDate</COLUMNS><DATA><DR>"~","~","RSDNWHETSJIRDA","RSDNWHESWIPFDQ","V",2,3,null,null,null,"~~","PurposeCombined","Desc2",null,"cobra",2018-01-05 13:37:32,"cobra",2018-01-05 13:37:32</DR><DR>"~","~","RSDNWHILNFFHZR","RSDNWHESWIPFDQ","V",0,null,null,null,null,"&#x3C;=","Amount","ActOIAmountIC",null,"cobra",2018-01-05 13:39:11,null,null</DR></DATA></TRANSFER></TDF>');


  //Bind upload event to dxfileuploader
  document.getElementById('fileUploader').addEventListener('change', fileUploaded, false);
});