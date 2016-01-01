var uContent = new ReactiveVar();
var raResult = new ReactiveVar();
var currHl = new ReactiveVar();
Template.inputPanel.events({
    'click button': function (e, t) {
        var uc = t.$('#uContent').val();
        if (!uc) {
            console.log("您没有输入内容");
            return;
        }
        var option = {'stripPunctuation': t.$('#stripPunctuation').is(':checked')};
        Meteor.call('segment', uc, option, function (err, result) {
            if (err) {
                console.log("发生错误!");
                console.log(err);
                return;
            }
            var ucArr = _.map(uc, function (c) {
                return {w: c};
            })
            uContent.set(ucArr);
            raResult.set(result);
            var list = [];
            if (!_.isEmpty(result)) {
                list = _.map(result, function (obj) {
                    return [obj.w, obj.h];
                })
            }
            WordCloud(document.getElementById('word-cloud'), {
                list: list,
                //backgroundColor: "#ffe0e0",
                fontFamily: "Times, serif",
                gridSize: Math.round(16 * $('#word-cloud').width() / 1024),
                weightFactor: function (size) {
                    return size * $('#word-cloud').width() / 102;
                },
                rotateRatio: 0.5
            });
        })
    }
});

Template.words.helpers({
    segments: function () {
        return raResult.get();
    },
    userContent: function () {
        return uContent.get();
    },
    isHl: function () {
        return this.w === currHl.get() ? "hl" : "";
    }
})

Template.words.events({
    'click a': function (e, t) {
        resethl();
        currHl.set(this.w);
        highlight(this.w)
    }
})

var resethl = function () {
    var ggs = uContent.get();
    if (_.isEmpty(ggs)) return;
    currHl.set(undefined);
    uContent.set(_.map(ggs, function (uc) {
        delete uc.c;
        return uc;
    }))

}
var highlight = function (key) {
    var ggs = uContent.get();
    var firstLocations = [];
    for (var i = 0; i < ggs.length; i++) {
        if (ggs[i].w === key[0]) {
            if (key.length === 1) {
                ggs[i].c = "hl";
            } else {
                firstLocations.push(i);
            }
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
                            ggs[ele].c = "hl";
                        })
                } else {
                    break;
                }
            }
        })
    }
    uContent.set(ggs);
}