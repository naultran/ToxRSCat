import { exportFile, exportJsonFile } from '/home/ubuntu/DataHarmonizer/lib/utils/files';
// A dictionary of possible export formats
export default {
    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    gen3_submit_metabolomics_experiment_all:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            //extraction
            const ExportHeaders_extraction = new Map([
                ["type", []], //extraction
                ["submitter_id", []], //metabolomic_experiment_identifier
                ["samples.submitter_id", []],
                ["extraction_protocol", []],
                ["extraction_protocol_DOI", []],
                ["derivitization", []],
                ["extract_preservation_method", []],
                ["calibration_standard", []],
                ["provenance", ["experiement template version"],],
            ]);
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_extraction, sourceFields, 'extraction');

            // Copy headers to 1st row of new export table
            const outputMatrix_extraction = [[...ExportHeaders_extraction.keys()]];
            const outputRows_extraction = new Set();
            const logs = [[]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_extraction) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'extraction'
                    );
                    if (headerName =="type"){
                        value = "extraction";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_extraction.has(outputRowStr)) {
                    outputRows_extraction.add(outputRowStr);
                    outputMatrix_extraction.push(outputRow);
                }

            } 
            logs.push(["extraction is done"]);

            //chromatography - many to one
            const ExportHeaders_chromatography = new Map([
                ["type", []], //chromatography
                ["submitter_id", []], //
                ["extractions.submitter_id", []], 
                ["name", ["chromatography.name"],],
                ["chromatography_protocol", []],
                ["chromatography_protocol_DOI", []],
                ["chromatography_column", []],
                ["elution_program", []],
                ["flow_rate", []],
                ["carrier_gas", []],
                ["oven_temperature_program", []],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_chromatography, sourceFields, 'chromatography');

            // Copy headers to 1st row of new export table
            const outputMatrix_chromatography = [[...ExportHeaders_chromatography.keys()]];
            const outputRows_chromatography = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_chromatography) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'chromatography'
                    );
                    if (headerName =="type"){
                        value = "chromatography";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_chromatography.has(outputRowStr)) {
                    outputRows_chromatography.add(outputRowStr);
                    outputMatrix_chromatography.push(outputRow);
                }

            } 
            logs.push(["chromatography is done"]);

            //ms_method - many to one
            const ExportHeaders_ms_method = new Map([
                ["type", []], //ms_method
                ["submitter_id", []], //
                ["extractions.submitter_id", []], 
                ["name", ["ms_method.name"],],
                ["ms_protocol", []],
                ["ms_protocol_DOI", []],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_ms_method, sourceFields, 'ms_method');

            // Copy headers to 1st row of new export table
            const outputMatrix_ms_method = [[...ExportHeaders_ms_method.keys()]];
            const outputRows_ms_method = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_ms_method) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'ms_method'
                    );
                    if (headerName =="type"){
                        value = "ms_method";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_ms_method.has(outputRowStr)) {
                    outputRows_ms_method.add(outputRowStr);
                    outputMatrix_ms_method.push(outputRow);
                }

            } 
            logs.push(["ms_method is done"]);

            //raw data file - one to many
            const ExportHeaders_rawdata_file = new Map([
                ["type", []], //rawdata_file
                ["submitter_id", []],
                ["extractions.submitter_id", []],
                ["file_name", ["rawDataFile"]],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_rawdata_file, sourceFields, 'rawdata_file');

            // Copy headers to 1st row of new export table
            const outputMatrix_rawdata_file = [[...ExportHeaders_rawdata_file.keys()]];
            const outputRows_rawdata_file = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_rawdata_file) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'rawdata_file'
                    );
                    if (headerName =="type"){
                        value = "rawdata_file";
                    };
                    
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_rawdata_file.has(outputRowStr)) {
                    outputRows_rawdata_file.add(outputRowStr);
                    outputMatrix_rawdata_file.push(outputRow);
                }
                
            }
            // combine the flourescence_reagents in the same file_name and remove duplicate
            for (let i = 1; i < outputMatrix_rawdata_file.length; i++){
                const filename = outputMatrix_rawdata_file[i][1];
                let value = outputMatrix_rawdata_file[i][2];
                for(let j = i+1; j < outputMatrix_rawdata_file.length; j++){
                    if(outputMatrix_rawdata_file[j][1] === filename && outputMatrix_rawdata_file[j][2]!==value){
                        value = value + ','+ outputMatrix_rawdata_file[j][2];
                    }
                }
                for(let z = i; z < outputMatrix_rawdata_file.length; z++){
                    if(outputMatrix_rawdata_file[z][1] == filename){
                        outputMatrix_rawdata_file[z][2] = value;
                    }
                    
                }
            }
            const uniqueOutputMatrix_rawdata_file = [];
            const uniqueOutputRows_rawdata_file = new Set();
            for (const outputRow of outputMatrix_rawdata_file) {
                const outputRowStr = JSON.stringify(outputRow);
                if (!uniqueOutputRows_rawdata_file.has(outputRowStr)) {
                    uniqueOutputRows_rawdata_file.add(outputRowStr);
                    uniqueOutputMatrix_rawdata_file.push(outputRow);
                }
            }

            logs.push(["raw data file is done"]);

            // processed data file - one to many
            const ExportHeaders_processeddata_file = new Map([
                ["type", []], //processeddata_file
                ["submitter_id", []],
                ["extractions.submitter_id", []],
                ["file_name", ["processedDataFile"]],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_processeddata_file, sourceFields, 'processeddata_file');

            // Copy headers to 1st row of new export table
            const outputMatrix_processeddata_file = [[...ExportHeaders_processeddata_file.keys()]];
            const outputRows_processeddata_file = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_processeddata_file) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'processeddata_file'
                    );
                    if (headerName =="type"){
                        value = "processeddata_file";
                    };
                    
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_processeddata_file.has(outputRowStr)) {
                    outputRows_processeddata_file.add(outputRowStr);
                    outputMatrix_processeddata_file.push(outputRow);
                }
                
            }
            // combine the flourescence_reagents in the same file_name and remove duplicate
            for (let i = 1; i < outputMatrix_processeddata_file.length; i++){
                const filename = outputMatrix_processeddata_file[i][1];
                let value = outputMatrix_processeddata_file[i][2];
                for(let j = i+1; j < outputMatrix_processeddata_file.length; j++){
                    if(outputMatrix_processeddata_file[j][1] === filename && outputMatrix_processeddata_file[j][2]!==value){
                        value = value + ','+ outputMatrix_processeddata_file[j][2];
                    }
                }
                for(let z = i; z < outputMatrix_processeddata_file.length; z++){
                    if(outputMatrix_processeddata_file[z][1] == filename){
                        outputMatrix_processeddata_file[z][2] = value;
                    }
                    
                }
            }
            const uniqueOutputMatrix_processeddata_file = [];
            const uniqueOutputRows_processeddata_file = new Set();
            for (const outputRow of outputMatrix_processeddata_file) {
                const outputRowStr = JSON.stringify(outputRow);
                if (!uniqueOutputRows_processeddata_file.has(outputRowStr)) {
                    uniqueOutputRows_processeddata_file.add(outputRowStr);
                    uniqueOutputMatrix_processeddata_file.push(outputRow);
                }
            }

            logs.push(["processed data file is done"]);

            // data analysis 
            const ExportHeaders_data_analysis_msm = new Map([
                ["type", []], //data_analysis_msm
                ["submitter_id", []],
                ["data_analysis_id", ["data_analysis_id"],],
                ["analysis_protocol", []],
                ["analysis_protocol_DOI", []],
                ["rawdata_files.submitter_id", []],
                ["Normalization", []],
                ["Transformation", []],
                ["TransformationPurpose", []],
                ["TransformationDescription", []],
                ["processeddata_files.submitter_id", []],
                ["unit", []],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_data_analysis_msm, sourceFields, 'data_analysis_msm');

            // Copy headers to 1st row of new export table
            const outputMatrix_data_analysis_msm = [[...ExportHeaders_data_analysis_msm.keys()]];
            const outputRows_data_analysis_msm = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_data_analysis_msm) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'data_analysis_msm'
                    );
                    if (headerName =="type"){
                        value = "data_analysis_msm";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_data_analysis_msm.has(outputRowStr)) {
                    outputRows_data_analysis_msm.add(outputRowStr);
                    outputMatrix_data_analysis_msm.push(outputRow);
                }

            } 
            logs.push(["data_analysis_msm is done"]);

            // instrument
            const ExportHeaders_instrument = new Map([
                ["type", []], //instrument
                ["submitter_id", []],
                ["manufacturer", []],
                ["model", ["model"],],
                ["scan_polarity", []],
                ["ionization_type", []],
                ["detector_type", []],
                ["mass_analyzer_type", []],
                ["provenance", ["experiement template version"],],
            ]);
            dh.getHeaderMap(ExportHeaders_instrument, sourceFields, 'instrument');

            // Copy headers to 1st row of new export table
            const outputMatrix_instrument = [[...ExportHeaders_instrument.keys()]];
            const outputRows_instrument = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_instrument) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'instrument'
                    );
                    if (headerName =="type"){
                        value = "instrument";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_instrument.has(outputRowStr)) {
                    outputRows_instrument.add(outputRowStr);
                    outputMatrix_instrument.push(outputRow);
                }

            } 
            logs.push(["instrument is done"]);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              async function myFunction() {
                exportFile(outputMatrix_extraction, "extraction", "tsv");
                await delay(1000);
                exportFile(outputMatrix_chromatography, "chromatography", "tsv");
                await delay(1000);
                exportFile(outputMatrix_ms_method, "ms_method", "tsv");
                await delay(1000);
                exportFile(uniqueOutputMatrix_rawdata_file, "rawdata_file", "tsv");
                await delay(1000);
                exportFile(outputMatrix_instrument, "instrument", "tsv");
                await delay(1000);
                exportFile(uniqueOutputMatrix_processeddata_file, "processeddata_file", "tsv");
                await delay(1000);
                exportFile(outputMatrix_data_analysis_msm, "data_analysis_msm", "tsv");
              }
              myFunction();
            return logs

        }
    },

    gen3_submit_metaboliteID:{
        fileType: 'tsv',
        status: 'published',
        method: function (dh){
            const ExportHeaders = new Map([
                ["type", []], //metaboliteID
                ["submitter_id", ["metabolite_name"], ],
                ["data_analysis_msmes.submitter_id", []],
                ["metabolite_name", []],
                ["refmet_name", []],
                ["dtxsid", []],
                ["inchikey", []],
                ["mass", []],
                ["elution_time", []],
                ["provenance", []],
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
                        'gen3_submit_metaboliteID'
                    );
                    if (headerName =="type"){
                        value = "metaboliteID";
                    }
                    outputRow.push(value);
                }
            outputMatrix.push(outputRow);
            }

        return outputMatrix;

        }
    },

};

