# Service APIs: Matching Room

## (1) Get a list of rooms

Used to retrieve a list of matching rooms for a registered User.

```
GET /api/room/list
```

**Auth required** : `YES`

**Query Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `offset` | integer | no | Starting position in the table. By default: `0`. |
| `limit` | integer | no | Max size of response data. By default: `100`. |
| `state` | boolean | no | If to filter inactive matching rooms, use `true`. |

**Success response** :

- **Code** : `200 OK`
- **Body** :  

```json
{
  "data" : [
    {
      "groupId" : "<string>[matching room id]",
      "roomName" : "<string>[display name of the room]",
      "isCompleted": "<boolean>[whether the match is completed or not]",
      "organizer": "<string>[organizer's user ID]"
    }
  ]
}
```

**Error responses**

1. Not authorized.

- **Condition** : If the user is not logged in, or an non-admin user is querying anther user's list. 

- **Code** : `401 unauthorized`

- **Content** :

```json
{
    "msg": "Login required."
}
```

## (2) Create

Used to create a new matching group/room.

```
POST /api/room
```

**Auth required** : `YES`

**Request Body (JSON)** :

```json
{
    "roomName": "[initial display name of the matching group]"
}
```

**Success response** :

- **Code** : `201 CREATED`
- **Body** : the same as `API(3): get a group profile by id`.

**Error responses**

1. Not authorized.

- **Condition** : If the user is not logged in. 

- **Code** : `401 unauthorized`

- **Content** :

```json
{
    "msg": "Login required."
}
```

## (3) Get the profile of a room

Used to retrieve detailed information about a matching rooms by gid.

```
GET /api/room/<group id>
```

**Auth required** : `YES`

**Path Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `gid` | string | yes   | Matching room ID. |

**Success response** :

- **Code** : `200 OK`
- **Body** :  

```json5
{
  "groupId": "<string>[doc id of that matching room]",
  "roomName": "<string>[display name of that matching room",
  "isCompleted": "<boolean>[whether the match is completed or not]",
  "organizerUid": "<string>[organizer's user ID]",
  "members": [{
    "userId": "", "displayName": "", "photoURL": ""
  }],
  "items": [{"name": "", "itemURL":  ""}] // Not implemented; use '/item/list' instead.
}
```

**Error responses**

1. Not authorized: the same as in API (2).

## (4) Update a group profile

Used to update the profile of a matching group.

```
PUT /api/room/<group_id>
```

**Auth required** : `YES`

**Request body (JSON)** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `roomName` | string | no   | Display name of the room. |
| `isCompleted` | boolean | no | State of that matching process. |
| `organizerUid` | string | no | organizer's user ID.|

**Success response** :

- **Code** : `200 OK`
- **Body** :  the same as `API(3): get a group profile by id`.

**Error responses**

1. Not authorized: the same as in API (2).

## (5) Join a matching group

Used to let a user join a matching group.

```
PUT /api/room/<group_id>/member
```

**Auth required** : `YES`

**Path parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `groupId` | string | yes  | Matching room ID. |

**Success response** :

- **Code** : `200 OK`
- **Body** :  the same as `API(3): get a group profile by id`.

**Error responses**

1. Not authorized: the same as in API (2).

2. Bad parameters:

- **Condition** : Either the user ID or the group ID is invalid. 

- **Code** : `400`

- **Content** :

```json
{
    "msg": "Invalid group id."
}
```

## (6) Get the results at a matching room

Retrieve the results or stats of a matching room.

```
GET /api/room/<group_id:string>/stats
```

**Auth required** : `YES`

**Path parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `groupId` | string | yes  | Matching room ID. |

**Success response** :

- **Code** : `200 OK`
- **Body** :

```json5
{
  "data" : [
    {
        "like": 1, // upvote count
        "dislike" : 2,
        "item": {
          "name": "", "itemId":  ""
        } // the details about that item 
    }
  ], // not sorted
  "isCompleted": true // state of that matching room.
}
```
