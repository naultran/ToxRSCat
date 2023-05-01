import json
import os
import pandas as pd
from collections import OrderedDict
import yaml

# converting mircat type json into yaml

classes = "miflowcyt" # the name of total schema

## the name of subschema, in the folder, slot_group_schema would be the name of file
slot_group = ["miflowcyt", "biological_sample", "data_analysis", "environmental_sample", "experiment",
            "flow_cell", "fluorescence_reagent", "instrument", "light_source_instrument",   
            "optical_detector", "optical_filter", "organism", "organization", "primary_contact", "sample"]
## the folder store the mircat schema and future yaml file
folder_path = "/Users/apple/tox_Dataharmonier/web/templates/miflowcyt"

## create andataframe to merge different json file
df = pd.DataFrame(columns=["classes", "slot_group", "slots", "range", "enums", "description", "recommended", "required", "slot_uri(ontology)", "prefix_reference", "comments"])

for i in slot_group:
    file_path_schema = f"{folder_path}/mircat_schema/schema/{i}_schema.json"
    file_path_context = f"{folder_path}/mircat_schema/context/obo/{i}_obo_context.jsonld"
    schema = json.load(open(file_path_schema))
    if os.path.exists(file_path_context):
        with open(file_path_context) as f:
            context = json.load(f)
    else:
        context = 0
    slot_list = list(schema["properties"].keys())
    slot_list = [x for x in slot_list if x!= "@context"]
    slot_list = [x for x in slot_list if x!= "@id"]
    slot_list = [x for x in slot_list if x!=  "@type"]
    for j in slot_list:
        dic_row = {"classes": classes, "slot_group": i, "slots": str(j)}
        if "type" in list(schema["properties"][j].keys()):
            if  schema["properties"][j]["type"] == "array":
                dic_row["range"] = "string"
            elif schema["properties"][j]["type"] == "object":
                dic_row["range"] = "string"
            elif schema["properties"][j]["type"] == "number":
                dic_row["range"] = "float"
            else: 
                dic_row["range"] = schema["properties"][j]["type"]
        else:
            dic_row["range"] = "string"

        if "description" in list(schema["properties"][j].keys()): 
            dic_row["description"] = schema["properties"][j]["description"]

        if "required" in list(schema.keys()):
            if j in list(schema["required"]):
                dic_row["required"] = "TRUE"
        if context != 0: 
            if j in list(context["@context"].keys()):
                dic_row["slot_uri(ontology)"] = context["@context"][j]
                uriname = context["@context"][j].split(':')[0]
                dic_row["prefix_reference"] = context["@context"][uriname]

        if "$ref" in list(schema["properties"][j].keys()):
            dic_row["comments"] = f'expected type: {schema["properties"][j]["$ref"]}'
            
        
        df = df.append(dic_row, ignore_index=True)

# edit the repeated slots
def add_suffix(col):
    new_col = []
    i = 0
    for val in col:
        if val not in new_col:
            new_col.append(val)
        else:
            new_col.append(f"{val}_{df.iloc[i, 1]}")
        i = i+1
    return new_col

df['slots'] = add_suffix(df['slots'])


## dictionary for yaml file
dir = OrderedDict()
dir["id"] = f'https://example.com/{classes}'
dir["name"] = f'{classes}'
dir["description"] = '' # if you want to add some description about this template, add it here
dir["version"] = '1.0.0'
dir["imports"] = "linkml:types"
dir["prefixes"] = {}
dir["prefixes"]["linkml"] = "https://w3id.org/linkml/"
if df["prefix_reference"].notnull().any():
    prefix =  list(df["prefix_reference"].value_counts().index)
    for i in prefix:
        linkname = i.split('/')[-2]
        dir["prefixes"][f'{linkname}'] = f'{i}'
dir["classes"] ={}
dir["slots"] = {}
dir["types"] ={}
if df["enums"].notnull().any():
    dir["enums"] = {}
dir["settings"] = {}
# class part
classes_have = list(df["classes"].value_counts().index)
dir["classes"]["dh_interface"]={}
dir["classes"]["dh_interface"]["name"] = "dh_interface"
dir["classes"]["dh_interface"]["description"] = "A DataHarmonizer interface"
dir["classes"]["dh_interface"]["from_schema"] = f'https://example.com/{classes}'
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

# slot part

for i in df["slots"]:
    
    dir["slots"][f'{i}'] = {}
    dir["slots"][f'{i}']['name'] = f'{i}'
    dir["slots"][f'{i}']['title'] = f'{i}'
    subset_df = df.loc[df["slots"] == i, :]
    range = subset_df["range"].iloc[0]
    if range == "string": 
        dir["slots"][f'{i}']['range'] = 'WhitespaceMinimizedString'
    elif range == "enum":
        dir["slots"][f'{i}']['range'] =f'{i} menu'
    else:
        dir["slots"][f'{i}']['range'] =f'{range}'

    if (df.loc[df["slots"] == i, "description"]).any():
        description = subset_df["description"].iloc[0]
        dir["slots"][f'{i}']['description']= f'{description}'
    else:
        dir["slots"][f'{i}']['description']= " "
    
    if (df.loc[df["slots"] == i, "recommended"]).any():
        dir["slots"][f'{i}']['recommended'] = True

    if (df.loc[df["slots"] == i, "required"]).any():
        dir["slots"][f'{i}']['required'] = True
    
    if (df.loc[df["slots"] == i, "slot_uri(ontology)"]).any():
        slot_uri = subset_df["slot_uri(ontology)"].iloc[0]
        dir["slots"][f'{i}']['slot_uri']  = f'{slot_uri}'

    if (df.loc[df["slots"] == i, "comments"]).any():
        comment = subset_df["comments"].iloc[0]
        dir["slots"][f'{i}']['comments']= f'{comment}'
    else:
        dir["slots"][f'{i}']['comments']= " "
    
# edit types part
dir["types"]["WhitespaceMinimizedString"] ={}
dir["types"]["WhitespaceMinimizedString"]["name"] = "WhitespaceMinimizedString"
dir["types"]["WhitespaceMinimizedString"]["typeof"] = "string"
dir["types"]["WhitespaceMinimizedString"]["description"] ="A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return)."
dir["types"]["WhitespaceMinimizedString"]["base"] = 'str'
dir["types"]["WhitespaceMinimizedString"]["uri"] = 'xsd:token'
# if enum
if df["enums"].notnull().any():
    having_enum = df.loc[df["enums"].notnull(), :]
    for i in having_enum.index:
        dir["enums"][f"{df.iloc[i, 2]} menu"] = {}
        dir["enums"][f"{df.iloc[i, 2]} menu"]["name"] = f"{df.iloc[i, 2]} menu"
        dir["enums"][f"{df.iloc[i, 2]} menu"]["permissible_values"] = {}
        choice_list = df.iloc[i, 4].split(',')
        for j in choice_list:
            dir["enums"][f"{df.iloc[i, 2]} menu"]["permissible_values"][f'{j}'] = {}
            dir["enums"][f"{df.iloc[i, 2]} menu"]["permissible_values"][f'{j}']['text'] = f'{j}'


dir["settings"]["Title_Case"] = '(((?<=\\b)[^a-z\\\\W]\\\\w*?|[\\\\W])+)'
dir["settings"]["UPPER_CASE"] = '[A-Z\W\d_]*'
dir["settings"]["lower_case"] = '[a-z\W\d_]*'

with open(f"{folder_path}/schema.yaml", 'w') as f:
    yaml.dump(dict(dir), f, sort_keys=False)
        