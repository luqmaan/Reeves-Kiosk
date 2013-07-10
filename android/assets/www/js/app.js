function onDeviceReady() {

    /* Options */

    window.config = {
        syncInterval: 5 * 60 * 1000,
        online: navigator.onLine,
        idleWait: 3 * 60 * 1000
    };

    $.ajaxSetup({
        cache: 'false'
    });


    /* Start! */

    data.init();
    ui.init();

}


// Wait for Corodova to load or execute if desktop browser
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    $(window).ready(function () {
        onDeviceReady();
    });
}



/* EXTRAS */


(function ($) {

    var o = $({});

    $.subscribe = function () {
        o.on.apply(o, arguments);
    };

    $.unsubscribe = function () {
        o.off.apply(o, arguments);
    };

    $.publish = function () {
        o.trigger.apply(o, arguments);
    };

}(jQuery));

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

(function () {
    Date.prototype.toTimestamp = toTimestamp;

    function toTimestamp() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    }
})();

document.addEventListener("online", function () {
    config.online = true;
    console.log("phonegap detected the device is online!");
}, false);
document.addEventListener("offline", function () {
    config.online = false;
    console.log("phonegap detected the device is offline!");
}, false);

jQuery.fn.removefromdom = function (s) {
    if (!this) return;

    var bin = $("#IELeakGarbageBin");

    if (!bin.get(0)) {
        bin = $("<div id='IELeakGarbageBin'></div>");
        $("body").append(bin);
    }

    $(this).children().each(

    function () {
        bin.append(this);
        document.getElementById("IELeakGarbageBin").innerHTML = "";
    });

    //this.remove();
    //bin.append(this);
    document.getElementById("IELeakGarbageBin").innerHTML = "";
};

var happy = {
    USPhone : function(val) {
        return /^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(val)
    },
    email : function(val) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val);
    },
    minLength : function(val, length) {
        return val.length >= length;
    },
    maxLength : function(val, length) {
        return val.length <= length;
    },
    equal : function(val1, val2) {
        console.log('isEqual called', val1, val2);
        console.log((val1 == val2));
        return (val1 == val2);
    }
};
var clearMePrevious = '';

// clear input on focus
$('input').focus(function() {

    if($(this).val() == $(this).attr('title')) {
        clearMePrevious = $(this).val();
        $(this).val('');
    }
});
// if field is empty afterward, add text again
$('input').blur(function() {
    if($(this).val() == '') {
        $(this).val(clearMePrevious);
    }
});


var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-29208226-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();