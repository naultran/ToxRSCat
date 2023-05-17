import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';
// A dictionary of possible export formats
export default {
    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    gen3_submit_investigation:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const ExportHeaders = new Map([
                ["type", []],
                ["investigationID", []],
                ["program_title", []],
                ["investigation_description", []],
                ["contact_name", []],
                ["investigator_orcid", []],
                ["contact_email", []],
                ["contact_telephone", []],
                ["contact_department", []],
                ["contact_institution", []],
                [
                    'location', 
                    ["data_submission_contact_institution_postal_address", "data_submission_contact_institution_city", "gen3_submit_investigation",],
                ],
                ["support_source", []],
                ["support_id", []],
                ["PMC_id", []],
                ["DOI", []],
                ["PMID", []],
                ['provenance', ["investigation template version",],],
            ]);

            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_submit_investigation');

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
                        'gen3_submit_investigation'
                    );
                    if (headerName =="type"){
                        value = "investigation";
                    }
                    outputRow.push(value);
                }
            outputMatrix.push(outputRow);
            }

        return outputMatrix;
        }
    },

    gen3_study_all:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders_experiment = new Map([
                ["type", []],
                ["studyID", []], 
                ["programs", []],
                ["study_design", []],
                ["study_type", []],
                ["experimental_setting", []],
                ["organism", []],
                ['provenance', ["study template version",],],
            ]);

            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_experiment, sourceFields, 'gen3_study_experiment');

            // Copy headers to 1st row of new export table
            const outputMatrix_experiment = [[...ExportHeaders_experiment.keys()]];
            const outputRows_experirment = new Set();
            const logs = [[]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_experiment) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'gen3_study_experiment'
                    );
                    if (headerName =="type"){
                        value = "study.experiment";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_experirment.has(outputRowStr)) {
                    outputRows_experirment.add(outputRowStr);
                    outputMatrix_experiment.push(outputRow);
                }

            } 
            logs.push(["experiment is done"]);

            const ExportHeaders_subject = new Map([
                ["type", []],
                ["projects", []],
                ["investigationID", []],
                ["subjectID", []],
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
                        value = "study.subject";
                    }
                    outputRow.push(value);
                }
                // remove duplicate rows
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_subject.has(outputRowStr)) {
                    outputRows_subject.add(outputRowStr);
                    outputMatrix_subject.push(outputRow);
                }
            }
            logs.push(["subjects is done"]);

            const ExportHeaders_housing = new Map([
                ["type", []],
                ["submitter_id", []],
                ["cageID", ["cage_id"]], 
                ["subjects", []],
                ["housing_change_date", []],
                ["bedding_type", []], 
                ["cage_type", []],
                ["vivarium_temperature(C)", []],
                ["vivarium_humidity(%)", []],
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
                        value = "study.housing";
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_housing.has(outputRowStr)) {
                    outputRows_housing.add(outputRowStr);
                    outputMatrix_housing.push(outputRow);
                }
            }
            logs.push(["housing is done"]);
            const ExportHeaders_treatment = new Map([
                ["type", []],
                ["submitter_id", []],
                ["subjects", []],
                ["date", []],
                ["administration_volume(ml)", []],
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
                        value = "study.treatment";
                    }
                    if (headerName == "submitter_id"){
                        const investigation_id = dh.getMappedField(
                            "investigation_identifier",
                            inputRow,
                            ["Study.investigation_identifier"],
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
                          value = `${investigation_id}.${subject_id}.T`;
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_treatment.has(outputRowStr)) {
                    outputRows_treatment.add(outputRowStr);
                    outputMatrix_treatment.push(outputRow);
                }
            }
            logs.push(["treatment is done"]);

            const ExportHeaders_diet = new Map([
                ["type", []],
                ["submitter_id", []],
                ["feed_catalog_number",["feed_catalog_number"]],
                ["housings", []],
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
                        value = "study.diet";
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_diet.has(outputRowStr)) {
                    outputRows_diet.add(outputRowStr);
                    outputMatrix_diet.push(outputRow);
                }
            
            }
            logs.push(["diet is done"]);

            // Add numbers to the end of submitter_id column in treatment) {
            for (let i = 1; i <= outputMatrix_treatment.length - 1; i++) {
                const submitterId = outputMatrix_treatment[i][1] + "_" + i.toString();
                outputMatrix_treatment[i][1] = submitterId;
            }

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              async function myFunction() {
                exportFile(outputMatrix_experiment, "experiment", "tsv");
                await delay(5000);
                exportFile(outputMatrix_subject, "subject", "tsv");
                await delay(5000);
                exportFile(outputMatrix_housing, "housing", "tsv");
                await delay(5000);
                exportFile(outputMatrix_treatment, "treatment", "tsv");
                await delay(5000);
                exportFile(outputMatrix_diet, "diet", "tsv");
              }
              myFunction();
            //exportFile(housingtsv, "housing", "tsv")
            //exportFile(treatmenttsv, "treatment", "tsv")
            //exportFile(diettsv, "diet", "tsv")
            return logs
        }
    },


/*
    gen3_study_experiment:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const ExportHeaders = new Map([
                ["type", []],
                ["studyID", []], 
                ["programs", []],
                ["study_design", []],
                ["study_type", []],
                ["experimental_setting", []],
                ["organism", []],
                ['provenance', ["study template version",],],
            ]);

            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_study_experiment');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const outputRows = new Set();

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
                        'gen3_study_experiment'
                    );
                    if (headerName =="type"){
                        value = "study.experiment";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    outputMatrix.push(outputRow);
                }
            }

        return outputMatrix;
        }
    },

    gen3_study_subject:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const ExportHeaders = new Map([
                ["type", []],
                ["projects", []],
                ["investigationID", []],
                ["subjectID", []],
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
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_study_subject');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const outputRows = new Set();

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
                        'gen3_study_subject'
                    );
                    if (headerName =="type"){
                        value = "study.subject";
                    }
                    outputRow.push(value);
                }
                // remove duplicate rows
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    outputMatrix.push(outputRow);
                }
            }

        return outputMatrix;
        }
    },

    gen3_study_housing:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["submitter_id", []],
                ["cageID", ["cage_id"]], 
                ["subjects", []],
                ["housing_change_date", []],
                ["bedding_type", []], 
                ["cage_type", []],
                ["vivarium_temperature(C)", []],
                ["vivarium_humidity(%)", []],
                ["vivarium_light_cycle", []],
                ['provenance', ["study template version",],],
            ]); 
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_study_housing');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const outputRows = new Set();

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
                        'gen3_study_housing'
                    );
                    if (headerName =="type"){
                        value = "study.housing";
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    outputMatrix.push(outputRow);
                }
            }
        return outputMatrix;
        }
    },

    gen3_study_treatment:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["submitter_id", []],
                ["subjects", []],
                ["date", []],
                ["administration_volume(ml)", []],
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
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_study_treatment');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const outputRows = new Set();

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
                        'gen3_study_treatment'
                    );
                    if (headerName =="type"){
                        value = "study.treatment";
                    }
                    if (headerName == "submitter_id"){
                        const investigation_id = dh.getMappedField(
                            "investigation_identifier",
                            inputRow,
                            ["Study.investigation_identifier"],
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
                          value = `${investigation_id}.${subject_id}.T`;
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    outputMatrix.push(outputRow);
                }
            }
            // Add numbers to the end of submitter_id column) {
            for (let i = 1; i <= outputMatrix.length - 1; i++) {
                const submitterId = outputMatrix[i][1] + "_" + i.toString();
                outputMatrix[i][1] = submitterId;
            }
        return outputMatrix;
        }
    },

    gen3_study_diet:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["submitter_id", []],
                ["feed_catalog_number",["feed_catalog_number"]],
                ["housings", []],
                ["feed_description", []],
                ["feed_name", []], 
                ["feed_vendor", []],
                ["water_type", []],
                ["feeding_paradigm", []],
                ['provenance', ["study template version",],],
            ]); 
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_study_diet');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const outputRows = new Set();

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
                        'gen3_study_diet'
                    );
                    if (headerName =="type"){
                        value = "study.diet";
                    }
                    outputRow.push(value);
                }
                // Check if the output row already exists and skip adding it if it does
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    outputMatrix.push(outputRow);
                }
            
            }
        return outputMatrix;
        }
    },
*/
    gen3_submit_sample:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["sampleID", []],
                ["studyID", []],
                ["subjectID", []],
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