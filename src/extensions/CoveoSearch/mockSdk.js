let providers = [
  {
    sys: {
      id: "mock-provider-1"
    }
  },
  {
    sys: {
      id: "mock-provider-2"
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
      return {
        displayField: "title",
        name: "provider"
      };
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
      return location === "dialog";
    }
  },
  dialogs: {
    openExtension: () => {}
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
