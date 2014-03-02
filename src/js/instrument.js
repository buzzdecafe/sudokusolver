


module.exports = {
  init: function() {
    var undef, startTime, endTime, ops = 0;

    return {
      getDuration: function() {
        return endTime - startTime;
      },

      getOps: function() {
        return ops;
      },

      start: function() {
        startTime = startTime || new Date();
        ops += 1;
      },

      end: function() {
        endTime = new Date();
      },

      reset: function() {
        startTime = undef;
        endTime = undef;
        ops = 0;
      }

    };
  }

};


