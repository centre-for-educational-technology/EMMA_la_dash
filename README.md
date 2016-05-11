# emma-dashboard

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

# Pre-requisites

node.js
grunt grunt-cli bower yo generator-karma generator-angular (global)

# Install

YO stuff

npm install (sudo if needed)
bower install

## Build & development

Run `grunt` for building and `grunt serve` for preview.

There are 2 types of dashboard available: student and teacher.
The constant defining the type is located in `app/scripts/services/dashboard_type.js`
The constant values are either `teacher` or `student`.

## Testing

Running `grunt test` will run the unit tests with karma.

## Usage

Configure `apiLocation` if needed in `app/scripts/services/api_location.js`
Please make sure that location of the service is configured, in case of no
configuration provided it will be assumed to reside at the same URL within the
`api` catalog.

Run `grunt build` and get the package from `dist`

Make sure to place the files to be served

Make sure that the API is provided at the configured location or within the
catalog called `api`
API code is located in [standalone repository](https://github.com/centre-for-educational-technology/EMMA_la_dash_API)

The default view will hint that the tool works with `/course/:id` or `#/course/:id/student/:email`,
thus the teacher URL would look like `#/course/:id`
the student URL would look like `#/course/:id/student/:email`

# Releasing

Releasing consists on two main steps: building corresponding distributives and releasing new version on GitHub. The latter one also includes uploading these distributives there.

1. Change version in **bower.json**, then commit and push
1. Make sure to have development package cloned and clean (**NB! Build process uses local files**)
1. Make changes in accordance with the built system: student or teacher dashboardType, BASE tag value, apiLocation value and anything else
  1. BASE tag value in index.html should be set to **/lib/la/StudentDashboard/** for **student** Dashboard
  1. BASE tag value in index.html should be set to **/lib/la/TeacherDashboard/** for **teacher** Dashboard
1. Remove **ACE** script from index.html file (http://platform.europeanmoocs.eu/lib/ace/assets/js/ace.min.js)
1. Trigger **grunt build** task for student and teacher Dashboards
  1. Make sure that **dashboardType** is correct
1. Create a .zip archive from created **dist/** catalog
  1. Make sure to rename the catalog to match current type: **DashboardStudentDist** or **DashboardTeacherDist**
  1. Archive should have the same name.
1. Create corresponding release tag in GitHub and upload these archives there

# Upgrade

## 1.3.0 - 1.4.0

* A <base> tag got added. Please set it to the correct path that should be used
in your setup, default value is domain root **/**.
* Get suitable package (please make sure to use either teacher or student one)
* Extract the code and place that to a suitable location
* Make sure to set the **base** to the correct one in the **index.html**
* Make sure to check out the **sctiprs/scripts.*.js** file and set the
**apiLocation** constant value to a correct path or URL.
* Open the dashboard and see it all is working well (pay attention to any errors
  in the console or just error messages returned by API)
