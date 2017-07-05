//初始化validate参数
function getVlidateParams(){
    var params = {
        focusInvalid:false,
        showErrors: validateShowErrors,
        onkeyup: false,
        onclick:false,
        onfocusout: false,
        focusCleanup: true,
        rules:{

        },
        messages:{

        },
        ignore:"",
        showErrors: validateShowErrors,
        submitHandler: function( form ){
            $(form).submit();
        }
    }
    return params;
}

//validate显示错误信息的方法
function validateShowErrors(errorMap, errorList) {
    if(errorList.length > 0){
        var $element = $(errorList[0].element);
        var message = errorList[0].message;
        $errorTips = layer.tips(message, $element,{
            tips: [1, '#c00'],
            time: 4000000
        });
        $element.focus();
        $(window).on("click", function(){
//			debugger;
            if( event.target != $element ){
                layer.close( $errorTips );
            }
        })
        return false;
    }
}

//表单提交前准备
function validateBeforeSubmit( form ){
    if( layer )    window.$index = layer.load();
    /* 防止重复提交 */
    $(form).find(":submit").attr("disabled", true );
}

//表单提交后处理

function validateAfterSubmit( form ){
    if( layer ){
        if( window.$load ) layer.close( $load )
        else layer.closeAll();
    }
    $(form).find(":submit").attr("disabled", false );
}