var app = angular.module('tdfViewer', [
    'consts',
    'fileUtils',
    'dx',
    'ngRoute',
    'fileViewer'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/viewFileViewer', {
        templateUrl: '/app/viewFileViewer/viewFileViewer.html',
        controller: 'CtrlFileViewer'
    });
}]);  

app.controller('CtrlMain', function ($scope) {
    var currentFile = '';
    $scope.selectBoxInstance = {};
    $scope.boGridInstance = {};

    $scope.fileUploaderOptions = getInitialFileUploaderOptions(fileUploaded);
    $scope.selectBoxOptions = getInitialSelectBoxOptions(selectionChanged, selectBoxInitialized);
    $scope.downloadButtonOptions = getInitialDownloadButtonOptions(downloadButtonClick);
    $scope.dataGridOptions = getInitialDataGridOptions(dataGridInitialized);

    function saveGridData(selectBoxValue) {
        if (selectBoxValue === null) {
            return;
        }

        var data = [];
        _.forEach($scope.boGridInstance.option('dataSource'), function (value) {
            data.push(_.toString(_.values(value)));
        });
        selectBoxValue.DATA.DR = data;
    }

    function selectionChanged(e) {
        if (e.previousValue !== null) {
            saveGridData(e.previousValue);
        }

        var columns = e.value.COLUMNS.split(',');
        var data = e.value.DATA.DR;
        
        var gridData = [];
        // if data is array, iterate children
        if (_.isArray(data))
        {
            _.forEach(data, function(value) {
                var datarow = value.match(/\w+|"[^"]+"/g);
                gridData.push(_.zipObject(columns, datarow));
            });
        }
        // if data is string, split string
        else 
        {
            gridData.push(_.zipObject(columns, data.split(',')));
        }

        $scope.boGridInstance.option('dataSource', gridData);
        $scope.boGridInstance.option('columns', columns);
    }

    function selectBoxInitialized(e) {
        $scope.selectBoxInstance = e.component;
    }

    function dataGridInitialized(e) {
        $scope.boGridInstance = e.component;
    }

    function downloadButtonClick(e) {
        saveGridData($scope.selectBoxInstance.option('value'))
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
            encodeURIComponent(exportFile(currentFile, $scope.businessObjects)));
        element.setAttribute('download', currentFile);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function fileUploaded(files) {
        if (files.value[0] === null) {
            return;
        }

        currentFile = files.value[0].name;

        const reader = new FileReader();
        reader.onload = result => {
            $scope.selectBoxInstance.reset();
            $scope.businessObjects = readFile(currentFile, result.target.result);
            $scope.selectBoxInstance.option('disabled', false);
        };
        reader.onerror = error => console.log(error);

        reader.readAsText(files.value[0]);
    }

    $scope.businessObjects = readFile('test.tdf', exampleTdf);
});