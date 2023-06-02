import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';

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
export default {
	gen3_slide_all: {
		fileType: 'tsv',
		status: 'published',
		method: function(dh) {
			const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
			const exportConfigs = [
				{
					exportHeaders: new Map([
						["type", []],
						["slides.submitter_id", []],
						["file_name", []],
						["data_category", []],
						["data_format", []],
						["data_type", []],
						["instruments.submitter_id", []],
						["magnification", []],
						["imaging_protocol", []],
						["imaging_protocol_DOI", []],
						['provenance', ["slide template version"]]
					]),
					uid: "slides.submitter_id",
					outputMatrix: [[]],
					exportType: "slide_image",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", []],
						["aliquots.submitter_id", []],
						["assay", []],
						["probe_type", []],
						["probe_name", []],
						["probe_provider", []],
						["probe_catalog_number", []],
						["probe_concentration", []],
						["detection_method", []],
						['provenance', ["slide template version"]],
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "slide",
				}
			];
			// Function to wait for downloading files to fix crashes
			async function exportFileWithDelay(outputMatrix, exportType) {
				exportFile(outputMatrix, exportType, "tsv");
				await delay(4000);
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
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}
			return logs;
		}
	},
	gen3_pathology_all: {
		fileType: 'tsv',
		status: 'published',
		method: function(dh) {
			const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
			const exportConfigs = [
				{
					exportHeaders: new Map([
						["type", []],
						["slide.submitter_id", []],
						["finding_type", []],
						["topography_type", []],
						["grade", []],
						["spontaneous_flag", []],
						["scoring_system", []],
						['provenance', ["slide template version"]]
					]),
					uid: "slide.submitter_id",
					outputMatrix: [[]],
					exportType: "gen3_pathology",
				}
			];
			// Function to wait for downloading files to fix crashes
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
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}

			return logs;
		}
	}
};








