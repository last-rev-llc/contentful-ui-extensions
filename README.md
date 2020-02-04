# Last Rev UI Extension Library
A collection of UI Extensions for Contentful like a Color picker, SEO, Categories and more.

## Getting Started

##### Clone the repository
```
git clone git@github.com:last-rev-llc/contentful-ui-extensions.git
```
##### Install Dependencies
```
npm install 
```
OR
```
yarn install
```

##### Start the application
```
npm start
```

### Running Locally
In order to help streamline the process of development we have created a mock SDK that allows you to run the extensions locally with hot reload. You can also use this to see mock examples of the expected response from Contentful and data structure or objects.

#### Open the browser
> http://localhost:3000/

This will be a list of all available UI Extensions.

##### Individual Extensions
- [Color Picker](http://localhost:3000/color-picker)
- [SEO](http://localhost:3000/seo)

### Using in Contentful
To see the extension in your Contentful instance follow the directions below for each extension

#### Prerequisites
You need an account for Contentful to use these extensions. 
- Go to [www.contentful.com](https://www.contentful.com/sign-up/?utm_campaign=lastrev-ui-extension)
- Fill out the form and you will go to your first space
- Please Follow the instructions for [Installing and using Extensions](https://www.contentful.com/developers/docs/extensibility/ui-extensions/managing-a-ui-extension-with-webapp/)

[ ] TODO: SEO Needs to add docs for adding an app [Using Apps Alpha](https://www.contentful.com/developers/docs/extensibility/apps/building-apps/)

### Installing
[ ] TODO: Step by Step instructions to setup a UI extension and App

## Application Structure
```
.
├── public
├── src
│   ├── __mocks__
│   ├── extensions
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

##### Running Tests
Normal watch mode
```
npm test
```

Runs in verbose and gives coverage report
```
npm run fulltest
```

### Testing Structure
```
.
├── __mocks__
│   ├── mockContentfulAsset.js          # Mock Asset response from Contentful
│   ├── mockContentfulContentType.js    # Mock Content Type Response from Contentful
│   └── mockContentfulSdk.js            # Mock SDK used for mocking functions and data returned by Contentful
└── ...
```

## Deployment

[ ] TODO

## Built With

* [Create Ract App](https://github.com/facebook/create-react-app)
* [Contentful Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
* [Contentful UI Extensions](https://www.contentful.com/developers/docs/extensibility/ui-extensions/)

## Contributing

[ ] TODO

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Brad Taylor** - *Initial work* - [bradtaylorsf](https://github.com/bradtaylorsf)

See also the list of [contributors](https://github.com/last-rev-llc/contentful-ui-extensions/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details