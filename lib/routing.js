if(Meteor.isClient){
    FlowRouter.route("/",{
        action:function(params){
            console.log('frist route')
            BlazeLayout.render("layout-wordparser",{main:"words"})
        }
    })
}

