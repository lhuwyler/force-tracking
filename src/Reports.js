const Storage = require('node-storage')
const _ = require('lodash')

class Reports {
    constructor(){
        this.store = new Storage("storage/storage.json")
    }

    logReport(lat, long, callsign, opstate, message, ttl){

        if (isNaN(lat) || isNaN(long)){
            lat = 47.084873
            long = 8.333177
        }

        let entry = {
            lat,
            long,
            callsign,
            opstate,
            message,
            ttl,
            timestamp: new Date()
        }

        let existing = this.store.get(`movcon`)

        if (existing){
            existing.push(entry)
            this.store.put(`movcon`, existing)
        } else {
            this.store.put(`movcon`, [entry])
        }
        
    }

    getReports(){
        this.getNewestReports()
        let reports = this.store.get(`movcon`)
        return _.orderBy(reports, r => new Date(r.timestamp), "desc")
    }

    getNewestReports(){
        let reports = this.store.get(`movcon`)
        reports = _.orderBy(this.store.get(`movcon`), o => new Date(o.timestamp), "desc")
        reports = _.groupBy(reports, r => r.callsign)
        reports = _.map(Object.values(reports), r => r[0])
        return reports
    }
}

module.exports = new Reports()