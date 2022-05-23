const fetch = require('node-fetch');
class Client{
    constructor(client, config){
        this.client = client;
        this.config = config;
        this.shardMessage = new Map();
        this._validateOptions();
        this.deleteCachedShardStatus();
        this._attachEvents();
        this._autopost();
    }
    
    post(){
        const shards = [...this.client.ws.shards.values()]
        const guilds = [...this.client.guilds.cache.values()]
  
        for(let i = 0; i < shards.length; i++){
          const body =  {
             "id": shards[i] ? shards[i].id : NaN,
             "status": shards[i]? shards[i].status : 5,
             "cpu": (Math.random()*3).toFixed(2),
             "ram": getRamUsageinMB(),
             "message": (this.shardMessage.get(shards[i]? shards[i].id : NaN) || `No Message Available`),
             "ping": shards[i]? shards[i].ping : NaN,
             "guildcount": (guilds ? guilds.filter(x => x.shardId === shards[i].id).length : 0),
             "upsince": this.client.uptime,
           };
           fetch(`${this.config.stats_uri}stats`, {
             method: 'post',
             body:    JSON.stringify(body),
             headers: { 
                 'Authorization': Buffer.from(this.config.authorizationkey).toString('base64'),
                 'Content-Type': 'application/json' 
             },
           }).then(res => res.json()).then((m) => this._handleMessage(m)).catch((e) => console.log(new Error(e)))
        }
    }

    deleteCachedShardStatus(){
       return   fetch(`${this.config.stats_uri}deleteShards`, {
            method: 'post',
            body:  JSON.stringify({kill: true, shards: 'all'}),
            headers: { 
                'Authorization': Buffer.from(this.config.authorizationkey).toString('base64'),
                'Content-Type': 'application/json' 
            },
          }).catch((e) => e)
    }

    _autopost(){
        setInterval(()=> {
              this.post()          
        }, this.config.postinterval)
    }

    _attachEvents(){
        this.client.on('debug', (message) => {
            if(message.includes(`Shard`)){
                const shards = [...this.client.ws.shards.values()]
                for(let i = 0; i < shards.length; i++){
                    if(message.includes(`[WS => Shard ${shards[i].id}]`)){
                        this.shardMessage.set(shards[i].id, message.replace(`[WS => Shard ${shards[i].id}]`, ''))
                    }
                }
            }
        })
    }

    _handleMessage(message){
        if(!message.kill) return;
        if(message.shard === undefined) return;
        if(this.client.ws.shards.has(message.shard)) return this.client.ws.shards.get(message.shard).destroy();
        return false;
    }

    _validateOptions(){
        if(!this.config.authorizationkey) throw new Error('Pls provide your choosen Authorization Key for verifying Requests.');
        if(this.config.postinterval && isNaN(this.config.postinterval)) throw new Error('The PostInterval is not a valid Time. Provide the Interval in milliseconds');
        if(!this.config.postinterval) this.config.postinterval = 1000;
    }
}
module.exports = Client;


function getRamUsageinMB(){
  let mem = process.memoryUsage();
  return Number((mem.rss / 1024 / 1024).toFixed(2));
}
