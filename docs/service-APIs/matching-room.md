# Service APIs: Matching Room

## (1) Get a list of rooms

Used to retrieve a list of matching rooms for a registered User.

```
GET /api/room/list?uid=<user id>
```

**Auth required** : `YES`

**Query Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `uid` | string | yes   | User ID. |
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
      "displayName" : "<string>[display name of the room]",
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
    "userId": "[creator/organizer's user ID]",
    "displayName": "[initial display name of the matching group]"
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
GET /api/room?gid=<group id>
```

**Auth required** : `YES`

**Query Parameters** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `gid` | string | yes   | Matching room ID. |

**Success response** :

- **Code** : `200 OK`
- **Body** :  

```json
{
  "groupId": "<string>[doc id of that matching room]",
  "displayName": "<string>[display name of that matching room",
  "link": "<string>[the URL that others can click to join the group]",
  "completed": "<boolean>[whether the match is completed or not]",
  "organizer": "<string>[organizer's user ID]",
  "members": [{
    "userId": "", "displayName": "", "avatarUrl": ""
  }],
  "items": []
}
```

**Error responses**

1. Not authorized: the same as in API (2).

## (4) Update a group profile

Used to update the profile of a matching group.

```
PUT /api/room
```

**Auth required** : `YES`

**Request body (JSON)** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `groupId` | string | yes   | Matching room ID. |
| `displayName` | string | no   | Display name of the room. |
| `link` | string | no   | URL for sharing the room. |
| `organizer` | string | no | organizer's user ID.|

**Success response** :

- **Code** : `200 OK`
- **Body** :  the same as `API(3): get a group profile by id`.

**Error responses**

1. Not authorized: the same as in API (2).

## (5) Join a matching group

Used to let a user join a matching group.

```
PUT /api/room/join
```

**Auth required** : `YES`

**Request body (JSON)** :

| Attribute | Type     | Required | Description   |
| :--------: | :--------: | :--------: | :-------------- |
| `userId` | string | yes   | Matching room ID. |
| `groupId` | string | yes  | User ID. |

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
GET /api/room/stats?gid=<group ID>
```

**Auth required** : `YES`
