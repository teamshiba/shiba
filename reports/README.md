 # Testing 
 
 ## Frontend test
 
 ### Uncovered testcase:
 
 - Button in AddItems `index.tsx` that indicates that an item has already been added to the list. 
 - Making a user an organizer in the room profile page. This function is triggered by an onClick event. The actual implementation of the function is unit tested in `group-store.ts`. On the same note, we did not handle the onClick branches for removing users, updating the group name, and ending the match. 
 - Opening the URL of the item in the statistics page
 - Renaming username in the UserProfile `index.tsx`. However, the function inside handleRename, which is the rename function in `user-store.ts` is unit tested. 
 - When a user tries to access their profile without logging in, they are returned an empty page. 
 
 ## Backend test
 
### Uncovered testcase:

-  `utils.decorators.check_token` is the function decorator that works as a preprocessor for each API call. It's 
difficult to test because it's merely about Google authentication API & it's not a normal function but a function
function decorator.  
