class Code{
    constructor(config){
        this.config = config;
        this.codes = new Map();
    }
    addSession(code){
        this.codes.set(code, Date.now())
        setTimeout(()=>{
            this.codes.delete(code)
        }, (this.config.loginExpire || 60*10000))
    }
    checkSession(code){
        if(this.codes.has(code)) return true;
        return false;
    }
}
module.exports = Code;