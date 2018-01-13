angular.module('fileUtils', []);

function readFile(filename, filecontent) {
    var xmlDoc = new DOMParser().parseFromString(filecontent,"text/xml").childNodes[0];
    var fileExtension = filename.split('.').pop().toLowerCase();
    switch(fileExtension) {
        case 'tdf':
        case 'tmf':
            return readTdfFile(xmlDoc);
        break;
    default:
        alert('Das Dateiformat ' + fileExtension + 'wird aktuell nicht unterstützt')
    }
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