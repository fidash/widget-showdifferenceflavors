/*globals MashupPlatform, objectDiff */
window.onload = function () {
    "use strict";

    var stringifyObjectKey = function stringifyObjectKey (key) {
        return /^[a-z_$][a-z0-9_$]*$/i.test(key) ?
            key :
            JSON.stringify(key);
    };

    var escapeHTML = function escapeHTML (string) {
        return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    var inspect = function inspect (obj) {
        switch (typeof obj) {
        case 'object':
            var properties = [];
            for (var key in obj) {
                properties.push(stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(obj[key]));
            }
            return '<span>{</span>\n<div class="level">' + properties.join('<span>,</span>\n') + '\n</div><span>}</span>';

        case 'string':
            return JSON.stringify(escapeHTML(obj));

        default:
            return escapeHTML(obj.toString());
        }
    };

    var showDifferences = function showDifferences(diff, maxleft, maxright) {
        var propleft = [];
        var propright = [];

        for (var key in diff) {
            var changed = diff[key].changed;
            var nspacesleft = " "; // new Array(Math.max(1, maxleft - key.length + 1)).join(" ");
            var nspacesright = " "; // new Array(Math.max(1, maxright - key.length + 1)).join(" ");
            switch (changed) {
            case 'equals':
                propleft.push(stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesleft + '</span>' + inspect(diff[key].value));
                propright.push(stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesright + '</span>' + inspect(diff[key].value));
                break;

            case 'removed':
                propleft.push('<del>' + stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesleft + '</span>' + inspect(diff[key].value) + '</del>');
                propright.push('<span></span>');
                break;

            case 'added':
                propleft.push('<span></span>');
                propright.push('<ins>' + stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesright + '</span>' + inspect(diff[key].value) + '</ins>');
                break;

            case 'primitive change':
                var prefixleft = stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesleft + '</span>';
                var prefixright = stringifyObjectKey(escapeHTML(key)) + '<span>:' + nspacesright + '</span>';
                propleft.push('<delwrap>' + prefixleft + '<del class="key">' + escapeHTML(inspect(diff[key].removed)) + '</del>' + '</delwrap>');
                propright.push('<inswrap>' + prefixright + '<ins class="key">' + escapeHTML(inspect(diff[key].added)) + '</ins>' + '</inswrap>');
                break;

            case 'object change':
                var res = showDifferences(diff[key].diff);
                propleft.push(stringifyObjectKey(key) + '<span>: </span>' + res.left);
                propright.push(stringifyObjectKey(key) + '<span>: </span>' + res.right);
                break;
            }
        }

        // var result = {
        //     left: '<span>{</span>\n<div class="level">' + propleft.join('<span>,</span>\n') + '\n</div><span>}</span>',
        //     right: '<span>{</span>\n<div class="level">' + propright.join('<span>,</span>\n') + '\n</div><span>}</span>'
        // };

        var result = {
            left: '<div>' + propleft.join('\n') + '\n</div>',
            right: '<div>' + propright.join('\n') + '\n</div>'
        };

        return result;
    };

    var findMaximum = function findMaximum(obj) {
        var m = 0;
        var keys = Object.keys(obj);
        for (var k in keys) {
            m = Math.max(keys[k].length, m);
        }
        return m;
    };

    MashupPlatform.wiring.registerCallback("compare", function (data) {
        var jdata;
        try {
            jdata = JSON.parse(data);
        } catch (err) {
            throw new MashupPlatform.wiring.ValueTypeError();
        }
        if (jdata.from == null || jdata.to == null) {
            throw new MashupPlatform.wiring.ValueTypeError();
        }

        var fromnamehtml = "";
        var tonamehtml = "";

        if (jdata.fromname != null && jdata.toname != null) {
            fromnamehtml = "<name>" + jdata.fromname + "</name>\n\n";
            tonamehtml = "<name>" + jdata.toname + "</name>\n\n";
        }

        var diff = objectDiff.diffOwnProperties(jdata.from, jdata.to);
        var results = showDifferences(diff, findMaximum(jdata.from), findMaximum(jdata.to));
        document.getElementById("original").innerHTML = fromnamehtml + results.left;
        document.getElementById("newone").innerHTML = tonamehtml + results.right;
    });
};
