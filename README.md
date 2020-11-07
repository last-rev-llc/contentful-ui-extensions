# Last Rev UI Extension Library

A collection of UI Extensions for Contentful like a Color picker, SEO, Categories and more.

## Getting Started

### Clone the repository

```shell
git clone git@github.com:last-rev-llc/contentful-ui-extensions.git
```

### Install Dependencies

```shell
npm install
```

OR

```shell
yarn install
```

### Start the application

```shell
npm start
```

### Running Locally

In order to help streamline the process of development we have created a mock SDK that allows you to run the extensions locally with hot reload. You can also use this to see mock examples of the expected response from Contentful and data structure or objects.

#### Open the browser

> [http://localhost:3000/](http://localhost:3000/)

This will be a list of all available UI Extensions.

### Using in Contentful

To see the extension in your Contentful instance follow the directions below for each extension.
> When running locally you will need to allow "unsafe" scripts to be allowed. This is because you run localhost with http and since Contentful injects it using an iFrame browsers will block them by default.

#### Individual Extension Documentation

- [Address](https://github.com/last-rev-llc/contentful-ui-extensions/tree/master/src/extensions/Address)
- [Color Picker](https://github.com/last-rev-llc/contentful-ui-extensions/tree/master/src/extensions/ColorPicker)
- [SEO](https://github.com/last-rev-llc/contentful-ui-extensions/tree/master/src/extensions/Seo)
- [PersonName](https://github.com/last-rev-llc/contentful-ui-extensions/tree/master/src/extensions/PersonName)
- [PhoneNumber](https://github.com/last-rev-llc/contentful-ui-extensions/tree/master/src/extensions/PhoneNumber)

### Prerequisites

You need an account for Contentful to use these extensions.

- Go to [www.contentful.com](https://www.contentful.com/sign-up/?utm_campaign=lastrev-ui-extension)
- Fill out the form and you will go to your first space
- Please Follow the instructions for [Installing and using Extensions](https://www.contentful.com/developers/docs/extensibility/ui-extensions/managing-a-ui-extension-with-webapp/)

### Application Structure

```text
.
├── public
├── src
│   ├── __mocks__
│   ├── extensions
│   ├── ├── BynderImages
│   ├── ├── ColorPicker
│   ├── ├── PersonName
│   ├── ├── PhoneNumber
│   ├── ├── Seo
│   ├── shared
├── history.js
├── index.js
├── .env.local
├── .eslintrc.js
├── .gitignore
├── .nvmrc
└── README.md
```

## Testing

We use [Jest](https://jestjs.io/) and [React Testing Library](https://github.com/testing-library/react-testing-library) for all integration testing.

### Running Tests

Normal watch mode

```shell
npm test
```

### Mocks

```text
.
├── __mocks__
│   ├── mockContentfulAsset.js          # Mock Asset response from Contentful
│   ├── mockContentfulContentType.js    # Mock Content Type Response from Contentful
│   └── mockContentfulSdk.js            # Mock SDK used for mocking functions and data returned by Contentful
│   └── mockLocations.js                # Mock locations for Contentful
└── extensions
│   ├── Seo                             # Each extension has a _mocks_ folder and a mockFieldValue and mockAppConfig (for apps alpha)
│   ├── ├── __mocks__                   # mockFieldValue and mockAppConfig for SEO
```

## Deployment

You can deploy this to Netlify with one click

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions/)

## Built With

- [Create React App](https://github.com/facebook/create-react-app)
- [Contentful Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
- [Contentful UI Extensions](https://www.contentful.com/developers/docs/extensibility/ui-extensions/)

## Contributing

If you would like to contribute please submit a pull request. Make sure you write tests and it passes the linter before submitting.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Brad Taylor** - *Initial work* - [bradtaylorsf](https://github.com/bradtaylorsf)

See also the list of [contributors](https://github.com/last-rev-llc/contentful-ui-extensions/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
