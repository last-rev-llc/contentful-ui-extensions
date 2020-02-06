curl -X POST \
  -H'Content-Type: application/json' \
  -H'Authorization: Bearer <CONTENTFUL_MGMT_API>' \
  -d'{"name": "Testing new LOCAL Last Rev: SEO", "src": "<APP URL>", "locations": [{"location": "app-config"}, {"location": "entry-field", "fieldTypes": [{"type": "Object"}]}]}' \
  https://api.contentful.com/organizations/<ORG_ID>/app_definitions