![metric2-bg.png](http://www.metric2.com/wp-content/uploads/2014/10/metric2-bg.png)

### Features 

Check out the metric² Website here [www.metric2.com](http://www.metric2.com "www.metric2.com") and you can test drive the demo version here [metric² demo](http://metric2.com/#screenshots "http://metric2.com/#screenshots")

### Code

The code is written in Javascript (Bootstrap), HTML5, CSS and uses XSJS (SAP HANA specific) for server side scripting.

## Download
* [Version 2.5.*](http://www.metric2.com/metric2-downloads/)

## Installation

####Prerequisites

SAP HANA SPS6+ (SAP In-memory DB)

XS Engine running (HTTP Server built into SAP HANA)


####Step 1 - File download and install to HANA

#####Otion 1: **Delivery Unit** (SAP HANA Package)

- Download the delivery unit package [here](http://www.metric2.com/metric2-downloads/) and upload using the SAP HANA Web Admin Tool: Lifecycle Manager
- Please follow the instructures [here](http://www.metric2.com/web-documentation/) on how to install.

####Step 2 – Schema creation
Once you have all the asset files uploaded to your HANA instance, you will need to create the schema to support metric2. This is done using a simple wizard which can be found in the install folder (install.html)

####Step 3 – Sample data creation (optional)
Once you have completed sections 1 & 2, you can choose to run some of the included sql scripts which will populate your metric² system with sample/demo data. Select which sample data set you would like from the install folder, and execute the sql file included.


## Registration
Although not required, please could you register with the metric² mailing list here: [Mailing List](http://www.metric2.com/metric2-downloads/ "metric2 mailing list")

## Contact
* Homepage: http://www.metric2.com
* e-mail: info@metric2.com
* Twitter: [@metricsquared](https://twitter.com/metricsquared/ "metricsquared on twitter")


## Version History

####Version 2.5.5
* Has a wizard based installer (see install instructions)

####Version 2.4+
* All versions from 2.4.0 on-wards now support SAP HANA SPS09 and is downward compatible (to SPS07)

####Version 2.0
* New UI, no longer using SAPUI5
* Github release

####Version 1.0
* Initial software developed
* Uses SAPUI5 as a UI frameowrk


## Contributors
### Third party libraries
* see [LIBRARIES](https://github.com/paschmann/metric2/blob/master/libraries.md) file

# License

|                      |                                          |                   
|:---------------------|:-----------------------------------------|
| **Author:**          | Paul Aschmann (<paschmann@li-labs.com>)
| **Copyright:**       | Copyright (c) 2010-2014 Lithium Labs, LLC
| **License:**         | Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
