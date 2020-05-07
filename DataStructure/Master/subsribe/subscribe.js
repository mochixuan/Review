const observe = {
    listenerTags: {},
    listener: (tag,callback) => {
        this.listenerTags[tag] = callback;
    },
    unListener: (tag) => {
        if (tag != null) delete this.listenerTags[tag];
    },
    emit: (tag,obg) => {
        if (this.listenerTags.includes(tag)) {
            this.listenerTags[tag](obg)
        }
    }
}


const window = {
    listener: {},
    addListener: (tag,func) => {
        listener[tag] = func;
    },
    removeListener: (tag) => {
        delete listener[tag];
    },
    dispatch: (tag,args) => {
        if (listener[tag] != null) {
            listener[tag](args);
        }
    }
}