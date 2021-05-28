# Discord.db
An innovative way to store Discord userdata

## How it works
Discord.db stores data in messages. A channel is treated as a "collection" and you can use querries to filter through each "document" (message).

![image](https://user-images.githubusercontent.com/76178582/119926787-e1a3b280-bf2c-11eb-964b-f1a424bb1b2c.png)

## Limitations
This database is completely free to use, but there are some drawbacks:
- Discord ratelimits
- 2000 character limit for each document
- All documents are loaded into memory, even if you're searching by ID

## Demo
```js
const Datastore = require('./db.js');
const Discord = require('discord.js');
const express = require('express');

const { Client, MessageEmbed } = Discord;
const { Interface } = Datastore;
const client = new Client();
const db = new Interface(client);
const app = express();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  db.collection('847659131460780103').query({ key: 'value' }).get().then(console.log); // prints each document where `key` is `value`
});

app.get('/', (req, res) => res.send('OK'));

client.login(process.env.TOKEN);

app.listen(8080, () => console.log('Open on *:8080'));
```

## Documentation

---------------------

### `new Interface (client)`
Generates a new interface - `Interface`
### `Interface#collection(channelID)`
Get a collection from a channel - `Collection`

---------------------

### `new Collection (channel)`
Converts a channel to a collection - `Collection`
### `Collection#all()`
Returns all documents in this collection - `Promise<Array<Object>>`
### `Collection#insert(document)`
Inserts a document and returns the inserted document - `Promise<Object>`
### `Collection#query(query)`
Returns a query that you can GET, UPDATE, or DELETE. Query is either a filter function or an object to match - `Query`

---------------------

### `new Query(query)`
Generate a new query - `Query`
### `Query#get()`
Gets this query and returns all matching documents - `Promise<Array<Object>>`
### `Query#delete()`
Deletes all documents matching this query - `Promise<>`
### `Query#edit(overwrite)`
Overwrites all keys with their new valies in the `overwrite` parameter - `Promise<>`
