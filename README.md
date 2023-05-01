

# ToxRSCat
A catalogue of machine actionable environmental health science related reporting standards for use with DataHarmonizer

## produce your own template
### step one


### step two

## 1. Excel to LinkML
#### Dependencies
Python 3.9
Pandas v..
linkml
....

#### How-to
Use this method to go from an excel template formatted according to [this template](./script/LinkML_template.xlsx). __DO NOT CHANGE SHEET NAMES__. 
After adding all the appropriate information:

- Run excel_schema.py -i {path_to_xlsx_file} #must include atleast a root path (e.g., "./template.xlsx")
This code will generates a schema.yaml file which is a LinkML representation of the information in the excel template. 

- Next run limkml.py (from DataHarmonizer repository). This will output a schema.json file in the path you are running it from (make sure you are in the correct place). 

- The changes need to be added to the menu.json so that they can be visualized in DataHarmonizer.
