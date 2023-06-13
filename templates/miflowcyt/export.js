import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';


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
						["submitter_id", ["Flow_cytometry_experiment_study_id", "flow_cytometry.submitter_id"]],
						["aliquots.submitter_id", ["Flow_cytometry_experiment_study_id", "aliquots.submitter_id"]],
						["protocol", []],
						["protocol_doi", []],
						["quality_control_measures", []],
						["instruments_submitter_id", ["Flow_cytometry_experiment_study_id", "instrument.submitter_id"]],
						["staining_protocol", []],
						["staining_protocol_doi", []],
						["characteristics_being_measured", []],
						["analyte", []],
						["analyte_detector", []],
						["analyte_reporter", []],
						["clone", []],
						["reagent_manufacturer", []],
						["reagent_catalogue", []],
						["staining_status", []],
						["other_reagent", []],
						['provenance', []],
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "flow_cytometry_assay",
				},
				{
					exportHeaders: new Map([
						["type", []],
						["submitter_id", ["Flow_cytometry_experiment_study_id", "listModeDataFile"]],
						["flow_cytometry_assays.submitter_id", ["Flow_cytometry_experiment_study_id", "flow_cytometry.submitter_id"]],
						["file_name", []],
						["data_type", []],
						["data_format", []],
						["file_size", []],
						["md5sum", []],
						["object_id", []],
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
						["submitter_id", ["Flow_cytometry_experiment_study_id", "WorkspaceFile"]],
						["flow_analysises.submitter_id", ["Flow_cytometry_experiment_study_id", "listModeDataFile"]],
						["file_name", []],
						["data_type", []],
						["data_format", []],
						["file_size", []],
						["md5sum", []],
						["object_id", []],
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
						["submitter_id", ["Flow_cytometry_experiment_study_id", "TransformationDescription"]],
						["flow_datas.submitter_id", ["Flow_cytometry_experiment_study_id", "listModeDataFile"]],
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
				exportFile(finalMatrix, exportConfig.exportType, 'tsv');
			}
			return logs;
		}
	},

	gen3_aliquot: {
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
						["submitter_id", ["aliquot.study_id", "aliquot.submitter_id"]],
						["samples.submitter_id", ["aliquot.study_id", "sample.submitter_id"]],
						["analyte_type", []],
						["analyte_protocol", []],
						['provenance', []]
					]),
					uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "aliquot",
				}
			];

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
				exportFile(finalMatrix, exportConfig.exportType, 'tsv');
			}

			return logs;
		}
	}
};