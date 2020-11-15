# Firebase Cloud Store: Data Models

## Group

The matching room.

| Field path | Data type     | Description   |
| :--------: | :--------: | :-------------- |
| `accessLink` | string | The URL that others can click to join the group. |
| `creationTime` | timestamp | The creation time. |
| `isCompleted` | boolean | Whether the voting has completed. |
| `itemList` | string[ ] | An array of the option items' IDs. |
| `members` | string[ ] | An array of members' user IDs. |
| `roomName` | string | The display name of that matching room. |
| `organizerUid` | string | The organizer's user ID. |

## User

## Item

The collection of items.

| Field path | Data type     | Description   |
| :--------: | :--------: | :-------------- |
| `creationTime` | timestamp | The creation time. |
| `imgUrl` | string | The URL that store the key picture of that item. |
| `itemId` | string | The auto-generated item ID. |
| `itemUrl` | string | The URL that links to the resource webpage. |
| `name` | string | The display name of that item. |

## Voting

The voting records.

| Field path | Data type     | Description   |
| :--------: | :--------: | :-------------- |
| `creationTime` | timestamp | The creation time. |
| `groupId` | string | The corresponding group's ID. |
| `itemId` | string | Global item ID. |
| `type` | integer | Thumb up: `1`; thumb down: `-1`. |
| `userId` | string | User ID.  |
