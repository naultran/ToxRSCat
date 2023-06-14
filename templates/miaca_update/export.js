import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';

// A dictionary of possible export formats
export default {
    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    gen3_study:{
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
                        //["study_title", []], Need to add
                        //["study_description", []], Need to add
                        ["study_design", []],
                        ["study_type", []],
                        ["experimental_setting", []],
                        //["organism", []], Need to add
                        ['provenance', ["provenance",],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "study",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["Study.study_identifier","last_name", "first_name","middle_name"]],
                        ["studies.submitter_id", []],
                        ["contact_name.Last", []],
                        ["contact_name.First", []],
                        ["contact_name.Middle", []],
                        ["contact_orcid", []],
                        ["contact_email", []],
                        ["contact_telephone", []],
                        ["contact_department", []],
                        ["contact_institution", []],
                        [
                            'location', 
                            ["data_submission_contact_institution_postal_address", "data_submission_contact_institution_city", "data_submission_contact_state",],
                        ],
                        ['provenance', [],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "contact",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["submitter_id", "support_id"],], 
                        ["studies.submitter_id", []],
                        ["support_id", []],      
                        ["support_source", []],
                        ['provenance', [],],
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
                        ['provenance', [],],
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


    gen3_cell_subject:{
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
                        ["studies.submitter_id", []],
						["miate.subject.submitter_id", []],
                        ["cell_type", []],
                        ["organism", []],
                        ["race", []],
                        ["strain", []],
                        ["sex", []],
                        ["age", []],
                        ["passage_number", []],
                        ["lot_no", []],
                        ["source_organ", []],
                        ["lineage", []],
                        ["karyotype", []],
                        ["health_status", []],
                        ["modifications", []],
                        ["lineQC", []],
						["validation", []],
						["isolation_protocol", []],
						["stem_cell_protocol", []],
						["cell_line_protocol", []],
                        ['provenance', [],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "cell_subject",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["study.submitter_id", "cell_subjects.submitter_id","date",]],
                        ["cell_subjects.submitter_id", []],
                        ["date", []], 
                        ["culture_vessel", []],
                        ["vendor", []], 
                        ["dimension", []],
                        ["size", []],
                        ["surfaceArea", []],
                        ["coating_substrate", []],
                        ["culture_vessel_location", []], 
                        ["seeding_cell_density", []],
                        ["seeding_cell_date", []],
                        ["cellDensity", []],
                        ["incubator_vendor", []],
                        ["incubator_model", []], 
                        ["co2_percent", []],
                        ["o2_percent", []],
                        ["temperature", []],
                        ["humidity", []],
                        ['provenance', [],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "culture_conditions",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["study.submitter_id", "test_article_dtxsid", "treatment_date"]],
                        ["cell_subjects.submitter_id", []],
                        ["treatment_date", []],
                        ["addition_volume", []],
                        ["stock_concentration", []], 
                        ["final_concentration", []],
                        ["concentration_unit", []],
                        ["test_article_administration_duration", []],
                        ["test_article_name", []],
                        ["test_article_dtxsid", []],
                        ["vehicle_name", []],
                        ["vehicle_dtxsid", []],
                        ["treatment_protocol", []],
                        ['provenance', [],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "treatment",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["study.submitter_id", "cell_subjects.submitter_id","culture_vessel_date","date"]],
                        ["culture_conditions.submitter_id", ["study.submitter_id", "cell_subjects.submitter_id","culture_vessel_date"]],
                        ["date", []],
                        ["protocol",[]],
                        ["basal_medium", []],
                        ["basal_medium_vendor", []], 
                        ["basal_medium_lot_no", []],
                        ["culture_additives", []],
                        ["culture_additives_concentration", []],
						["anitibiotic_name", []],
						["antibiotic_concentration", []],
                        ['provenance', [],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "culture_media",
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


    gen3_sample:{
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
                        ["submitter_id", ["sample.study_id", "sample.submitter_id"]],
                        ["cell_subjects.submitter_id", []],
                        ["date", []],
						["biospecimen_anatomic_site", []],
						["method_of_sample_procurement", []],
						["preservation_method", []],
                        ["storage_vessel", []],
                        ["collection_protocol", []],
						['provenance', []],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "sample",
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
};