import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';

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
						["submitter_id", ["file_name",]],
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
					uid: "submitter_id",
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








