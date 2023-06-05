import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';
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
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
            const exportConfigs =[
                {
                    exportHeaders: new Map([
                        ["type", []], //extraction
                        ["submitter_id", []], //metabolomic_experiment_identifier
                        ["samples.submitter_id", []],
                        ["extraction_protocol", []],
                        ["extraction_protocol_DOI", []],
                        ["derivitization", []],
                        ["extract_preservation_method", []],
                        ["calibration_standard", []],
                        ["provenance", ["experiement template version"],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "extraction",
                },
                {
                    exportHeaders: new Map([
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
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "chromatography",
                },
                {
                    exportHeaders: new Map([
                        ["type", []], //ms_method
                        ["submitter_id", []], 
                        ["extractions.submitter_id", []], 
                        ["name", ["ms_method.name"],],
                        ["ms_protocol", []],
                        ["ms_protocol_DOI", []],
                        ["provenance", ["experiement template version"],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "ms_method",
                },
                {
                    exportHeaders: new Map([
                        ["type", []], //rawdata_file
                        ["submitter_id", []],
                        ["extractions.submitter_id", []],
                        ["file_name", ["rawDataFile"]],
                        ["provenance", ["experiement template version"],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "rawdata_file",
                },
                {
                    exportHeaders: new Map([
                        ["type", []], //processeddata_file
                        ["submitter_id", []],
                        ["extractions.submitter_id", []],
                        ["file_name", ["processedDataFile"]],
                        ["provenance", ["experiement template version"],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "processeddata_file",
                },
                {
                    exportHeaders: new Map([
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
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "data_analysis_msm",
                },
                {
                    exportHeaders: new Map([
                        ["type", []], //instrument
                        ["submitter_id", []],
                        ["manufacturer", []],
                        ["model", ["model"],],
                        ["scan_polarity", []],
                        ["ionization_type", []],
                        ["detector_type", []],
                        ["mass_analyzer_type", []],
                        ["provenance", ["experiement template version"],],
                    ]),
                    uid: "submitter_id",
                    outputMatrix: [[]],
                    exportType: "instrument",
                },
            ]
            
            
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

