import { exportFile, exportJsonFile } from '../../../lib/utils/files';
// A dictionary of possible export formats
export default {

    /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */
    gen3_submit_all_miflowcyt:{
        fileType: 'tsv',
        status: 'published',
        method: function(dh){
            // flourescence reagent
            const ExportHeaders_fr = new Map([
                ["type", []], //flourescence_reagent
                ["submitter_id", []],
                ["samples.submitter_id", []],
                ["instruments.submitter_id", []], 
                ["staining_protocol", []],
                ["staining_protocol_DOI", []],
                ["characteristics_being_measured", []],
                ["analyte_detector", []],
                ["analyte_reporter", []],
                ["clone_name_or_number", []],
                ["reagent_manufacturer_name", []],
                ["reagent_catalogue_number", []],
                ["staining_status", []],
                ["other_fluorescence_reagent", []],
                ["provenance", ["template version"]],
            ]);
            const sourceFields = dh.getFields(dh.table);
            const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_fr, sourceFields, 'flourescence_reagent');

            // Copy headers to 1st row of new export table
            const outputMatrix_fr = [[...ExportHeaders_fr.keys()]];
            const outputRows_fr = new Set();
            const logs = [[]];

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_fr) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'flourescence_reagent'
                    );
                    if (headerName =="type"){
                        value = "flourescence_reagent";
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_fr.has(outputRowStr)) {
                    outputRows_fr.add(outputRowStr);
                    outputMatrix_fr.push(outputRow);
                }

            } 
            logs.push(["flourescence_reagent is done"]);

            // data analysis
            // submitter_id of data analysis is auto-signed
            const ExportHeaders_dataana = new Map([
                ["type", []], // data_analysis
                ["submitter_id", []], 
                ["analysis_protocol", []],
                ["analysis_protocol_DOI", []],
                ["FCS_files.submitter_id", []],
                ["compensation_description", []],
                ["transformation_purpose", []],
                ["transformation_description", []],
                ["gate_description", []],
                ["gate_statistics", []],
                ["gate_boundaries", []],
                ["WS_files.submitter_id", []],
                ["provenance", ["template version"]],
            ]);
            // Fills in the above mapping (or just set manually above)
            dh.getHeaderMap(ExportHeaders_dataana, sourceFields, 'data_analysis');

            // Copy headers to 1st row of new export table
            const outputMatrix_dataana = [[...ExportHeaders_dataana.keys()]];
            const outputRows_dataana = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_dataana) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'data_analysis'
                    );
                    if (headerName =="type"){
                        value = "data_analysis_miflowcyt";
                    }
                    ;
                    if (headerName =="submitter_id"){
                          const FCS_file_name = dh.getMappedField(
                            "listModeDataFile",
                            inputRow,
                            ["listModeDataFile"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'data_analysis'
                          );
                          const WS_file_name = dh.getMappedField(
                            "WorkspaceFile",
                            inputRow,
                            ["WorkspaceFile"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'data_analysis'
                          );
                        value = `FCS_${FCS_file_name}.WS_${WS_file_name}`
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_dataana.has(outputRowStr)) {
                    outputRows_dataana.add(outputRowStr);
                    outputMatrix_dataana.push(outputRow);
                }


            } 
            for (let i = 1; i <= outputMatrix_dataana.length - 1; i++) {
                const submitterId = outputMatrix_dataana[i][1] + "_" + i.toString();
                outputMatrix_dataana[i][1] = submitterId;
            }
            logs.push(["data_analysis is done"]);



            // FCS
            // submitter_id of FCS is the name
            const ExportHeaders_fcs = new Map([
                ["type", []], //FCS
                ["submitter_id", ["listModeDataFile"]],
                ["flourescence_reagents.submitter_id", []], 
                ["file_name", []],
                ["provenance", ["template version"]],
            ]);
            dh.getHeaderMap(ExportHeaders_fcs, sourceFields, 'FCS');

            // Copy headers to 1st row of new export table
            const outputMatrix_fcs = [[...ExportHeaders_fcs.keys()]];
            const outputRows_fcs = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_fcs) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'FCS'
                    );
                    if (headerName =="type"){
                        value = "FCS_file";
                    };
                    
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_fcs.has(outputRowStr)) {
                    outputRows_fcs.add(outputRowStr);
                    outputMatrix_fcs.push(outputRow);
                }
                
            }
            // combine the flourescence_reagents in the same file_name and remove duplicate
            for (let i = 1; i < outputMatrix_fcs.length; i++){
                const filename = outputMatrix_fcs[i][1];
                let value = outputMatrix_fcs[i][2];
                for(let j = i+1; j < outputMatrix_fcs.length; j++){
                    if(outputMatrix_fcs[j][1] === filename && outputMatrix_fcs[j][2]!==value){
                        value = value + ','+ outputMatrix_fcs[j][2];
                    }
                }
                for(let z = i; z < outputMatrix_fcs.length; z++){
                    if(outputMatrix_fcs[z][1] == filename){
                        outputMatrix_fcs[z][2] = value;
                    }
                    
                }
            }
            const uniqueOutputMatrix_fcs = [];
            const uniqueOutputRows_fcs = new Set();
            for (const outputRow of outputMatrix_fcs) {
                const outputRowStr = JSON.stringify(outputRow);
                if (!uniqueOutputRows_fcs.has(outputRowStr)) {
                    uniqueOutputRows_fcs.add(outputRowStr);
                    uniqueOutputMatrix_fcs.push(outputRow);
                }
            }

            logs.push(["FCS file is done"]);

            // WS
            // submitter_id of WS is is the name
            const ExportHeaders_ws = new Map([
                ["type", []], //WS
                ["submitter_id", ["WorkspaceFile"]],
                ["flourescence_reagents.submitter_id", []], 
                ["file_name", []],
                ["provenance", ["template version"]],
            ]);
            dh.getHeaderMap(ExportHeaders_ws, sourceFields, 'WS');

            // Copy headers to 1st row of new export table
            const outputMatrix_ws = [[...ExportHeaders_ws.keys()]];
            const outputRows_ws = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_ws) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'WS'
                    );
                    if (headerName =="type"){
                        value = "WS_file";
                    }
                    
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_ws.has(outputRowStr)) {
                    outputRows_ws.add(outputRowStr);
                    outputMatrix_ws.push(outputRow);
                }

                

            } 
            // combine the flourescence_reagents in the same file_name and remove duplicate
            for (let i = 1; i < outputMatrix_ws.length; i++){
                const filename = outputMatrix_ws[i][1];
                let value = outputMatrix_ws[i][2];
                for(let j = i+1; j < outputMatrix_ws.length; j++){
                    if(outputMatrix_ws[j][1] === filename && outputMatrix_ws[j][2]!== value){
                        value = value + ',' + outputMatrix_ws[j][2];
                    }
                }
                for(let z = i; z < outputMatrix_ws.length; z++){
                    if(outputMatrix_ws[z][1] == filename){
                        outputMatrix_ws[z][2] = value;
                    }
                    
                }
            }
            const uniqueOutputMatrix_ws = [];
            const uniqueOutputRows_ws = new Set();
            for (const outputRow of outputMatrix_ws) {
                const outputRowStr = JSON.stringify(outputRow);
                if (!uniqueOutputRows_ws.has(outputRowStr)) {
                    uniqueOutputRows_ws.add(outputRowStr);
                    uniqueOutputMatrix_ws.push(outputRow);
                }
            }

            logs.push(["WS file is done"]);

            // Instrument
            const ExportHeaders_instrument = new Map([
                ["type", []], //instrument
                ["submitter_id", []],
                ["flow_cell_type", []],
                ["other_flow_cell", []],
                ["manufacturer", []],
                ["configuration_settings", []],
                ["other_instrument", []],
                ["provenance", ["template version"]],
            ]);
            // Fills in the above mapping (or just set manually above)
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


            // light source instrument
            // submitter_id is auto-signed
            const ExportHeaders_lsi = new Map([
                ["type", []], //light_source_instrument
                ["submitter_id", []],
                ["instruments.submitter_id", []],
                ["light_source_type", []],
                ["excitatory_wave_length", []],
                ["power_at_excitatory_wave_length", []],
                ["polarization", []],
                ["beam", []],
                ["other_light_source_instrument", []],
                ["provenance", ["template version"]],
            ]);
            dh.getHeaderMap(ExportHeaders_lsi, sourceFields, 'light_source_instrument');

            // Copy headers to 1st row of new export table
            const outputMatrix_lsi = [[...ExportHeaders_lsi.keys()]];
            const outputRows_lsi = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_lsi) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'light_source_instrument'
                    );
                    if (headerName =="type"){
                        value = "light_source_instrument";
                    }
                    ;
                    if (headerName =="submitter_id"){
                          const instruments = dh.getMappedField(
                            "model",
                            inputRow,
                            ["model"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'light_source_instrument'
                          );
                        value = `${instruments}.LSI`
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_lsi.has(outputRowStr)) {
                    outputRows_lsi.add(outputRowStr);
                    outputMatrix_lsi.push(outputRow);
                }


            } 
            for (let i = 1; i <= outputMatrix_lsi.length - 1; i++) {
                const submitterId = outputMatrix_lsi[i][1] + "_" + i.toString();
                outputMatrix_lsi[i][1] = submitterId;
            }
            logs.push(["light source instrument is done"]);



            // optical filter
            // submitter_id is auto-signed
            const ExportHeaders_of = new Map([
                ["type", []], //light_source_instrument
                ["submitter_id", []],
                ["instruments.submitter_id", []],
                ["type_optical_filter", []],
                ["transmitted_wave_lengths", []],
                ["installation_date", []],
                ["other_optical_filter", []],
                ["provenance", ["template version"]],
            ]);
            dh.getHeaderMap(ExportHeaders_of, sourceFields, 'optical_filter');

            // Copy headers to 1st row of new export table
            const outputMatrix_of = [[...ExportHeaders_of.keys()]];
            const outputRows_of = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_of) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'optical_filter'
                    );
                    if (headerName =="type"){
                        value = "optical_filter";
                    }
                    ;
                    if (headerName =="submitter_id"){
                          const instruments = dh.getMappedField(
                            "model",
                            inputRow,
                            ["model"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'optical_filter'
                          );
                        value = `${instruments}.OF`
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_of.has(outputRowStr)) {
                    outputRows_of.add(outputRowStr);
                    outputMatrix_of.push(outputRow);
                }


            } 
            for (let i = 1; i <= outputMatrix_of.length - 1; i++) {
                const submitterId = outputMatrix_of[i][1] + "_" + i.toString();
                outputMatrix_of[i][1] = submitterId;
            }
            logs.push(["optical filter is done"]);


            // optical detector
            // submitter_id is auto-signed
            const ExportHeaders_od = new Map([
                ["type", []], //light_source_instrument
                ["submitter_id", []],
                ["instruments.submitter_id", []],
                ["name", []],
                ["type_optical_detector", []],
                ["voltage", []],
                ["amplification_type", []],
                ["amplification_factor", []],
                ["other_optical_detector", []],
                ["provenance", ["template version"]],
            ]);
            dh.getHeaderMap(ExportHeaders_od, sourceFields, 'optical_detector');

            // Copy headers to 1st row of new export table
            const outputMatrix_od = [[...ExportHeaders_od.keys()]];
            const outputRows_od = new Set();

            for (const inputRow of dh.getTrimmedData(dh.hot)) {
                const outputRow = [];
                for (const [headerName, sources] of ExportHeaders_od) {
                    // Otherwise apply source (many to one) to target field transform:
                    var value = dh.getMappedField(
                        headerName,
                        inputRow,
                        sources,
                        sourceFields,
                        sourceFieldNameMap,
                        ':',
                        'optical_detector'
                    );
                    if (headerName =="type"){
                        value = "optical_detector";
                    }
                    ;
                    if (headerName =="submitter_id"){
                          const instruments = dh.getMappedField(
                            "model",
                            inputRow,
                            ["model"],
                            sourceFields,
                            sourceFieldNameMap,
                            ':',
                            'optical_detector'
                          );
                        value = `${instruments}.OD`
                    }
                    outputRow.push(value);
                }
                const outputRowStr = JSON.stringify(outputRow);
                if (!outputRows_od.has(outputRowStr)) {
                    outputRows_od.add(outputRowStr);
                    outputMatrix_od.push(outputRow);
                }


            } 
            for (let i = 1; i <= outputMatrix_od.length - 1; i++) {
                const submitterId = outputMatrix_od[i][1] + "_" + i.toString();
                outputMatrix_od[i][1] = submitterId;
            }
            logs.push(["optical detector is done"]);


            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              async function myFunction() {
                exportFile(outputMatrix_fr, "flourescence_reagent", "tsv");
                await delay(2000);
                exportFile(outputMatrix_dataana, "data_analysis", "tsv");
                await delay(2000);
                exportFile(uniqueOutputMatrix_fcs, "FCS_file", "tsv");
                await delay(2000);
                exportFile(uniqueOutputMatrix_ws, "WS_file", "tsv");
                await delay(2000);
                exportFile(outputMatrix_instrument, "instrument", "tsv");
                await delay(2000);
                exportFile(outputMatrix_of, "optical_filter", "tsv");
                await delay(2000);
                exportFile(outputMatrix_od, "optical_detector", "tsv");
                await delay(2000);
                exportFile(outputMatrix_lsi, "light_source_instrument", "tsv");
              }
              myFunction();
            return logs

        }



  }
};
