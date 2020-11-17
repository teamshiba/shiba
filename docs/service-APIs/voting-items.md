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
      "itemUrl" : "<string>[The URL that links to the resource webpage.]",
      "name" : "<string>[The display name of that item.]",
      "imgUrl": "<string>[The URL that store the key picture of that item.]",
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



