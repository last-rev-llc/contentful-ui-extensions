const providerContentType = {
  sys: {
    space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
    id: "provider",
    type: "ContentType",
    createdAt: "2020-01-16T19:49:47.854Z",
    updatedAt: "2020-01-16T19:49:48.265Z",
    environment: {
      sys: { id: "master", type: "Link", linkType: "Environment" }
    },
    publishedVersion: 1,
    publishedAt: "2020-01-16T19:49:48.265Z",
    firstPublishedAt: "2020-01-16T19:49:48.265Z",
    createdBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    },
    updatedBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    },
    publishedCounter: 1,
    version: 2,
    publishedBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    }
  },
  displayField: "title",
  name: "provider",
  description: "provider description goes here",
  fields: [
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false
    }
  ]
};

let providers = [
  {
    sys: {
      space: {
        sys: {
          type: "Link",
          linkType: "Space",
          id: "o8vbqs3spmqj"
        }
      },
      type: "Entry",
      id: "mock-provider-1",
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "provider"
        }
      },
      revision: 2,
      createdAt: "2020-05-26T16:47:03.959Z",
      updatedAt: "2020-06-17T19:39:13.522Z",
      environment: {
        sys: {
          id: "master",
          type: "Link",
          linkType: "Environment"
        }
      },
      locale: "en-US"
    },
    fields: {
      title: "John Smith"
    }
  },
  {
    sys: {
      space: {
        sys: {
          type: "Link",
          linkType: "Space",
          id: "o8vbqs3spmqj"
        }
      },
      type: "Entry",
      id: "mock-provider-2",
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "provider"
        }
      },
      revision: 2,
      createdAt: "2020-05-26T16:47:03.959Z",
      updatedAt: "2020-06-17T19:39:13.522Z",
      environment: {
        sys: {
          id: "master",
          type: "Link",
          linkType: "Environment"
        }
      },
      locale: "en-US"
    },
    fields: {
      title: "janet Davidson"
    }
  }
];

let changeHandler = () => {};

const field = {
  getValue: () => {
    return providers;
  },
  setValue: p => {
    providers = p;
    changeHandler(p);
  },
  onValueChanged: handler => {
    changeHandler = handler;
  }
};

const searchPageName = "contentful_uie_provider";

const endpoint = "https://microservices.uwhealth.dev/contentful-coveo-search";
const type = "Saved Search";

const mockSdk = {
  field,
  space: {
    getContentType: () => {
      return providerContentType;
    }
  },
  parameters: {
    instance: {
      searchPageName
    },
    installation: {
      endpoint,
      type
    },
    invocation: {
      field,
      endpoint,
      type,
      searchPageName
    }
  },
  location: {
    is: location => {
      // return location === 'entry-field';
      // return location === 'app-config';
      return location === "dialog";
    }
  },
  dialogs: {
    openExtension: () => {
      window.alert("hey");
    }
  },
  platformAlpha: {
    app: {
      onConfigure: () => {}
    }
  },
  notifier: {
    error: window.alert
  }
};

export default mockSdk;
