<p align="center">
Michigan State University Superfund Research Center <br>
<b> CIMR_1.0.0 Contextual Data Curation </b>
</p>

## Contextual Data (Metadata) Curation
<p align="center">  <img src="https://img.shields.io/badge/status-work%20in%20progress-yellow" alt="Work in Progress">  <br>  <strong>🚧 This repository is a work in progress 🚧</strong>  <br> Please check in regularly for updates .  If you have any questions feel free to contact the ToxRSCat team using <i>issues</i> or by email.</p>

---
### Table of Contents
1. [Overview](#overview)<br>
1. [Usage](#usage)<br>
	a. [Getting to know _DataHarmonizer_](#familiorize)<br>

<a id="overview"></a>
### Overview
The purpose for this template is to harmonize the metadata collection for metabolomics experiments performed using mass spectrometry and support the submission to the [Metabolomics Workbench](https://www.metabolomicsworkbench.org/) repository. 

These templates were developed by the [Michigan Sate University Superfund Research Center Data Management and Analysis Core](https://iit.msu.edu/centers/superfund/) and are intended to be used with [_DataHarmonizer_](https://github.com/cidgoh/DataHarmonizer): 

```mermaid
graph RL

classDef investigation fill:#f0ff02;
classDef study fill:#ffcc00;
classDef samples fill:#ccffcc;
classDef assay font-style:italic;

style AF fill:#ccebff, font-weight:bold;
style GH fill:#ffffcc, font-weight:bold;

subgraph AF[MIATE/MIACA]
  style B fill:#ffcc00;
  style E fill:#ffcc00;
  B[subject 1] --> A[Study]
  C[Sample 1] --> B
  D[Sample 2] --> B
  E[Subject 2] --> A
  F[Sample 1] --> E
end

subgraph GH[ms_metabolomics]
  style G fill:#f0ff02;
  G[Aliquots] --> F
  G[Aliquots] --> C
  G[Aliquots] --> D
  H[mass_spec_assay] --> G
  I[metabolite_id] --> H
end
```

<a id="usage"></a>
---
### How to use the metabolomics templates
> :bulb: **We're testing out Scribe! [Click here](https://scribehow.com/embed/Mass_Spectrometry_metadata_collection__yfuie1rTSrK4OJ26z6t9PQ?skipIntro=true) for a quick walkthrough.**

 <a id="familiorize"></a>
#### 1.  Familiarize yourself with _DataHarmonizer_<br>

Before beginning to collect your (meta)data it is strongly recommended that you familiarize yourself with [_DataHarmonizer_](https://github.com/cidgoh/DataHarmonizer#usage) created by the Centre for Infectious Disease Genomics and One Health (CIDGOH), at Simon Fraser University. See the following video for an overview of _DataHarmonizer_.

[Click here for _DataHarmonizer_ video](https://youtu.be/rdN2_Vhwb8E)

#### _Notes_:
- __DataHarmonizer will not save your progress.__ It is good practice to save your work and upload the output next time you want to work on (meta)data collection.
- If you decide to fill some of the data offline using Excel, ensure that you meet the expectations for individual fields. These can be verified by uploading and validating.