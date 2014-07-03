#metric²

metric² is a self-service BI tool using responsive web based dashboards to display health and performance KPI's of your SAP HANA Database, Platform or Applications.

### Screenshot
![Screenshot 1](http://url/screenshot-software.png "screenshot software")

![Screenshot 2](http://url/screenshot-software.png "screenshot software")

## Download
* [Version 2.0](https://github.com/paschmann/metric2/archive/master.zip)
* [Version 1.0](http://www.metric2.com/downloads/metric2currentrelease.zip)

## Installation
####Section 1 - File download and install to HANA

#####**Delivery Unit** (SAP HANA Package)

- Download the delivery unit package here and upload using the SAP HANA Web Admin Tool: Lifecycle Manager 

#####**Github** Install Directions

- Moves all files into a new project in eclipse and commit them from there

####Section 2 – Schema creation
Once you have all the asset files uploaded to your HANA instance, you will need to create the schema to support metric2. You can do this by opening and running the install script.sql file directly on your HANA instance. Currently the schema defaults to the name metric2.

####Section 3 – Sample data creation (optional)
Once you have completed sections 1 & 2, you can choose to run some scripts which will populate your metric2 system with sample/demo data. Select which sample data set you would like, and execute the sql file included.


## Registration
Although not required, please could you register with the metric2 mailing list here: 
![Mailing List](http://metric2.us5.list-manage.com/subscribe/post?u=bc00508167f417118dc4580e4&id=ae3a0aed93 "metric2 mailing list")


## Version History
####Version 2.0
* New UI, no longer using SAPUI5
* Github release

####Version 1.0
Initial software developed

## Contact
* Homepage: http://www.metric2.com
* e-mail: info@metric2.com
* Twitter: [@metricsquared](https://twitter.com/metricsquared/ "metricsquared on twitter")

## Contributors
### Third party libraries
* see [LIBRARIES](https://github.com/username/sw-name/blob/master/LIBRARIES.md) files

## License 
* see [LICENSE](https://github.com/username/sw-name/blob/master/LICENSE.md) file
