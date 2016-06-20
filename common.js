var common = function(){
    this.get_elapsed_time = function(then) {
        return new Date().getTime() - then.getTime();
    }
}

module.exports = new common();