Segment = Npm.require('segment');

var _segment;
Meteor.startup(function () {
    _segment = new Segment();
    _segment.useDefault();
})


Meteor.methods({
    'segment': function (str, options) {
        if (!str)
            return [];
        var segs = _segment.doSegment(str, options);
        if (!_.isEmpty(segs)) {
            var hash = {};
            for (var i = 0, elem; (elem = segs[i]) != null; i++) {
                var curr = hash[elem.w] || 0;
                hash[elem.w] = curr + 1
            }
            segs = _.map(hash, function (v, k) {
                return {w: k, h: v}
            })
            segs = _.sortBy(segs, function (au) {
                return 0 - au.h;
            })
        }
        return segs;
    }
})


