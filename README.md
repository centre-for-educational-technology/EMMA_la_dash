# emma-dashboard

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

# Pre-requisites

node.js
grunt grunt-cli bower yo generator-karma generator-angular (glkobal)

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
