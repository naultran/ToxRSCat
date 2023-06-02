import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';
import {delay, removeDuplicatesAndCollapse} from '/home/ubuntu/ToxRSCat/script/tools';
function removeDuplicateRows(outputMatrix) {
    const deduplicatedMatrix = [];
    const deduplicatedRows = new Set();
  
    for (const row of outputMatrix) {
      const rowStr = JSON.stringify(row);
      if (!deduplicatedRows.has(rowStr)) {
        deduplicatedRows.add(rowStr);
        deduplicatedMatrix.push(row);
      }
    }
  
    return deduplicatedMatrix;
  }

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
                ["projects.code", []],
                ["submitter_id", []],
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
                ["studies.submitter_id", []],
                ["submitter_id", ["data_submission_contact_name",]],
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
                ["studies.submitter_id", []],
                ["submitter_id", ["support_id",],], 
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
                ["studies.submitter_id", []],
                ["submitter_id", ["PMC_id",],], 
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

              async function myFunction() {
                exportFile(outputMatrix_study, "study", "tsv");
                await delay(1000);
                exportFile(outputMatrix_contact, "contact", "tsv");
                await delay(1000);
                exportFile(outputMatrix_funding, "funding", "tsv");
                await delay(1000);
                exportFile(outputMatrix_publication, "publication", "tsv");
              }
              myFunction();
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
                ["studies.code", []],
                ["submitter_id", []],
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
                /*
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_subject.has(outputRowStr)) {
                    outputRows_subject.add(outputRowStr);
                    outputMatrix_subject.push(outputRow);
                    
                }*/
            }
            const deduplicate_outputmatrix_subject = removeDuplicateRows(outputMatrix_subject);
            logs.push(["subjects is done"]);

            const ExportHeaders_housing = new Map([
                ["type", []],
                ["submitter_id", []],
                ["cageID", ["cage_id"]], 
                ["subjects.submitter_id", []],
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
            const outputRows_housing = new Set();

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
                /*
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_housing.has(outputRowStr)) {
                    outputRows_housing.add(outputRowStr);
                    outputMatrix_housing.push(outputRow);
                }*/
            }
            const deduplicate_outputmatrix_housing = removeDuplicateRows(outputMatrix_housing);
            logs.push(["housing is done"]);

            const ExportHeaders_treatment = new Map([
                ["type", []],
                ["submitter_id", []],
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
            const outputRows_treatment = new Set();

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
                    if (headerName == "submitter_id"){
                        const project_id = dh.getMappedField(
                            "project_identifier",
                            inputRow,
                            ["Study.project_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_treatment'
                          );
                          const subject_id = dh.getMappedField(
                            "subject_identifier",
                            inputRow,
                            ["Study.subject_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_treatment'
                          );
                          value = `${project_id}.${subject_id}.T`;
                    }
                    outputRow.push(value);
                }
                outputMatrix_treatment.push(outputRow);

                /*const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_treatment.has(outputRowStr)) {
                    outputRows_treatment.add(outputRowStr);
                    outputMatrix_treatment.push(outputRow);
                }*/
            }
            const deduplicate_outputmatrix_treatment = removeDuplicateRows(outputMatrix_treatment);
            // Add numbers to the end of submitter_id column in treatment) {
            for (let i = 1; i <= deduplicate_outputmatrix_treatment.length - 1; i++) {
                const submitterId = deduplicate_outputmatrix_treatment[i][1] + "_" + i.toString();
                deduplicate_outputmatrix_treatment[i][1] = submitterId;
            }
            logs.push(["treatment is done"]);

            const ExportHeaders_diet = new Map([
                ["type", []],
                ["submitter_id", []],
                ["date", []],
                ["feed_catalog_number",["feed_catalog_number"]],
                ["housings.submitter_id", []],
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
            const outputRows_diet = new Set();

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

                /*const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_diet.has(outputRowStr)) {
                    outputRows_diet.add(outputRowStr);
                    outputMatrix_diet.push(outputRow);
                }*/
                outputMatrix_diet.push(outputRow);
            
            }
            const deduplicate_outputmatrix_diet = removeDuplicateRows(outputMatrix_diet);
            logs.push(["diet is done"]);

              async function myFunction() {
                exportFile(deduplicate_outputmatrix_subject, "subject", "tsv");
                await delay(1000);
                exportFile(deduplicate_outputmatrix_housing, "housing", "tsv");
                await delay(1000);
                exportFile(deduplicate_outputmatrix_treatment, "treatment", "tsv");
                await delay(1000);
                exportFile(deduplicate_outputmatrix_diet, "diet", "tsv");
              }
              myFunction();
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