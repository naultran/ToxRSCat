# Toxicology Reporting Standard Catalogue (ToxRSCat)

<p align="center">  <img src="https://img.shields.io/badge/status-work%20in%20progress-yellow" alt="Work in Progress">  <br>  <strong>🚧 This repository is a work in progress 🚧</strong>  <br> Please check in regularly for updates .  If you have any questions feel free to contact the ToxRSCat team using <i>issues</i> or by email.</p>

----
### Table of Contents
1. [Skip to Data Collection!](#skip-to-the-real-thing)
	a. [Follow with scribe](google.com) 
2. [Overview of ToxRSCat](#overview)<br>
	a. Dependencies<br>
3. [Capturing minimum requirement standards](#updateRS)<br>
4. [Machine-actionable metadata models](#ma)<br>
	a. Creating and revising metadata models <br>
5. [Using ToxRSCat (web)](#changeRS)<br>
6. [Using ToxRSCat (local)](#TDC)

 <a id="overview"></a>
## Overview to ToxRSCat
The toxicology reporting standard catalogue is a community-based effort to catalogue reporting standards to support the collection of essential metadata associated with environmental health experiments. ToxRSCat is a collection of machine actionable metadata requirements using [LinkML schemas](https://linkml.io/) and supporting implementation using [DataHarmonizer](http://3.90.137.203:8080/).

_Development of ToxRSCat was supported by the National Institutes of Environmental Health Science (NIEHS)._
- Michigan State University Superfund Research Center ([P42ES004911](iit.msu.edu)).
### Dependencies
```
python_version == 3.9.*
pandas
linkml
```

<a id="updateRS"></a>
## Capturing minimum requirement standards
Our goal is to capture the consensus set of minimally required metadata for the diverse study designs and endpoints relevant to the environmental health research community <!-- ([see our commentary in EHP](google.com))-->. Standards are continuously evolving and so there is a need to be agile in our development of templates, collection mechanisms, and respositories. For more information on how we develop the standards in ToxRSCat and how to contribute following [this link](https://github.com/naultran/ToxRSCat/tree/main/templates#readme). 

<a id="ma"></a>
## Machine-actionable metadata models
__In progress:__ Outline the value of machine-actionable metadata models. See [Batista et al. 2022](https://pubmed.ncbi.nlm.nih.gov/36180441/) for an excellent primer. 

## Using ToxRSCat (web version)
ToxRSCat uses machine-actionable models to support use of diverse collection tools and resources. However, to accelerate adoption we have implemented a workflow from (meta)data collection to data depositing leveraging [DataHarmonizer](http://3.90.137.203:8080/) and a [Gen3 data commons - ToxDataCommons](fairtox.com).

> We're testing out Scribe! [Click here](google.com) to follow along with this tutorial 

#### 1.  Go to ToxDataCommons-DataHarmonizer
[Click here](http://3.90.137.203:8080/) to go to our live instance of ToxDataCommons-DataHarmonizer.

#### 2. Familiarize yourself with the available types of (meta)data that can be collected.
We currently support the following  types of study designs and data:

__Study designs__

- [_In vivo_](https://github.com/naultran/ToxRSCat/tree/main/templates/miate#readme) (MIATE: Minimum Information about Animal Toxicology Experiments)
- [_In vitro_](https://github.com/naultran/ToxRSCat/tree/main/templates/miaca#readme) (MIACA: Minimum Information about Cellular Assays)

__Assays__ 

- [Histology imaging](https://github.com/naultran/ToxRSCat/tree/main/templates/REMBI#readme) (REMBI: Recommended Metadata for Biological Imaging)
- [Flow Cytometry](https://github.com/naultran/ToxRSCat/tree/main/templates/miflowcyt#readme) (MIFlowCyt: Minimum Information about Flow Cytometry Experiments)
- [Mass Spec Metabolomics](https://github.com/naultran/ToxRSCat/tree/main/templates/ms_mettabolomics#readme) (CIMR: Core Information for Metabolomics Reporting) 

#### 3. Collecting (meta)data
_Instructions here - just like excel!_

#### 4. Save your work!

#### 5. Export for depositing into ToxDataCommons

#### 6. Submit your data to ToxDataCommons

## Using ToxRSCat (local version)
_Not currently developed - see DataHarmonizer for instructions._