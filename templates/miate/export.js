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
                ["investigation.description", []],
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


    gen3_study_experiment:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const ExportHeaders = new Map([
                ["type", []],
                ["studyID", []], 
                ["investigationID", []],
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
                ["studyID", []],
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
                ["euthanmasia_zt", []],
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
                ["subjectID", []],
                ["housing_change_date", []],
                ["cage_id", []],
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
                    if (headerName == "submitter_id"){
                        const investigation_id = dh.getMappedField(
                            "investigation_identifier",
                            inputRow,
                            ["Study.investigation_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_housing'
                          );
                          const subject_id = dh.getMappedField(
                            "subject_identifier",
                            inputRow,
                            ["Study.subject_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_housing'
                          );
                          value = `${investigation_id}.${subject_id}.H`;
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

    gen3_study_treatment:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["submitter_id", []],
                ["subjectID", []],
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
                ["cage_id", []],
                ["feed_catalog_number", []],
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
                    if (headerName == "submitter_id"){
                        const investigation_id = dh.getMappedField(
                            "investigation_identifier",
                            inputRow,
                            ["Study.investigation_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_diet'
                          );
                          const subject_id = dh.getMappedField(
                            "subject_identifier",
                            inputRow,
                            ["Study.subject_identifier"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_study_diet'
                          );
                          value = `${investigation_id}.${subject_id}.D`;
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

    gen3_submit_sample:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
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