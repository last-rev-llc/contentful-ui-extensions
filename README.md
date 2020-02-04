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


Say what the step will be

```
Give the example
```

And repeat

```
until finished
```
## Application Structure
.
├── public                   # Compiled files (alternatively `dist`)
├── src                    # Documentation files (alternatively `doc`)
│   ├── __mocks__ 
│   ├── extensions
│   ├── shared                    # Source files (alternatively `lib` or `app`)
├── history.js                    # Automated tests (alternatively `spec` or `tests`)
├── index.js                   # Tools and utilities
├── .env.local
├── .eslintrc.js
├── .gitignore
├── .nvmrc
└── README.md

## Testing
We use Jest and React Testing Library for all integration testing.
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
.
├── __mocks__                    # Test files (alternatively `spec` or `tests`)
│   ├── mockContentfulAsset.js          # Load and stress tests
│   ├── mockContentfulContentType.js         # End-to-end, integration tests (alternatively `e2e`)
│   └── mockContentfulSdk.js                # Unit tests
└── ...


### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
