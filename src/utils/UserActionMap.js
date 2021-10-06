export function UserActionMap(idle, action){
    let data = []

    this.findDocId = (docId) => {
        return data.find(doc => doc.docId === docId)
    }

    this.create = (docId, now) => {
        const getDoc = this.findDocId(docId)
        this.clean(now)
        if (!getDoc) {
            data.push({docId: docId, lastUpdate: now, list: []})
        }
    }

    this.update = (docId, actionContent) => {
        const getDoc = this.findDocId(docId)
        if (getDoc) {
            const user = getDoc.list.find(user => user.id === actionContent.id)
            if (user) {
                user[action] = actionContent[action]
            } else {
                getDoc.list.push(actionContent)
            }
        } else {
            const now = new Date()
            this.create(docId, now)
        }
    }

    this.removeUser = (userId) => {
        data.forEach(doc => {
            doc.list = doc.list.filter(user => user.id !== userId)
        })
    }

    this.clean = (now) => {
        data = data.filter(doc => (now - new Date(doc.lastUpdate)) <= idle)
    }

    this.getResult = (docId, now) => {
        const getDoc = this.findDocId(docId)
        if(getDoc){
            getDoc.list = getDoc.list.filter(user => (now - new Date(user.time)) <= idle)
            return getDoc.list
        }
        return []
    }
}
