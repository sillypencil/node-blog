//表单验证
var validateParams = getVlidateParams();
validateParams.rules = {
    username: { required: true },
    password: { required: true }
};
validateParams.messages = {
    username: { required: "请输入用户账号" },
    password: { required: "请输入密码" }
}
validateParams.submitHandler = function( form ){
    validateBeforeSubmit( form );
    $( form ).ajaxSubmit({
        success: function( data ){
            if( data.error == 0 ){
                redirectTo("/home");
            } else {
                validateAfterSubmit( form );
                layer.alert( data.message );
            }

        },
        error: function (error ){
            layer.alert( error );
        }
    })
}
$("#sign_form").validate(validateParams);
