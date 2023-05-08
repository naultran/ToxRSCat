// A dictionary of possible export formats
export default {
    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    Gen3_Submit_Investigation:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            // Create an export table with template's headers (2nd row) and remaining rows of data

            // NOTE: NULL reason fields must follow immediately after column they are about.
            const ExportHeaders = new Map([
                ["type", []],
                ["investigationID", []],
                ["programs.name", ["program.title"]],
                ["investigation.description", []],
                ["contact_name", []],
                ["investigator_orcid", []],
                ["contact_department", []],
                ["contact_institution", []],
                ["location", ["zip", "city", "state"]],
            ]);

            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders, sourceFields, 'gen3_submit_investigation');

            // Copy headers to 1st row of new export table
            const outputMatrix = [[...ExportHeaders.keys()]];

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
                            'gen3_submit_investigation'
                        );
                    }
                    if (headerName =="type"){
                        value = "investigation";
                    }
                }
            }

        return outputMatrix;
        }
    },

    Gen3_Submit_Study:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []],
                ["studyID", []],
                ["investigationID", []],
                ["study_design", []],
                ["study_type", []],
                ["experimental_setting", []], 
                ["organism", []],
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
                ["housing_change_date", []],
                ["feed_catalog_number", []],
                ["administration_volume", []],
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
                ["biospecimen_anatomic_site", []]
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

