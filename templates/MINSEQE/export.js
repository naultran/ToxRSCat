// A dictionary of possible export formats
import { exportFile, exportJsonFile } from './/../../../DataHarmonizer/lib/utils/files';
import {removeDuplicateRows, removeDuplicatesAndCollapse} from './/../../script/tools';


export default {
    gen3_aliquot: {
        fileType: 'tsv',
		status: 'published',
		method: function(dh) {
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);

			const exportConfigs = [
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "aliquot.submitter_id"]],
                        ["samples.submitter_id", ["studyID", "sample.submitter_id"]],
                        ["analyte_type", []],
                        ["analyte_protocol", []],
                        ["extract_preservation_method", []],
                        ["a260_a280_ratio", []],
                        ["RIN", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "aliquot",
                }
            ];
            for (const exportConfig of exportConfigs) {
				dh.getHeaderMap(exportConfig.exportHeaders, sourceFields, exportConfig.exportType);
				exportConfig.outputMatrix.push([...exportConfig.exportHeaders.keys()]);

				for (const inputRow of dh.getTrimmedData(dh.hot)) {
					const outputRow = [];
					for (const [headerName, sources] of exportConfig.exportHeaders) {
						let value = dh.getMappedField(
							headerName,
							inputRow,
							sources,
							sourceFields,
							sourceFieldNameMap,
							':',
							exportConfig.exportType
						);
						if (headerName === "type") {
							value = exportConfig.exportType;
						}
						outputRow.push(value);
					}
					exportConfig.outputMatrix.push(outputRow);
				}
				const finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, 'tsv');
			}
			return logs;
        }
    },
    gen3_Sequencing: {
        fileType: 'tsv',
		status: 'published',
		method: function(dh) {
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);

			const exportConfigs = [
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "submitter_id"]],
                        ["aliquots.submitter_id", ["studyID", "aliquots.submitter_id"]],
                        ["adapter_sequence", []],
                        ["barcoding_applied", []],
                        ["base_caller_name", []],
                        ["base_caller_version", []],
                        ["flow_cell_barcode", []],
                        ["spike_ins", []],
                        ["instrument_model", []],
                        ["is_paired_end", []],
                        ["library_preparation_kit_catalog_number", []],
                        ["library_preparation_kit_name", []],
                        ["library_preparation_kit_vendor", []],
                        ["library_preparation_kit_version", []],
                        ["library_selection", []],
                        ["library_strand", []],
                        ["library_strategy", []],
                        ["platform", []],
                        ["read_length", []],
                        ["sequencing_center", []],
                        ["sequencing_date", []],
                        ["size_selection_range", []],
                        ["spike_ins_concentration", []],
                        ["spike_ins_fasta", []],
                        ["target_capture_kit_catalog_number", []],
                        ["target_capture_kit_name", []],
                        ["target_capture_kit_target_region", []],
                        ["target_capture_kit_vendor", []],
                        ["target_capture_kit_version", []],
                        ["target_depletion_kit_catalog_number", []],
                        ["target_depletion_kit_name", []],
                        ["target_depletion_kit_target_region", []],
                        ["target_depletion_kit_vendor", []],
                        ["target_depletion_kit_version", []],
                        ["to_trim_adapter_sequence", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "read_group",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "unaligned_read_file"]],
                        ["read_groups.submitter_id", ["studyID", "submitter_id"]],
                        ["file_name", []],
                        ["data_category", []],
                        ["data_format", []],
                        ["data_type", []],
                        ["file_size", []],
			["md5sum", []],
			["object_id", []],
                        ["SRA_accession_id", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "unaligned_read",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "QC_file"]],
                        ["read_groups.submitter_id", ["studyID", "submitter_id"]],
                        ["unaligned_reads.submitter_id", ["studyID", "unaligned_read_file"]],
                        ["file_name", []],
                        ["data_category", []],
                        ["data_format", []],
                        ["data_type", []],
                        ["file_size", []],
						["md5sum", []],
						["object_id", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "unaligned_reads_qc",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "aligned_read_file"]],
                        ["read_groups.submitter_id", ["studyID", "submitter_id"]],
                        ["file_name", []],
                        ["data_category", []],
                        ["data_format", []],
                        ["data_type", []],
                        ["file_size", []],
			["md5sum", []],
			["object_id", []],
                        ["SRA_accession_id", []],
                        ["workflow_type", []],
                        ["workflow_link", []],
                        ["workflow_version", []],
                        ["reference_genome", []],
                        ["reference_build", []],
                        ["reference_source", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "aligned_read",
                }
            ];
            for (const exportConfig of exportConfigs) {
				dh.getHeaderMap(exportConfig.exportHeaders, sourceFields, exportConfig.exportType);
				exportConfig.outputMatrix.push([...exportConfig.exportHeaders.keys()]);

				for (const inputRow of dh.getTrimmedData(dh.hot)) {
					const outputRow = [];
					for (const [headerName, sources] of exportConfig.exportHeaders) {
						let value = dh.getMappedField(
							headerName,
							inputRow,
							sources,
							sourceFields,
							sourceFieldNameMap,
							':',
							exportConfig.exportType
						);
						if (headerName === "type") {
							value = exportConfig.exportType;
						}
						outputRow.push(value);
					}
					exportConfig.outputMatrix.push(outputRow);
				}
				const finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, 'tsv');
			}
			return logs;
        }
    },
    gen3_Sequencing_data_analysis: {
        fileType: 'tsv',
		status: 'published',
		method: function(dh) {
            const logs = [[]];
			const sourceFields = dh.getFields(dh.table);
			const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);

			const exportConfigs = [
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "analysis.submitter_id"]],
                        ["aligned_reads.submitter_id", ["studyID", "aligned_reads.submitter_id"]],
                        ["workflow_type", []],
                        ["workflow_link", []],
                        ["workflow_version", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "alignment_workflow",
                },
                {
                    exportHeaders: new Map([
                        ["type", []],
                        ["submitter_id", ["studyID", "analysis_file"]],
                        ["alignment_workflows.submitter_id", ["studyID", "analysis.submitter_id"]],
                        ["file_name", []],
                        ["data_category", []],
                        ["data_format", []],
                        ["data_type", []],
                        ["file_size", []],
						["md5sum", []],
						["object_id", []],
                        ["SRA_accession_id", []],
                    ]),
                    uid: "submitter_id",
					outputMatrix: [[]],
					exportType: "aligned_reads_analyzed_data",
                }
            ];
            for (const exportConfig of exportConfigs) {
				dh.getHeaderMap(exportConfig.exportHeaders, sourceFields, exportConfig.exportType);
				exportConfig.outputMatrix.push([...exportConfig.exportHeaders.keys()]);

				for (const inputRow of dh.getTrimmedData(dh.hot)) {
					const outputRow = [];
					for (const [headerName, sources] of exportConfig.exportHeaders) {
						let value = dh.getMappedField(
							headerName,
							inputRow,
							sources,
							sourceFields,
							sourceFieldNameMap,
							':',
							exportConfig.exportType
						);
						if (headerName === "type") {
							value = exportConfig.exportType;
						}
						outputRow.push(value);
					}
					exportConfig.outputMatrix.push(outputRow);
				}
				const finalMatrix = removeDuplicatesAndCollapse(exportConfig.outputMatrix, exportConfig.uid);
				logs.push([`${exportConfig.exportType} information is done`]);
				exportFile(finalMatrix, exportConfig.exportType, 'tsv');
			}
			return logs;
        }
    }
};
