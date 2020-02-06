const mockAppConfig = {
  siteName: 'Last Rev',
  pageTitleDelimiter: '|',
  defaultSocialImageId: '1234asdf',
  editorInterface: {
    seoApp: {
      controls: [
        {
          fieldId: 'seo',
          settings: {
            defaultNoIndex: 'noindex,nofollow',
            defaultPageTitleField: 'title',
            defaultDescriptionField: 'description',
            defaultSocialImageField: 'mainImage',
          }
        },
      ]
    }
  }
};

export default mockAppConfig;

