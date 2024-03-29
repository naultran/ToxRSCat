#TODO: Provide a simple description of what this code does and an example.
#For example:

# excel_schema.py
# Converts an excel template into a LinkML file for generating a DataHarmonizer
# template. 
#
# Created by: Shuangyu Zhao
#
# Input examples, from template/MIFlowCyt/ folder:
#
# > excel_schema.py -i MIFlowCyt_template.xlsx
# > excel_schema.py -i https://raw.githubusercontent.com/.../master/MIATE_template.xlsx

import yaml
import os
import pandas as pd
from collections import OrderedDict
import argparse
import numpy as np


parser = argparse.ArgumentParser()
parser.add_argument("-i", "--input", help="input file path")

args = parser.parse_args()

if args.input:
    # do something with the input file path
    print(f"Input file path: {args.input}")
else:
    print("No input file path provided.")

## after converting to yaml, you should edit setting part and imports part manually
#TODO: Remove the need to manually edit

 #TODO: Can we use -i instead?
df = pd.read_excel(args.input, sheet_name="LinkML_slots")
df_descript = pd.read_excel(args.input, sheet_name="LinkML_description")

direc = os.path.dirname(args.input)
name = os.path.splitext(os.path.basename(args.input))[0]

#TODO: Can we use multiple sheets in the excel document? One with the overall details and another with the individual info.
#TODO: Add comments
dir = OrderedDict()

# Import the high-level schema details 
dir["id"] = df_descript["id"][0]
dir["name"] = df_descript["name"][0]
dir["description"] = df_descript["description"][0] # if you want to add some description about this template, add it here
dir["version"] = df_descript["version"][0]
dir["imports"] = "linkml:types" # Why not write imports the same way as prefix reference to avoid having to manually change it?
dir["prefixes"] = {}
dir["prefixes"]["linkml"] = "https://w3id.org/linkml/"
if df["prefix_reference"].notnull().any():
    prefix =  list(df["prefix_reference"].value_counts().index)
    for i in prefix:
        linkname = i.split('/')[-2]
        dir["prefixes"][f'{linkname}'] = f'{i}'
linkname
# Create empty dictionary slots to import schema details
dir["classes"] ={}
dir["slots"] = {}

if df["enums"].notnull().any():
    dir["enums"] = {}
    
dir["types"] ={}
dir["settings"] = {}

# Build schema classes
classes_have = list(df["classes"].value_counts().index)

# Schema needs to include a dh_interface for use as a template with DataHarmonizer
dir["classes"]["dh_interface"]={}
dir["classes"]["dh_interface"]["name"] = "dh_interface"
dir["classes"]["dh_interface"]["description"] = "A DataHarmonizer interface"
dir["classes"]["dh_interface"]["from_schema"] = f'https://example.com/{name}'

# Import classes from the excel template
#TODO: we should also include a "see_also:" field which can link to a PDF file with instructions on how to use.
for i in classes_have:
    dir["classes"][f'{i}'] = {}
    dir["classes"][f'{i}']['name'] = f'{i}'
    dir["classes"][f'{i}']['is_a'] = 'dh_interface'
    sub_df = df.loc[df["classes"] == i,:]
    dir["classes"][f'{i}']["slots"] = list(sub_df["slots"])
    k = 1
    dir["classes"][f'{i}']["slot_usage"] ={}
    for z in sub_df["slots"]:
        dir["classes"][f'{i}']["slot_usage"][f'{z}'] = {}
        dir["classes"][f'{i}']["slot_usage"][f'{z}']['rank'] = k
        dir["classes"][f'{i}']["slot_usage"][f'{z}']['slot_group'] = f'{sub_df.iloc[k-1, 1]}'
        k += 1     

# Build schema slots
for i in df["slots"]:
    
    dir["slots"][f'{i}'] = {}
    dir["slots"][f'{i}']['name'] = f'{i}'
    subset_df = df.loc[df["slots"] == i, :]

    # title
    if (df.loc[df["slots"] == i, "name"]).any():
        dir["slots"][f'{i}']['title'] =subset_df["name"].iloc[0]
    else: 
        dir["slots"][f'{i}']['title'] = f'{i}'
    # range
    range = subset_df["range"].iloc[0]
    if range == "string": 
        dir["slots"][f'{i}']['range'] = 'WhitespaceMinimizedString'
    elif range == "enum":
        dir["slots"][f'{i}']['range'] =f'{i} menu'
    elif range == "provenance":
        dir["slots"][f'{i}']['range'] ='Provenance'
    else:
        dir["slots"][f'{i}']['range'] =f'{range}'

    # regex
    if (df.loc[df["slots"] == i, "regex"]).any():
        regex = subset_df["regex"].iloc[0]
        dir["slots"][f'{i}']["pattern"] = f'{regex}'

    # max
    if (df.loc[df["slots"] == i, "maximum"]).any():
        maximum_value = subset_df["maximum"].iloc[0]
        dir["slots"][f'{i}']["maximum_value"] = float(maximum_value)

    if subset_df["minimum"].notna().any():
        minimum_value = subset_df["minimum"].iloc[0]
        dir["slots"][f'{i}']["minimum_value"] = float(minimum_value)

    
    # description
    if (df.loc[df["slots"] == i, "description"]).any():
        description = subset_df["description"].iloc[0]
        dir["slots"][f'{i}']['description']= f'{description}'
    else:
        dir["slots"][f'{i}']['description']= " "
    
    if (df.loc[df["slots"] == i, "recommended"]).any():
        dir["slots"][f'{i}']['recommended'] = True

    if (df.loc[df["slots"] == i, "required"]).any():
        dir["slots"][f'{i}']['required'] = True
    
    if (df.loc[df["slots"] == i, "is_identifier"]).any():
        dir["slots"][f'{i}']['identifier'] = True

    if (df.loc[df["slots"] == i, "multivalued"]).any():
        dir["slots"][f'{i}']['multivalued'] = True
    
    if (df.loc[df["slots"] == i, "inlined_as_list"]).any():
        dir["slots"][f'{i}']['inlined_as_list'] = True
    
    if (df.loc[df["slots"] == i, "slot_uri(ontology)"]).any():
        slot_uri = subset_df["slot_uri(ontology)"].iloc[0]
        dir["slots"][f'{i}']['slot_uri']  = f'{slot_uri}'

    if (df.loc[df["slots"] == i, "comments"]).any():
        comment = subset_df["comments"].iloc[0]
        dir["slots"][f'{i}']['comments']= f'{comment}'
    else:
        dir["slots"][f'{i}']['comments']= " "
    


# Populate enumeration fields for dropdown menus
#TODO: Enumerations should always also include GENEPIO:0001619 "Not Applicable", GENEPIO:0001618 "Missing", GENEPIO:0001620 "Not Collected", GENEPIO:0001668 "Not Provided", GENEPIO:0001810 "Restricted Access"
if df["enums"].notnull().any():
    having_enum = df.loc[df["enums"].notnull(), :]
    for i in having_enum.index:
        name_slot = df["slots"][i]
        dir["enums"][f"{name_slot} menu"] = {}
        dir["enums"][f"{name_slot} menu"]["name"] = f"{name_slot} menu"
        dir["enums"][f"{name_slot} menu"]["permissible_values"] = {}
        choice_list = df["enums"][i].split(';') 
        for j in choice_list:
            dir["enums"][f"{name_slot} menu"]["permissible_values"][f'{j}'] = {}
            dir["enums"][f"{name_slot} menu"]["permissible_values"][f'{j}']['text'] = f'{j}'
        null_value = ["Not applicable", "Missing", "Not collected", "Not provided", "Restricted access"]
        for z in null_value:
            dir["enums"][f"{name_slot} menu"]["permissible_values"][f'{z}'] = {}
            dir["enums"][f"{name_slot} menu"]["permissible_values"][f'{z}']['text'] = f'{z}'

# List the potential data types #is this correct?#edit types part
dir["types"]["WhitespaceMinimizedString"] ={}
dir["types"]["WhitespaceMinimizedString"]["name"] = "WhitespaceMinimizedString"
dir["types"]["WhitespaceMinimizedString"]["typeof"] = "string"
dir["types"]["WhitespaceMinimizedString"]["description"] ="A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return)."
dir["types"]["WhitespaceMinimizedString"]["base"] = 'str'
dir["types"]["WhitespaceMinimizedString"]["uri"] = 'xsd:token'

dir["types"]["Provenance"] ={}
dir["types"]["Provenance"]["name"] = "Provenance"
dir["types"]["Provenance"]["typeof"] = "string"
dir["types"]["Provenance"]["description"] ="A field containing a DataHarmonizer versioning marker. It is issued by DataHarmonizer when validation is applied to a given row of data."
dir["types"]["Provenance"]["base"] = 'str'
dir["types"]["Provenance"]["uri"] = 'xsd:token'

dir["settings"]["Title_Case"] = '(((?<=\\b)[^a-z\\\\W]\\\\w*?|[\\\\W])+)'
dir["settings"]["UPPER_CASE"] = '[A-Z\W\d_]*'
dir["settings"]["lower_case"] = '[a-z\W\d_]*'

with open("./schema.yaml", 'w') as f:
    yaml.dump(dict(dir), f, sort_keys=False, default_flow_style=False)