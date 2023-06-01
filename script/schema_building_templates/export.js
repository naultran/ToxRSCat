function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function removeDuplicatesAndCollapse(outputMatrix, uniqueColumn) {
  const uniqueRows = {};

  for (let i = 1; i < outputMatrix.length; i++) {
    const row = outputMatrix[i];
    const key = row[outputMatrix[0].indexOf(uniqueColumn)];

    if (uniqueRows.hasOwnProperty(key)) {
      for (let j = 1; j < row.length; j++) {
        const column = outputMatrix[0][j];
        const value = row[j];

        if (!uniqueRows[key][column].includes(value)) {
          uniqueRows[key][column].push(value);
        }
      }
    } else {
      uniqueRows[key] = {};

      for (let j = 1; j < row.length; j++) {
        const column = outputMatrix[0][j];
        const value = row[j];

        uniqueRows[key][column] = [value];
      }
    }
  }

  const finalMatrix = [outputMatrix[0]];

  for (const key in uniqueRows) {
    const row = [key];

    for (let j = 1; j < outputMatrix[0].length; j++) {
      const column = outputMatrix[0][j];
      const values = uniqueRows[key][column];

      if (values.length > 1) {
        row.push(values.join(","));
      } else {
        row.push(values[0]);
      }
    }

    finalMatrix.push(row);
  }

  return finalMatrix;
}

import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';

export default {
	gen3_class_all: {														// Rename as gen3_<classname>_all. Copy for each class in DH templates
		fileType: 'tsv',
		status: 'published',
		method: function(dh) {
			const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);

			// ONLY EDIT THIS SECTION
			const exportConfigs = [											// Edit the headers and fields below
				{
					exportHeaders: new Map([
						["type", []],										// Required
						["slide.submitter_id", []],							// unique identifier column required
						["field_name", []],
						['provenance', ["slide template version"]]			// Required
					]),
					uid: "slide.submitter_id",								// Should match the unique identifer above
					outputMatrix: [[]],										// Do not change
					exportType: "gen3_data",								// Mapping information in the yaml file
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", []],
						["aliquots.submitter_id", []],
						['provenance', ["slide template version"]],
					]),
					outputMatrix: [[]],
					uid: "submitter_id"
					exportType: "gen3_slide",
				}
			];
			// DO NOT EDIT BELOW

			async function exportFileWithDelay(outputMatrix, exportType) {
				exportFile(outputMatrix, exportType, "tsv");
				await delay(1000);
			}

			for (const exportConfig of exportConfigs) {
				dh.getHeaderMap(exportConfig.exportHeaders, sourceFields, exportConfig.exportType);
				exportConfig.outputMatrix.push([...exportConfig.exportHeaders.keys()]);

				for (const inputRow of dh.getTrimmedData(dh.hot)) {
					const outputRow = [];
					for (const [headerName, sources] of exportConfig.exportHeaders) {
						let value = dh.getMappedField(
							headerName,
							inputRow,
							sources,
							sourceFields,
							sourceFieldNameMap,
							':',
							exportConfig.exportType
						);
						if (headerName === "type") {
							value = exportConfig.exportType;
						}
						outputRow.push(value);
					}
					exportConfig.outputMatrix.push(outputRow);
				}
				const finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				await exportFileWithDelay(exportConfig.outputMatrix, exportConfig.exportType);
			}

			return logs;
		}
	}
	// Copy the function above and edit the relevant section as many times as needed.
}