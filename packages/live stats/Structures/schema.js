class Schema{
    constructor(data = {}){
        this.id = isNaN(data.id) ? `NG` : data.id
        this.status = isNaN(data.status) ? 5 : data.status;
        this.cpu = isNaN(data.cpu) ? NaN : data.cpu;
        this.ram = isNaN(data.ram) ? NaN : data.ram;
        this.ping =  isNaN(data.ping) ? NaN : data.ping;
        this.message =  data.message || `No Data Recieved`;
        this.guildcount = isNaN(data.guildcount) ? NaN : data.guildcount;
        this.upsince =  isNaN(data.upsince) ? 0 : data.upsince;
    }
    toObject(){
        return this;
    }
}
module.exports = Schema;
