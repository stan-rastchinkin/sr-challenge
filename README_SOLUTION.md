## Running the application
1. Install the dependencies
`$ npm install`

2. Run the tests
`$ npm test`

3. Run the application
```
$ docker compose up
$ npm run build && npm start
```

This makes application available on `localhost:8000`

### Configuration note:
Normally we do not include .env files into repositories. For the purpose of review convenience I included `.env` and `.test.env` files that provide configuration for local development and testing respectively.
- **PORT** - port on which the application will be available
- **MAX_POLL_INTERVAL** - maximum interval between polls of the source website
- **SOURCE_BASE_URL** - base url of the simulator API
