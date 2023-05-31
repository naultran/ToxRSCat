# Contributing to ToxRSCat
Describe who, how, and when. The purpose of ToxRSCat and what is 'appropriate' and what isn't. How do we make sure it doesn't change too often once it is stable. Highlight that provenance is always added.

---
### Table of Contents
1. [Creating from a new reporting standard](#newRS)<br>
2. [Updating a reporting standard](#updateRS)<br>
3. [Changing terms and output](#changeRS)<br>
4. [Integrating with ToxDataCommons](#TDC)<br>
	a. [Updating data **export.js**](#familiorize)<br>
	b. [Testing](#starting)<br>
	
 <a id="newRS"></a>
## Creating a new reporting standard template 
(**major**.minor.patch)

> It is strongly recommeded that templates be based off of established reporting standards when one is available. Please lookup your data or study type at [FAIRsharing](fairsharing.org) or any other relevant resource to determine if a standard already exists. 


1. Download the excel template from [here](https://github.com/naultran/ToxRSCat/blob/main/script/LinkML_template.xlsx). For generating the first LinkML schema you will want to populate the __two__ sheets named "LinkML_description" and "LinkML_slots".
	
	A. _LinkML_description:_
	This sheet is used to provide an overall description of the template which will serve as source for the provenance. 
	
	| Column name | Description |
	|-----------------|----------------|
	| id |  This is the url to the metadata model (_e.g._ https://example.com/MIATE)|
	| name| This is the name of the metadata model (_e.g._ animal_toxicology_experiment)|
	| description | Describe the metadata model including requirement standard information, source, and developers. Add citations or other relevant information. Be as comprehensive as possible. |
	| version | Note the version of the requirement standard. Should follow the version control nomenclature outlined [here](https://github.com/cidgoh/DataHarmonizer#version-control) |
	| license| Assign the appropriate creative commons license. [See here](https://creativecommons.org/about/cclicenses/) for a list of options. |

	B. _LinkML_slots:_
	 This sheet defines the individual slot groups, column names, allowed terms, and more.
	| Column name | Description |
	|-----------------|----------------|
	| classes| Classes are broad categories that will appear as an individual template. This is used to collect different levels of metadata (_e.g._ project-level vs. sample-level)|
	| slot_group| Slot groups are used to organize the individual terms into groups of related terms (_e.g._ subject)|
	| slots| Slots are the individual terms that are being collected. These may or may not be the column names but will be what the value is assigned to.  |
	| name| This is the label that will show up as the column name. |
	| range| Type of data allowed. Can be one of: <br> - string <br> - date <br> - enum <br> - float |
	| minimum| Minimum value allowed if it is numerical |
	| maximum| Maximum value allowed if it is numerical |
	| regex| This is a regex formula used to validate a string|
	| multivalued| __TRUE__ or __FALSE__ for whether multiple values are allowed|
	| inlined_as_list| |
	| enums| List allowed values seperated by a ";" (_e.g._ Value A;Value B) |
	| description| The description will show up when a user clicks for more information on a term. Here you want to define what the term means. |
	| is_identifier| __TRUE__ or __FALSE__ for whether value must be unique|
	| recommended| __TRUE__ or __FALSE__ for whether term is recommended|
	| required| __TRUE__ or __FALSE__ for whether therm is required|
	| slot_uri(ontology)| Denote the onotology term (_e.g_ obo:NCI_C2150)|
	| prefix_reference| Provide the prefix for the URI (_e.g._ http://purl.obolibrary.org/obo/)|
	| comments| Here you can provide some examples. |
	 
__2. Convert the excel template into a LinkML schema.__
```
cd <path/to/folder/with/excel/template>
python <path/to/ToxRSCat/script/>excel_schema.py -i excel_template.xlsx
```

__3. Assign mapping data for export to external repositories if desired.__
	You will need to manually map each term to its node (output file). To do this open the `schema.yaml` file using your favorite text editor and go to the `slot_usage` section. For each slot that needs to be exported, edit using the following syntax:
```
    slot_usage:
      submitter_id:
        rank: 1
        slot_group: Identifiers
        exact_mappings: 
        - gen3_data:slide.submitter_id
        - gen3_slide:submitter_id
      aliquots.submitter_id:
        rank: 2
        slot_group: Identifiers
        exact_mappings: 
        - gen3_slide:aliquots.submitter_id
      ...
``` 
where __exact_mappings__ is a list of output names for each node it is exported to names gen3_<b><i>nodename</i></b> 

> This has to be reapeated for each class as each will have a slot_group section in the yaml file.

__4. Create an `export.js` file__
An `export.js` file is used to support the export functions. You can leave this empty an move forward but this will prevent the ability to export the data in the expected formats.

1. Start with our [export.js template](google.com). Download this file an place is in the same folder where the schema.json is.
2. Edit the relevant sections for your type of exported data. Here we provide an example on how to export the data for ToxDataCommons. More advanced knowledge of Javascript may be necessary to support other types of respositories.

__<i> Only change the exportConfigs section:</i>__
```
		const exportConfigs = [
			{
				exportHeaders: new Map([
				// See below for mapping headers
				]),
				uid:"submitter_id column mapping",
				outputMatrix: [[]],
				exportType: "gen3_<nodename>",
			},
			{
				exportHeaders: new Map([
				// See below for mapping headers
				]),
				uid:"submitter_id column mapping",
				outputMatrix: [[]],
				exportType: "gen3_<nodename_secondfile>",
			},
			...
		]
```
- uid is used to denote which column mapping should be used as the unique identifier (_e.g._ slide.submitter_id)
- outputMatrix does not change.
- exportType is used to allow export of multiple files from one template to map to individual nodes in ToxDataCommons.
- See below for header mappings.
```
exportHeaders: new Map([
	["type", []], // This should always be included
	["slide.submitter_id", []], // One column in the template should be a unique identifier for each file (or multiple files)
	["file_name", []], // This refers to the exact_mapping value in the linkML file
	...
	['provenance', ["slide template version"]] // The first part is the exact_mapping, the second part will be ...????
```

__5. Convert your LinkML schema to JSON for DataHarmonizer.__
```
python <path/to/DataHarmonizer/script/>linkml.py -i schema.yaml
```

__6. Submit your templates to the ToxRSCat team__
ToxRSCat is centrally managed to ensure that there is synergy between the templates and that ... Please see here to find out more about _[how to deploy your own ToxRSCat-DataHarmonizer](google.com)_

Submissions can be submitted as follows:

- Push request via Github.
- Email to [ToxRSCat](google.com) 


 <a id="updateRS"></a>
## Updating a reporting standard template 
(major.**minor**.patch)

 <a id="changeRS"></a>
## Changing a reporting standard template
(major.minor.**patch**)


 <a id="TDC"></a>
 ## Integrating with [ToxDataCommons](fairtox.com)