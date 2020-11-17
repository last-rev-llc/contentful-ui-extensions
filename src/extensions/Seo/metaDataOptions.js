const metaDataOptions = [
  {
    tag: 'select',
    value: 'robots',
    label: 'Search Engine Visibility',
    cssClass: 'data-default',
    help: 'Should search engines index this content?',
    options: [
      { value: 'index,follow', label: 'Index' },
      { value: 'noindex,nofollow', label: "Don't Index" }
    ]
  },
  {
    tag: 'input',
    value: 'title',
    label: 'Page Title',
    cssClass: 'data-default',
    help: 'Browser tab and search engine result display.'
  },
  {
    tag: 'textarea',
    value: 'description',
    label: 'Meta Description',
    cssClass: 'data-default',
    help: 'The short description in search engine result display.'
  },
  {
    tag: 'textarea',
    value: 'keywords',
    label: 'Meta Keywords',
    help: 'Keywords used for search engine indexing.'
  },
  {
    tag: 'input',
    value: 'og:title',
    label: 'Social Sharing Title',
    help: 'Used as the title when the content is shared on social networks.'
  },
  {
    tag: 'textarea',
    value: 'og:description',
    label: 'Social Sharing Description',
    help: 'Used as the description when the content is shared on social networks.'
  },
  {
    tag: 'image',
    value: 'og:image',
    label: 'Social Sharing Image',
    help: 'Used as the thumbnail when the content is shared on social networks.'
  },
  {
    tag: 'image',
    value: 'twitter:image',
    label: 'Twitter Sharing Image',
    help: 'Used as the thumbnail when the content is shared on Twitter.'
  }
];

export default metaDataOptions;
