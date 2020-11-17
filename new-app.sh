curl -X POST \
  -H'Content-Type: application/json' \
  -H'Authorization: Bearer <CONTENTFUL_MGMT_API>' \
  -d'{"name": "LOCAL Last Rev: SEO", "src": "http://localhost:3000/seo", "locations": ["app", "entry-field"], "fieldTypes": [{"type": "Object"}]}' \
  https://api.contentful.com/organizations/3zfj70Xm2lKIeJmRkM5HnS/app_definitions