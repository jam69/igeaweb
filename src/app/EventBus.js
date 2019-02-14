
/**
 * copied from : https://medium.com/@soffritti.pierfrancesco/create-a-simple-event-bus-in-javascript-8aa0370b3969
 *  + migrated for using Classes
 *  + added cached responses
 */


export class EventBus {

    constructor() {
       
    }

    subscriptions = {};


    static subscribe(eventType, callback) {
        const id = _getIdGenerator.getNextUniqueId()

        if (!subscriptions[eventType])
            subscriptions[eventType] = {}

        subscriptions[eventType][id] = callback

        return {
            unsubscribe: () => {
                delete subscriptions[eventType][id]
                if (Object.keys(subscriptions[eventType]).length === 0) delete subscriptions[eventType]
            }
        }
    }

    static publish(eventType, arg) {
        if (!subscriptions[eventType])
            return

        Object.keys(subscriptions[eventType]).forEach(key => subscriptions[eventType][key](arg))
    }

    static _getIdGenerator() {
        let lastId = 0

        return function getNextUniqueId() {
            lastId += 1
            return lastId
        }
    }

}
