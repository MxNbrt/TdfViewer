angular.module('myApp', [
    'consts',
    'fileUtils',
    'dx'
])

.controller('myCtrl', function ($scope) {
    var currentFile = '';
    $scope.selectBoxInstance = {};
    $scope.boGridInstance = {};

    $scope.fileUploaderOptions = getInitialFileUploaderOptions(fileUploaded);
    $scope.selectBoxOptions = getInitialSelectBoxOptions(selectionChanged, selectBoxInitialized);
    $scope.downloadButtonOptions = getInitialDownloadButtonOptions(downloadButtonClick);
    $scope.dataGridOptions = getInitialDataGridOptions(dataGridInitialized);

    function selectionChanged(e) {
      $scope.boGridInstance.option('dataSource', e.selectedItem.datasets);
    };

    function selectBoxInitialized(e) {
      $scope.selectBoxInstance = e.component;
    };

    function dataGridInitialized(e) {
      $scope.boGridInstance = e.component;
    };

    function downloadButtonClick(e) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('test maxi content'));
      element.setAttribute('download', currentFile);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    function fileUploaded(files) {
      if (files.value[0] === null)
        return;

      currentFile = files.value[0].name;

      const reader = new FileReader()
      reader.onload = result => {
        $scope.selectBoxInstance.reset();
        $scope.businessObjects = readFile(currentFile, result.target.result);
        $scope.selectBoxInstance.option('disabled', false);
      };
      reader.onerror = error => console.log(error)

      reader.readAsText(files.value[0]);
    }

    $scope.businessObjects = readFile('test.tdf', getExampleTdf);
  });