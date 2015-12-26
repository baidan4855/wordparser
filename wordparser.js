if (Meteor.isClient) {
    var uContent = new ReactiveVar();
    var raResult = new ReactiveVar();
    Template.hello.events({
        'click button': function (e, t) {
            var uc = t.$('#uContent').val();
            if (!uc) {
                console.log("您没有输入内容");
                return;
            }
            Meteor.call('segment', uc, function (err, result) {
                if (err) {
                    console.log("发生错误!");
                    console.log(err);
                    return;
                }
                var ucArr = _.map(uc,function(c){
                    return {w:c};
                })
                uContent.set(ucArr);
                raResult.set(result);
            })
        }
    });

    Template.words.helpers({
        segments: function () {
            return raResult.get();
        },
        userContent: function () {
            return uContent.get();
        }
    })

    Template.words.events({
        'click a':function(e,t){
            resethl();
            highlight(this.w)
        }
    })

    var resethl=function(){
        var ggs = uContent.get();
        if(_.isEmpty(ggs)) return;
        uContent.set(_.map(ggs,function(uc){
            delete uc.c;
            return uc;
        }))

    }
    var highlight = function (key) {
        var ggs = uContent.get();
        var firstLocations = [];
        for (var i = 0; i < ggs.length; i++) {
            if (ggs[i].w=== key[0]) {
                if(key.length === 1){
                    ggs[i].c="hl";
                    break;
                }
                firstLocations.push(i);
                break;
            }
        }
        if (firstLocations.length) {
            _.each(firstLocations, function (fe) {
                var tempLocs = [fe];
                for (var i = 1; i < key.length; i++) {
                    var curLoc = _.last(tempLocs);
                    var nextLoc = (curLoc < ggs.length - 1) ? curLoc + 1 : 0;
                    if (!nextLoc) {
                        break;
                    }
                    if (ggs[nextLoc].w === key[i]) {
                        tempLocs.push(nextLoc);
                        if (i == key.length - 1)
                            _.each(tempLocs, function (ele) {
                                ggs[ele].c="hl";
                            })
                    } else {
                        break;
                    }
                }
            })
        }
        uContent.set(ggs);
    }
}
