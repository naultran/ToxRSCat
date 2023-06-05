import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';

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
					uid: "submitter_id",
					exportType: "gen3_slide",
				}
			];
			// DO NOT EDIT BELOW

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
				exportFile(finalMatrix, exportConfig.exportType);
			}

			return logs;
		}
	}
	// Copy the function above and edit the relevant section as many times as needed.
}