import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';

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

export default {
	gen3_flow_cytometry: {
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
						["submitter_id", []],
						["aliquots.submitter_id", []],
						["protocol", []],
						["protocol_doi", []],
						["quality_control_measures", []],
						["instrument.submitter_id", []],
						["staining_protocol", []],
						["characteristics_being_measured", []],
						["analyte", []],
						["analyte_detector", []],
						["analyte_reporter", []],
						["clone", []],
						["reagent_manufacturer", []],
						["reagent_catalogue", []],
						["staining_status", []],
						["other_reagent", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "flow_cytometry_assay",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["file_name"]],
						["flow_cytometry_assay.submitter_id", []],
						["file_name", []],
						["data_type", []],
						["data_format", []],
						["data_category", []],
						['provenance', []],
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "flow_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["file_name"]],
						["flow_cytometry_assay.submitter_id", []],
						["file_name", []],
						["data_type", []],
						["data_format", []],
						["data_category", []],
						['provenance', []],
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "flow_analysis_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["file_name"]],
						["flow_data.submitter_id", ["fcs"]],
						["protocol", []],
						["compensation_description", []],
						["transformation_purpose", []],
						["transformation_description", []],
						["gate_description", []],
						["gate_statistics", []],
						["gate_boundaries", []],						
						['provenance', []],
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "flow_analysis",
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
				exportFileWithDelay(exportConfig.outputMatrix, exportConfig.exportType);
			}
			return logs;
		}
	},

	gen3_analyte: {
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
						["submitter_id", []],
						["samples.submitter_id", []],
						["analyte_type", []],
						["analyte_protocol", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "aliquot",
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
				exportFileWithDelay(exportConfig.outputMatrix, exportConfig.exportType);
			}

			return logs;
		}
	}
};