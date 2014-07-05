#metric²

metric² is a self-service BI tool using responsive web based dashboards to display health and performance KPI's of your SAP HANA Database, Platform or Applications. Dashboards are built from a set of customizable widgets.

### Features

Check out the metric² Website here [www.metric2.com](http://www.metric2.com "www.metric2.com")

### Code

The code is written in Javascript, HTML5, CSS and uses XSJS (SAP HANA specific) for server side scripting.

### Screenshots
![Screenshot1.png](http://metric2.com/img/Screenshot1.png)

![Screenshot2.png](http://metric2.com/img/Screenshot2.png)

## Download
* [Version 2.0](https://github.com/paschmann/metric2/archive/master.zip)
* [Version 1.0](http://metric2.us5.list-manage.com/subscribe/post?u=bc00508167f417118dc4580e4&id=ae3a0aed93) (requires signup and is the HANA Delivery unit file)

## Installation

####Prerequisites

SAP HANA SPS6+ (SAP In-memory DB)

XS Engine running (HTTP Server built into SAP HANA)


####Section 1 - File download and install to HANA

#####**Delivery Unit** (SAP HANA Package)

- Download the delivery unit package here and upload using the SAP HANA Web Admin Tool: Lifecycle Manager 

#####**Github** Install Directions

- Moves all files into a new project in eclipse and commit them from there

####Section 2 – Schema creation
Once you have all the asset files uploaded to your HANA instance, you will need to create the schema to support metric2. You can do this by opening and running the install script.sql file directly on your HANA instance. Currently the schema defaults to the name metric2.

####Section 3 – Sample data creation (optional)
Once you have completed sections 1 & 2, you can choose to run some scripts which will populate your metric² system with sample/demo data. Select which sample data set you would like, and execute the sql file included.


## Registration
Although not required, please could you register with the metric² mailing list here: 
![Mailing List](http://metric2.us5.list-manage.com/subscribe/post?u=bc00508167f417118dc4580e4&id=ae3a0aed93 "metric2 mailing list")


## Version History
####Version 2.0
* New UI, no longer using SAPUI5
* Github release

####Version 1.0
* Initial software developed
* Uses SAPUI5 as a UI frameowrk

## Contact
* Homepage: http://www.metric2.com
* e-mail: info@metric2.com
* Twitter: [@metricsquared](https://twitter.com/metricsquared/ "metricsquared on twitter")

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
