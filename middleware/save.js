// 중복 방지?
function save(id, title, callback) {
    Value.findOneAndUpdate(
       {id: id, title: title}, /* query */
       {id: id, title: title}, /* update */
       { upsert: true}, /* create if it doesn't exist */
       callback);
}

