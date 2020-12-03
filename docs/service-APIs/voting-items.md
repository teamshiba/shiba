# Service APIs: Voting & Items

## (1) Get a list of items in one group

Used to retrieve a list of added items.

```
GET /api/item/list
```

**Auth required** : `YES`

**Query Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `gid` | string | yes | Target matching room ID. |
| `voted_by` | string | no | If applied, include only items voted by that user. |
| `unvoted_by` | string | no | If applied, include only items not voted by that user. |
| `offset` | integer | no | Starting position in the table. By default: `0`. |
| `limit` | integer | no | Max size of response data. By default: `100`. |

- `voted_by` and `unvoted_by` takes `user_id` and only one of them can be used in one request.

**Success response** :

- **Code** : `200 OK`
- **Body** : items not voted by that users in that group. 

```json5
{
  "roomTotal" : 0, // total number of items in that group.
  "items" : [
    {
      "itemURL" : "<string>[The URL that links to the resource webpage.]",
      "name" : "<string>[The display name of that item.]",
      "imgURL": "<string>[The URL that store the key picture of that item.]",
    }
  ]
}
```

## (2) Vote for an item in a group

Used to like or hate an item in the candidate list.

```
PUT /api/voting
```

**Auth required** : `YES`

**Request body (JSON)** : 

| Attribute | Type | Required | Description |
| :------: | :-----: | :-----: | :--------- |
| `groupId` | string | yes | Target matching room ID. |
| `itemId` | string | yes | Global item ID. |
| `type` | integer | yes | Thumb up: `1`; thumb down: `-1`. |

**Success response** :

- **Code** : `200 OK`
- **Body** : the same as requesting `/api/item/list?gid=<current_room>&unvoted=<uid>`

**Error responses**

(1) Not authorized

- **Condition** : If the user is not logged in, or the user is not a member of that matching group. 

- **Code** : `401 unauthorized`

- **Content** :

```json
{
    "msg": "Login required. / Not a member of this room. "
}
```

(2) Bad request.

- **Condition** : Target item is not added to that matching room. 

- **Code** : `400 bad request`

- **Content** :

```json
{
    "msg": "Invalid target item. "
}
```

## (3) Add an item

Used to add an item to cache, and optionally add it to a group's item list.

```
POST /api/item
```

**Auth required** : `YES`

**Request body (JSON)** : 

| Attribute | Type | Required | Description |
| :------: | :-----: | :-----: | :--------- |
| `itemId` | string | yes | Global item ID. |
| `groupId` | string | yes | Target matching room ID. |
| `type` | integer | yes | Thumb up: `1`; thumb down: `-1`. |

```json5
{
  "groupId": "[optional, adding the item to group while caching that item.]",
  "item": {
    "itemId": "fixed-id",
    "imgURL": "",
    "name": ""  ,
    "itemURL": ""
  }
}
```

## (4) Search for items using the Yelp API

Used to retrieve a list of added items.

```
GET /api/item/search
```

- Take reference from [Yelp API](https://www.yelp.com/developers/documentation/v3/business_search).

**Auth required** : `YES`

**Query Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `term` | string | no | Search terms or business names. |
| `location` | string | no | Required if either latitude or longitude is not provided.  |
| `latitude` | decimal | no | Required if location is not provided. |
| `longitude` | decimal | no | Required if location is not provided. |
| `categories` | string | no | Categories to filter the search results with. |
| `limit` | integer | no | By default, it will return 20. Maximum is 50. |
| `offset` | integer | no | Offset the list of returned business results by this amount. |

**Success response** :

- **Code** : `200 OK`
- **Body** : Search results. 

```json5
{
  "total" : 0, // total number of items in that group.
  "items" : [
    {
      "itemURL" : "<string>[The URL that links to the resource webpage.]",
      "name" : "<string>[The display name of that item.]",
      "imgURL": "<string>[The URL that store the key picture of that item.]",
    }
  ]
}
```

- Omitted fields are the same as they are in Yelp documents. All other fields are of the same name except for `itemURL` and `imgURL`.
