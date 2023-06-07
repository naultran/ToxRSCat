import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';

export default {
	gen3_ms_assay: {
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
						["calibration_standard", []],
						["chromatography_name", []],
						["chromatography_column", []],
						["chromatography_protocol", []],
						["elution_program", []],
						["flow_rate", []],
						["carrier_gas", []],
						["oven_temperature_program", []],
						["ms_method_name", []],
						["ms_protocol", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "mass_spec_assay",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["file_name",]],
						["mass_spec_assay.submitter_id", []],
						["file_name", []],
						["data_category", []],
						["data_format", []],
						["data_type", []],
						["instruments.submitter_id", []],
						['provenance', []]
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "ms_raw_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["file_name",]],
						["mass_spec_assay.submitter_id", []],
						["file_name", []],
						["data_category", []],
						["data_format", []],
						["data_type", []],
						['provenance', []]
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "ms_analysed_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", []],
						["ms_raw_data.submitter_id", []],
						["normalization", []],
						["transformation", []],
						["transformation_purpose", []],
						["transformation_description", []],
						["unit", []],
						["analysis_protocol.submitter_id", []],
						['provenance', []]
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "ms_analysis",
				}
			];

			for (const exportConfig of exportConfigs) {
				dh.getHeaderMap(exportConfig.exportHeaders, sourceFields, exportConfig.exportType);
				exportConfig.outputMatrix.push([...exportConfig.exportHeaders.keys()]);
				for (const inputRow of dh.getTrimmedData(dh.hot)) {
					const outputRow = [];
					for (const [headerName, sources] of exportConfig.exportHeaders) {
						var value = dh.getMappedField(
							headerName,
							inputRow,
							sources,
							sourceFields,
							sourceFieldNameMap,
							':',
							exportConfig.exportType
						);
						if (headerName == "type") {
							value = exportConfig.exportType;
						}
						outputRow.push(value);
					}
					exportConfig.outputMatrix.push(outputRow);
				}

				let finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, "submitter_id");
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}
			return logs;
		}
	},
	gen3_ms_aliquot: {
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
						["derivitization", []],
						["extract_preservation_method", []],
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
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}

			return logs;
		}
	},
	gen3_met_id: {
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
						["ms_analysed_data.submitter_id", []],
						["refmet_name", []],
						["dtxsid", []],
						["inchikey", []],
						["mass", []],
						["elution_time", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "metabolite_id",
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