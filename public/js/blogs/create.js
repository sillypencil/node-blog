$("#submit").click(function () {
    var html = editor.$txt.html()
    // var reg = /^<h1.*blog_title.*>$|^<img.*thumbnail.*>$/g;
    var reg = /(<h1[^<\/]*blog_title[^<\/]*<\/h1>)|(<img[^>]*thumbnail[^>]*>)/g
    html = html.replace( reg, "" );
    var title = $("#title_inputer").val();
    var thumbnail = $("#thumnail").attr("src");
    if( !title ) title="";
    $.ajax({
        type: "post",
        url : "/blogs/create",
        data: {
            html: html,
            title: title,
            thumbnail: thumbnail
        },
        success: function( data ){
            console.dir( data );
            if( !data.error ){
                layer.msg("博客提交成功！",{
                   btn: ["确定"],
                   yes: function(){
                        window.location.href = "/blogs/one/" + data.blogId;
                    }
                });
            }
        },
        error: function( error ){
            console.dir( error );
        }
    });
});