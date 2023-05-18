

# ToxRSCat
A catalogue of machine actionable environmental health science related reporting standards for use with DataHarmonizer



## 1. Excel to LinkML
#### Dependencies
Python 3.9
Pandas v..
linkml
....

#### How-to
Use this method to go from an excel template formatted according to [this template](./script/LinkML_template.xlsx). __DO NOT CHANGE SHEET NAMES__. 
After adding all the appropriate information:

- Run excel_schema.py -i {path_to_xlsx_file}
This code will generates a schema.yaml file which is a LinkML representation of the information in the excel template. 

- Next run limkml.py (from DataHarmonizer repository). This will output a schema.json file in the path you are running it from (make sure you are in the correct place). 

- The changes need to be added to the menu.json so that they can be visualized in DataHarmonizer.

## 2. Requirement for schema
#### a. Always keep the first column in every dataframe to be the unique ID.

#### b. if the multiple dataframes in one project have columns with the same name, please set the slots in the excel template to be < slot_group >.< name >, and set the name in the excel to be < name >.
For example:
The __sample__ , __investigation__ and __study__ dataframes in __miate__ project all need __subject_identifier__. 

- In the __miaca_template.xlsx__ with __classes__ == "sample", please insert __sample.subject_identifier__ in the __slots__ column, and then, insert __subject_identifier__ in the __name__ column.

- In the __miaca_template.xlsx__ with __classes__ == "investigation", please insert __investigation.subject_identifier__ in the __slots__ column, and then, insert __subject_identifier__ in the __name__ column.

- In the __miaca_template.xlsx__ with __classes__ == "study", please insert __study.subject_identifier__ in the __slots__ column, and then, insert __subject_identifier__ in the __name__ column.

