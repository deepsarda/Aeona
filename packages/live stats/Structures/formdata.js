class FormData {
    constructor(data){
        this.shard = new Map();
    }
    _patch(newdata){
        if(!this.shard.has(newdata.id)) return this._add(newdata);
        this.shard.set(newdata.id, {
            id: newdata.id,
            status: newdata.status,
            message: newdata.message,
            cpu: newdata.cpu,
            ram: newdata.ram,
            ping: newdata.ping,
            guildcount: newdata.guildcount,
            upsince: newdata.upsince,
            lastupdated: Date.now()
        })
    }

    _add(newdata){
        this.shard.set(newdata.id, {
            id: newdata.id,
            status: newdata.status,
            message: newdata.message,
            cpu: newdata.cpu,
            ram: newdata.ram,
            ping: newdata.ping,
            guildcount: newdata.guildcount,
            upsince: newdata.upsince,
            lastupdated: Date.now()
        })
    }

    shardData(shardID, options = {}){
        if(options.all){
            return [...this.shard.values()]
        }else{
            return this.shard.get(shardID)
        }
    }

    totalData(){
        const rawdata = [...this.shard.values()];
        let status = 0;
        let cpu = 0;
        let ram = 0;
        let ping = 0;
        let guildcount = 0;
        let upsince = 0;
        let lastupdated = 0;
        for(let i = 0; i < rawdata.length; i++){
            status += Number(rawdata[i].status);
            cpu += Number(rawdata[i].cpu);
            ram += Number(rawdata[i].ram);
            ping += Number(rawdata[i].ping);
            guildcount += Number(rawdata[i].guildcount);
            upsince += Number(rawdata[i].upsince)
            lastupdated += Number(rawdata[i].lastupdated)
        }
        if(!rawdata.length) status = 5;
        if(status > 7) status = 9;
        return {status: status, cpu: Number((cpu/rawdata.length).toFixed(2)), ram: Number((ram/rawdata.length).toFixed(2)), ping: Number((ping/rawdata.length).toFixed(2)), guildcount: guildcount, upsince: Number((upsince/rawdata.length).toFixed(2)),  lastupdated: Number((lastupdated/rawdata.length).toFixed(2))}
    }

    humanize(rawdata){
        if(Array.isArray(rawdata)){
            const result = [];
            for(let i = 0; i < rawdata.length; i++){
                result.push(this.humanize(rawdata[i]))
            }
            return result;
        }
        let color;
        let status;
        let cpu;
        let ram;
        let ping;
        let guildcount;
        if(rawdata.status === 0) {
            status = 'Online';
            color = 'green';
        }
        if(0 < rawdata.status && rawdata.status < 5) {
           if(rawdata.status === 1) status = 'Connecting';
           if(rawdata.status === 2) status = 'Reconnecting';
           if(rawdata.status === 3) status = 'Idling';
           if(rawdata.status === 4) status = 'Nearly';
            color = 'yellow';
        }
        if(rawdata.status === 5) {
            status = 'Disconnected';
            color = 'red';
        }
        if(rawdata.status > 5) {
            if(rawdata.status === 6) status = 'Waiting for Guilds';
            if(rawdata.status === 7) status = 'Identifying';
            if(rawdata.status === 8) status = 'Resuming';
            if(rawdata.status === 9) status = 'System Disconnected';
            color = 'grey';
        }

        cpu = rawdata.cpu + `%`;
        ram = rawdata.ram + ` MB`;
        ping  = rawdata.ping  + ` ms`;
        guildcount = rawdata.guildcount + ` Guilds`;
        const upsince = Number(rawdata.upsince)
        const lastupdated = Number(rawdata.lastupdated)
        return {cpu, ram, ping, guildcount, status, color, upsince, lastupdated,id: rawdata.id, message: rawdata.message}
    }
}
module.exports = FormData;
