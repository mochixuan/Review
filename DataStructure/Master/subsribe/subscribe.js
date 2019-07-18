const observe = {
    listenerTags: {},
    listener: (tag,callback) => {
        this.listenerTags[tag] = callback;
    },
    unListener: (tag) => {
        if (tag != null) delete tag;
    },
    emit: (tag,obg) => {
        if (this.listenerTags.includes(tag)) {
            this.listenerTags[tag](obg)
        }
    }
}
