import json
import streamlit as st
import os
import pandas as pd

file_path1 = st.text_input("ENTER FILE PATH1(json file)")
file_path2 = st.text_input("ENTER FILE PATH(json file)")

name1 =  os.path.dirname(file_path1).split("/")[-1]
name2 =  os.path.dirname(file_path2).split("/")[-1]

json_File1 = json.load(open(file_path1))
json_File2 = json.load(open(file_path2))

element1 = [key.lower() for key in json_File1['slots'].keys()]
element2 = [key.lower() for key in json_File2['slots'].keys()]


all_element = list(set(element1).union(set(element2)))
dict1 = {elem: elem in element1 for elem in all_element}
dict2 = {elem: elem in element2 for elem in all_element}
df = pd.DataFrame({f'{name1}': dict1, f'{name2}': dict2})

st.dataframe(df)