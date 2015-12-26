Segment = Npm.require('segment');

var _segment;
Meteor.startup(function(){
    _segment = new Segment();
    _segment.useDefault();
})


Meteor.methods({
    'segment':function(str,options){
        if(!str)
            return [];
        var segs = _segment.doSegment(str);
        if(!_.isEmpty(segs)){
            var uniqueArr = function(arr) {
                var res = [], hash = {};
                for(var i=0, elem; (elem = arr[i]) != null; i++)  {
                    if (!hash[elem.w])
                    {
                        res.push(elem);
                        hash[elem.w] = true;
                    }
                }
                return res;
            }

            segs= uniqueArr(segs,"w");
            _.each(segs,function(seg){
                seg.h=str.split(seg.w).length-1;
            })
            segs=_.sortBy(segs,function(au){
                return 0-au.h;
            })
        }
        return segs;
    }
})


