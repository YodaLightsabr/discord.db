const Discord = require('discord.js');
const fetchAll = require('discord-fetch-all');

class Interface {
  constructor (client) {
    this.client = client;
  }
  collection (id) {
    return new Collection(this.client.channels.cache.get(id));
  }
}
class Collection {
  constructor (channel) {
    this.channel = channel;
    this.client = channel.client;
  }
  all () {
    return new Promise((resolve, reject) => {
      fetchAll.messages(this.channel, { reverseArray: false, userOnly: false, botOnly: false, pinnedOnly: false }).then(messages => {
        resolve(messages.filter(a => a.author.id == this.client.user.id).map(message => {
          let object = JSON.parse(message.content);
          object._id = message.id;
          return object;
        }));
      });
    });
  }
  query (query) {
    return new Query(this, query);
  }
  insert (object) {
    return new Promise((resolve, reject) => {
      this.channel.send(JSON.stringify(object)).then(message => {
        object._id = message.id;
        resolve(object);
      });
    });
  }
}
class Query {
  constructor (collection, query) {
    this.collection = collection;
    this.query = query;
  }
  get () {
    return new Promise((resolve, reject) => {
      this.collection.all().then(data => {
        if (this.query instanceof Function) {
          resolve(data.filter(this.query));
        } else {
          resolve(data.filter(item => {
            const query = this.query;
            let valid = true;
            for (const key in query) {
              if (item[key] !== query[key]) valid = false;
            }
            return valid;
          }));
        }
      });
    });
  }
  edit (overwrite) {
    return new Promise((resolve, reject) => {
      this.get().then(data => {
        data.forEach(item => {
          this.collection.channel.messages.fetch(item._id).then(message => {
            for (const key in overwrite) {
              item[key] = overwrite[key];
            }
            item._id = undefined;
            message.edit(JSON.stringify(item));
          });
        });
      });
    });
  }
  delete () {
    return new Promise((resolve, reject) => {
      this.get().then(data => {
        data.forEach(item => {
          this.collection.channel.messages.fetch(item._id).then(message => {
            message.delete();
          });
        });
      });
    });
  }
}
module.exports = {
  Interface: Interface,
  Query: Query,
  Collection: Collection
}
