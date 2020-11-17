# Last Rev: SEO

The Last Rev SEO extension can be used to enable content creators to add meta data to websites for page titles, descriptions, and social sites like Facebook and Twitter

## Setup Instructions

1. [Click here to deploy](https://app.netlify.com/start/deploy?repository=https://github.com/last-rev-llc/contentful-ui-extensions) to Netlify or deploy this repo to a hosting provider of your choice.
2. Create a new UI Extension in your space and choose thos following Options:
    - Name: SEO
    - Field Types: Object
    - Hosting: Self-hosted(src)
    - Self-Hosted URL: [https://your-extension-domain.netlify.com/seo](https://your-extension-domain.netlify.com/seo)
3. Create an Object (JSON) field in your content model you want to use the SEO field
4. On the Content Model page, select "Settings" on the new JSON field you added
5. Go to Appearance and select your new UI Extension

## Output Example

```json
{
  "title": {
    "name": "title",
    "value": "Last Rev | Connecting the modern web"
  },
  "robots": {
    "name": "robots",
    "value": "index,follow"
  },
  "keywords": {
    "name": "keywords",
    "value": "contentful, ui extensions, react, seo"
  },
  "og:image": {
    "name": "og:image",
    "value": {
      "id": "5VwseUvM96DL4TCKH42IM6",
      "url": "https://images.ctfassets.net/9o4l1mrd1tci/5VwseUvM96DL4TCKH42IM6/d05b9b4773e44de340dc50051c8b5bf2/Screen_Shot_2019-08-30_at_1.10.13_PM.png",
      "title": "My Facebook Image"
    }
  },
  "og:title": {
    "name": "og:title",
    "value": "Last Rev | My facebook title is different"
  },
  "description": {
    "name": "description",
    "value": "Morbi fringilla convallis sapien, id pulvinar odio volutpat. Nec dubitamus multa iter quae et nos invenerat. At nos hinc posthac, sitientis piros Afros."
  },
  "twitter:image": {
    "name": "twitter:image",
    "value": {
      "id": "2OjCqPfrMWmUxlCHOT4ovc",
      "url": "https://images.ctfassets.net/9o4l1mrd1tci/2OjCqPfrMWmUxlCHOT4ovc/e61c74e8219f0b1e8dd0c9d10b4c426b/Screen_Shot_2020-01-23_at_8.09.12_AM.png",
      "title": "Screen Shot 2020-01-23 at 8.09.12 AM"
    }
  },
  "og:description": {
    "name": "og:description",
    "value": "Morbi fringilla convallis sapien, id pulvinar odio volutpat. Nec dubitamus multa iter quae et nos invenerat. At nos hinc posthac, sitientis piros Afros."
  },
  "twitter:description": {
    "name": "twitter:description",
    "value": "Morbi fringilla convallis sapien, id pulvinar odio volutpat. Nec dubitamus multa iter quae et nos invenerat. At nos hinc posthac, sitientis piros Afros."
  }
}
```

## Reporting Issues

If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!
