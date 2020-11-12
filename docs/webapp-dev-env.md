# Front-end development instructions

## Setup

Run the following commands at `webapp` directory: `npm install` or `yarn`. This would help you install the dependency libraries.

Run `npm run start` or `yarn start` to start the dev server. Then the React app would be available on `localhost:3000`. The dev server would update the app each time you save a change to the project dynamically.

## Testing framework

- The app is initialized using "create-react-app". It came with "Jest" & "testing-library/react".
- `Jest` provides a powerful "expect" function.
- `testing-library/react` provides "render" function to use in tests. `Enzyme` can be an alternative.

## Mock framework

- `mock.js` can fake the response from backends.
- It actually setup a server that simply map request to jsons.
