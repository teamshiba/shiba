# Service APIs: Voting & Items

## (1) Vote for an item

Used to like or hate an item in the candidate list.

```
PUT /api/item/vote
```

**Auth required** : `YES`

**Request body (JSON)** : 

| Attribute | Type | Required | Description |
| :------: | :-----: | :-----: | :--------- |
| `userId` | string | yes | User ID. |
| `groupId` | string | yes | Target matching room ID. |
| `itemId` | string | yes | Global item ID. |
| `type` | integer | yes | Thumb up: `1`; thumb down: `-1`. |

**Success response** :

- **Code** : `200 OK`
- **Body** :  none.

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