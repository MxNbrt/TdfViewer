angular.module('fileUtils', []);

function readFile(filename, filecontent) {
    var xmlDoc = new DOMParser().parseFromString(filecontent, "text/xml").childNodes[0];
    var fileExtension = filename.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'tdf':
        case 'tmf':
            return readTdfFile(xmlDoc);
            break;
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

function exportTdfFile(BOCollection, isTdf) {
    var xmlString = isTdf ? '<TDF></TDF>' : '<TMF></TMF>';

    var xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
    var rootElement = xmlDoc.getElementsByTagName(isTdf ? 'TDF' : 'TMF')[0];

    // <TRANSFER OBJECTID="BdQueryGroup">
    //     <OPTIONS MODE="2" COMMITCOUNT="0" />
    //     <COLUMNS>QueryGroupId,ShortDesc,Description,ParentGroup</COLUMNS>
    //     <DATA>
    //         <DR>"61FASTPVQA35","Umlagen",null,"53V9MYPUSE4C"</DR>
    //         <DR>"69R9LJSA11J3","Kennzahlen",null,"53V9MYPUSE4C"</DR>
    //     </DATA>
    // </TRANSFER>

    BOCollection.forEach(bo => {
        var boNode = xmlDoc.createElement("TRANSFER");
        boNode.setAttribute("OBJECTID", bo.objectId);
        rootElement.appendChild(boNode);

        var columnNode = xmlDoc.createElement("COLUMNS");
        columnNode.textContent = getDataText(bo.datasets[0], true);
        boNode.appendChild(columnNode);

        var dataNode = xmlDoc.createElement('DATA');
        boNode.appendChild(dataNode);

        bo.datasets.forEach(dataset => {
            var dataRowNode = xmlDoc.createElement('DR');
            dataRowNode.textContent = getDataText(dataset, false);
            dataNode.appendChild(dataRowNode);
        });
    });

    var result = '<?xml version="1.0" encoding="ISO-8859-1"?>' + 
        new XMLSerializer().serializeToString(xmlDoc.documentElement);
    result = vkbeautify.xml(result);
    return result;
};

function getDataText(dataset, isKeys) {
    var result = "";
    // either get keys or values of given object
    var values = isKeys ? Object.keys(dataset) : Object.values(dataset);
    
    values.forEach(column => {
        result += column + ','
    });

    // remove last comma
    if (result.length > 0)
        result = result.substring(0, result.length - 1);

    return result;
};

function readTdfFile(xmlNode) {
    var BOCollection = [];

    // iterate businessobject nodes
    for (let i = 0; i < xmlNode.childNodes.length; i++) {
        const BOElement = xmlNode.childNodes[i];
        if (BOElement.nodeName.toLowerCase() !== 'transfer')
            continue;

        var currentBO = {};
        currentColumns = [];
        currentBO['datasets'] = [];

        // determine objectid
        for (let j = 0; j < BOElement.attributes.length; j++) {
            const BOAttribute = BOElement.attributes[j];
            if (BOAttribute.name.toLowerCase() !== 'objectid')
                continue;

            currentBO.objectId = BOAttribute.nodeValue;
        }

        // determine datasets
        for (let k = 0; k < BOElement.childNodes.length; k++) {
            const childElement = BOElement.childNodes[k];

            // get columnnames
            if (childElement.nodeName.toLowerCase() === 'columns')
                currentColumns = _.split(childElement.textContent, ',');

            // get data
            else if (childElement.nodeName.toLowerCase() === 'data') {
                for (let dr = 0; dr < childElement.childNodes.length; dr++) {
                    var currentDataSet = {};

                    if (childElement.childNodes[dr].nodeName.toLowerCase() !== 'dr')
                        continue;

                    const datarow = childElement.childNodes[dr].textContent.match(/\w+|"[^"]+"/g) // _.split(childElement.childNodes[dr].textContent, ',');
                    for (let dritem = 0; dritem < datarow.length; dritem++) {
                        currentDataSet[currentColumns[dritem]] = datarow[dritem];
                    }

                    // add current datset to current bo
                    currentBO['datasets'].push(currentDataSet);
                }
            }
        }
        // add current bo to result
        BOCollection.push(currentBO);
    }
    return BOCollection;
};