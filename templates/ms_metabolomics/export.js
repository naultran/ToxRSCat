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
						["submitter_id", ["mass_spec_assay.study_id", "submitter_id"]],
						["aliquots.submitter_id", ["mass_spec_assay.study_id", "aliquots.submitter_id"]],
						["sample_dilution", []],
						["calibration_standard", []],
						["solvent.solventA", []],
						["solvent.solventB", []],
						["solvent.solventV", []],
						["chromatography_type", []],
						["chromatography_column", []],
						["chromatography_protocol", []],
						["chromatography_instrument", []],
						["chromatography_method_filename", []],
						["elution_program", []],
						["flow_rate", []],
						["carrier_gas", []],
						["oven_temperature_program", []],
						["ms_type", []],
						["ms_protocol", []],
						["ms_method_filename", []],
						["ion_mode", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "mass_spec_assay",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["mass_spec_assay.study_id", "rawDataFile",]],
						["mass_spec_assays.submitter_id", ["mass_spec_assay.study_id", "submitter_id"]],
						["file_name", []],
						["file_size", []],
						["md5sum", []],
						["object_id", []],
						["data_category", []],
						["data_format", []],
						["data_type", []],
						["file_source_repository", []],
						["repository_accession_id", []],
						["repository_download_ftp", []],
						['provenance', []]
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "ms_raw_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["mass_spec_assay.study_id", "processedDataFile",]],
						["ms_analyses.submitter_id", ["mass_spec_assay.study_id", "submitter_id"]],
						["file_name", []],
						["file_size", []],
						["md5sum", []],
						["object_id", []],
						["data_category", []],
						["data_format", []],
						["data_type", []],
						["file_source_repository", []],
						["repository_accession_id", []],
						["repository_download_ftp", []],
						['provenance', []]
					]),
					outputMatrix: [[]],
					uid: "submitter_id",
					exportType: "ms_analysed_data",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["mass_spec_assay.study_id", "submitter_id"]],
						["ms_raw_datas.submitter_id", ["mass_spec_assay.study_id", "rawDataFile"]],
						["normalization", []],
						["transformation", []],
						["transformation_purpose", []],
						["transformation_description", []],
						["unit", []],
						["analysis_protocols", []],
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
						["submitter_id", ["aliquot.study_id", "aliquots.submitter_id"]],
						["samples.submitter_id", ["aliquot.study_id", "samples.submitter_id"]],
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
						["submitter_id", ["metabolite.study_id", "metabolite_name"]],
						["ms_analysed_datas.submitter_id", ["metabolite.study_id", "metabolite.data_analysis_id"]],
						["metabolite_name", ["metabolite_name"]],
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