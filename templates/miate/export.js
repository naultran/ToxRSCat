import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';

// A dictionary of possible export formats
export default {
    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    gen3_study_all:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            const exportConfigs = [
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", []],
                        ["projects.code", []],
                        ["study_title", []],
                        ["study_description", []],
                        ["study_design", []],
                        ["study_type", []],
                        ["experimental_setting", []],
                        ["organism", []],
                        ['provenance', ["investigation template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "study",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["data_submission_contact_name",]],
                        ["studies.submitter_id", []],
                        ["contact_name", []],
                        ["contact_orcid", []],
                        ["contact_email", []],
                        ["contact_telephone", []],
                        ["contact_department", []],
                        ["contact_institution", []],
                        [
                            'location', 
                            ["data_submission_contact_institution_postal_address", "data_submission_contact_institution_city", "gen3_submit_investigation",],
                        ],
                        ['provenance', ["investigation template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "contact",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["support_id",],], 
                        ["studies.submitter_id", []],
                        ["support_id", []],      
                        ["support_source", []],
                        ['provenance', ["investigation template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "funding",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["PMC_id",],],
                        ["studies.submitter_id", []],
                        ["PMC_id", []],
                        ["DOI", []],
                        ["PMID", []],
                        ['provenance', ["investigation template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "publication",
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

				let finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}
			return logs;
		}
	},


    gen3_subject_all:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            const exportConfigs =[
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", []],
                        ["studies.code", []],
                        ["start_date", []],
                        ["start_date_age", []],
                        ["experiment_start_date", []],
                        ["experiment_start_zt", []],
                        ["sex", []],
                        ["strain", []],
                        ["strain_source", []],
                        ["euthanasia_date", []],
                        ["euthanasia_zt", []],
                        ["euthanasia_method", []],
                        ['provenance', ["study template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "subject",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["cage_id", "housing_change_date"]],
                        ["subjects.submitter_id", []],
                        ["cageID", []], 
                        ["housing_change_date", []],
                        ["bedding_type", []], 
                        ["cage_type", []],
                        ["vivarium_temperature_C", []],
                        ["vivarium_humidity_percentage", []],
                        ["vivarium_light_cycle", []],
                        ['provenance', ["study template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "housing",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["test_article_dtxsid", "treatment_date", "dose_amount"]],
                        ["subjects.submitter_id", []],
                        ["date", []],
                        ["administration_volume_ml", []],
                        ["dose_amount", []], 
                        ["dose_amount_unit", []],
                        ["route", []],
                        ["test_article_administration_zt", []],
                        ["test_article_administration_duration", []],
                        ["test_article_name", []],
                        ["test_article_dtxsid", []],
                        ["vehicle_name", []],
                        ["vehicle_dtxsid", []],
                        ['provenance', ["study template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "treatment",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["feed_catalog_number", "diet_date"]],
                        ["housings.submitter_id", ["cage_id", "housing_change_date"]],
                        ["date", []],
                        ["feed_catalog_number",[]],
                        ["feed_description", []],
                        ["feed_name", []], 
                        ["feed_vendor", []],
                        ["water_type", []],
                        ["feeding_paradigm", []],
                        ['provenance', ["study template version",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "diet",
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

				let finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, "tsv");
			}
			return logs;
		}
	},

    gen3_submit_sample:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["submitter_id", []],
                ["subjects.submitter_id", []],
                ["date", []],
                ["biospecimen_anatomic_site", []],
                ["method_of_sample_procurement", []],
                ["preservation_method", []],
                ["weight", []],
                ["volume",[]],
                ['provenance', ["sample template version",],],
            ]);

            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_submit_sample');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_submit_sample'
                    );
                    if (headerName =="type"){
                        value = "sample";
                    }
                    outputRow.push(value);
                }
            outputMatrix.push(outputRow);
            }

        return outputMatrix;
        }
    },
};