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
            outputMatrix.push(outputRow);
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
                    outputRow.push(value);
                }
                // remove duplicate rows
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    // add submitter_id
                    const investigationId = dh.getCellValue('Study.investigation_identifier', inputRow);
                    const subjectId = dh.getCellValue('Study.subject_identifier', inputRow);
                    const rowIndex = outputRows.size;
                    const housingIndex = rowIndex - 1;
                    outputRow[1] = `${investigationId}.${subjectId}.H_${housingIndex}`;
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
                    outputRow.push(value);
                }
                // remove duplicate rows
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    // add submitter_id
                    const investigationId = dh.getCellValue('Study.investigation_identifier', inputRow);
                    const subjectId = dh.getCellValue('Study.subject_identifier', inputRow);
                    const rowIndex = outputRows.size;
                    const housingIndex = rowIndex - 1;
                    outputRow[1] = `${investigationId}.${subjectId}.T_${housingIndex}`;
                    outputMatrix.push(outputRow);
                }
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
                ["subjectID", []],
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
                    outputRow.push(value);
                }
                // remove duplicate rows
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows.has(outputRowStr)) {
                    outputRows.add(outputRowStr);
                    // add submitter_id
                    const investigationId = dh.getCellValue('Study.investigation_identifier', inputRow);
                    const subjectId = dh.getCellValue('Study.subject_identifier', inputRow);
                    const rowIndex = outputRows.size;
                    const housingIndex = rowIndex - 1;
                    outputRow[1] = `${investigationId}.${subjectId}.D_${housingIndex}`;
                    outputMatrix.push(outputRow);
                }
            }

        return outputMatrix;
        }
    },

    Gen3_Submit_Sample:{
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
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_submit_study');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];
            const numeric_datatypes = new Set([
                'xs:nonNegativeInteger',
                'xs:decimal',
              ]);

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                var skip = false;
                for (const [headerName, sources] of ExportHeaders) {
                    // Skips a column because it has already been set in previous column action.
                    if (skip === true) skip = false;
                    else {
                        // Otherwise apply source (many to one) to target field transform:
                        var value = dh.getMappedField(
                            headerName,
                            inputRow,
                            sources,
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'gen3_submit_study'
                        );
                    }
                    if (headerName =="type"){
                        value = "study";
                    }

                    // Some columns have an extra ' null reason' field for demultiplexing null value into.
                    if (ExportHeaders.has(headerName + ' null reason')) {
                    //headerName = source field name in this format case.
                        if (sources.length > 0) {
                        // field and its null reason field must be 1-1
                            const sourceFieldIndex = sourceFieldNameMap[sources[0]];
                            const field = sourceFields[sourceFieldIndex];
                            if (field) {
                                // Null reason recognition comes from dataStatus values, or generic nullOptionsMap.
                                if (field.dataStatus && field.dataStatus.includes(value)) {
                                    // Clears original value field of its null value and puts it in next column where null reason is.
                                    outputRow.push('');
                                    skip = true;
                                }
                                // Small gesture towards normalization: correct case
                                else if (nullOptionsMap.has(value.toLowerCase())) {
                                    value = nullOptionsMap.get(value.toLowerCase());
                                    outputRow.push('');
                                    skip = true;
                                }
                                // If a numeric field has text in it then push that over
                                // to null reason field.  This is occuring at data export
                                // stage, after validation so text is assumed to be
                                // intentional
                                else if (
                                    numeric_datatypes.has(field.datatype) &&
                                    isNaN(Number(value))
                                ) {
                                    outputRow.push('');
                                    skip = true;
                                }
                            } else
                            alert(
                                'Template configuration error: "' +
                                headerName +
                                '" has misnamed source field.'
                            );
                        } else
                        alert(
                            'Template configuration error: "' +
                            headerName +
                            '" has no source mapped field.'
                        );
                    }
  
                }
            }

        return outputMatrix;

        }

    }
};

