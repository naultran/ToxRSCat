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
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const logs = [[]];
            // project
            const ExportHeaders_study = new Map([
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
            ]);
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            dh.getHeaderMap(ExportHeaders_study, sourceFields, 'gem3_submit_study');

            // Copy headers to 1st row of new export table
            const outputMatrix_study = [[...ExportHeaders_study.keys()]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_study) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gem3_submit_study'
                    );
                    if (headerName =="type"){
                        value = "study";
                    }
                    outputRow.push(value);
                }
                outputMatrix_study.push(outputRow);
            }
            logs.push(["study is done"]);

            //contact information
            const ExportHeaders_contact = new Map([
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
            ]);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_contact, sourceFields, 'contact');

            // Copy headers to 1st row of new export table
            const outputMatrix_contact = [[...ExportHeaders_contact.keys()]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_contact) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'contact'
                    );
                    if (headerName =="type"){
                        value = "contact";
                    }
                    outputRow.push(value);
                }
                outputMatrix_contact.push(outputRow);
            }

            logs.push(["contact information is done"]);

            // funding
            const ExportHeaders_funding = new Map([
                ["type", []],
                ["submitter_id", ["support_id",],], 
                ["studies.submitter_id", []],
                ["support_id", []],      
                ["support_source", []],
                ['provenance', ["investigation template version",],],
            ]);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_funding, sourceFields, 'gen3_submit_funding');

            // Copy headers to 1st row of new export table
            const outputMatrix_funding = [[...ExportHeaders_funding.keys()]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_funding) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_submit_funding'
                    );
                    if (headerName =="type"){
                        value = "funding";
                    }
                    outputRow.push(value);
                }
                outputMatrix_funding.push(outputRow);
            }
            logs.push(["funding information is done"]);

            //publication
            const ExportHeaders_publication = new Map([
                ["type", []],
                ["submitter_id", ["PMC_id",],],
                ["studies.submitter_id", []],
                ["PMC_id", []],
                ["DOI", []],
                ["PMID", []],
                ['provenance', ["investigation template version",],],
            ]);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_publication, sourceFields, 'gen3_submit_Publication');

            // Copy headers to 1st row of new export table
            const outputMatrix_publication = [[...ExportHeaders_publication.keys()]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_publication) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_submit_Publication'
                    );
                    if (headerName =="type"){
                        value = "publication";
                    }
                    outputRow.push(value);
                }
                outputMatrix_publication.push(outputRow);
            }
            logs.push(["publication is done"]);


            exportFile(outputMatrix_study, "study", "tsv");

            exportFile(outputMatrix_contact, "contact", "tsv");

            exportFile(outputMatrix_funding, "funding", "tsv");

            exportFile(outputMatrix_publication, "publication", "tsv");

            return logs;
        }
    },

    gen3_subject_all:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const logs = [[]];
            const ExportHeaders_subject = new Map([
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
            ]);
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_subject, sourceFields, 'gen3_study_subject');
            // Copy headers to 1st row of new export table
            const outputMatrix_subject = [[...ExportHeaders_subject.keys()]];
            const outputRows_subject = new Set();
            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_subject) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_study_subject'
                    );
                    if (headerName =="type"){
                        value = "subject";
                    }
                    outputRow.push(value);
                }
                outputMatrix_subject.push(outputRow);
            }
            const deduplicate_outputmatrix_subject = removeDuplicateRows(outputMatrix_subject);
            logs.push(["subjects is done"]);

            const ExportHeaders_housing = new Map([
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
            ]); 
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_housing, sourceFields, 'gen3_study_housing');
            // Copy headers to 1st row of new export table
            const outputMatrix_housing = [[...ExportHeaders_housing.keys()]];
            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_housing) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_study_housing'
                    );
                    if (headerName =="type"){
                        value = "housing";
                    }
                    outputRow.push(value);
                }
                outputMatrix_housing.push(outputRow);
            }
            const deduplicate_outputmatrix_housing = removeDuplicatesAndCollapse(outputMatrix_housing, "submitter_id");
            logs.push(["housing is done"]);

            const ExportHeaders_treatment = new Map([
                ["type", []],
                ["submitter_id", ["test_article_dtxsid", "treatment_date"]],
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
            ]); 
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_treatment, sourceFields, 'gen3_study_treatment');
            // Copy headers to 1st row of new export table
            const outputMatrix_treatment = [[...ExportHeaders_treatment.keys()]];
            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_treatment) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_study_treatment'
                    );
                    if (headerName =="type"){
                        value = "treatment";
                    }
            
                    outputRow.push(value);
                }
                outputMatrix_treatment.push(outputRow);
            }
            const deduplicate_outputmatrix_treatment = removeDuplicateRows(outputMatrix_treatment);
            logs.push(["treatment is done"]);

            const ExportHeaders_diet = new Map([
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
            ]); 
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_diet, sourceFields, 'gen3_study_diet');
            // Copy headers to 1st row of new export table
            const outputMatrix_diet = [[...ExportHeaders_diet.keys()]];
            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_diet) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_study_diet'
                    );
                    if (headerName =="type"){
                        value = "diet";
                    }
                    outputRow.push(value);
                }
                outputMatrix_diet.push(outputRow);
            
            }
            const deduplicate_outputmatrix_diet = removeDuplicatesAndCollapse(outputMatrix_diet, "submitter_id");
            logs.push(["diet is done"]);


            exportFile(deduplicate_outputmatrix_subject, "subject", "tsv");

            exportFile(deduplicate_outputmatrix_housing, "housing", "tsv");

            exportFile(deduplicate_outputmatrix_treatment, "treatment", "tsv");

            exportFile(deduplicate_outputmatrix_diet, "diet", "tsv");


            return logs
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