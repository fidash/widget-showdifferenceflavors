/*globals MashupPlatform*/
window.onload = function () {
    "use strict";

    MashupPlatform.wiring.registerCallback("compare", function (data) {
        var jdata;
        try {
            jdata = JSON.parse(data);
        } catch (err) {
            throw new MashupPlatform.wiring.ValueTypeError();
        }

        jdata.from = (jdata.from == null) ? jdata.left : jdata.from;
        jdata.to = (jdata.to == null) ? jdata.left : jdata.to;

        if (jdata.from == null || jdata.to == null) {
            throw new MashupPlatform.wiring.ValueTypeError();
        }

        var leftcpu = jdata.from.vcpus || 0,
            leftdisk = jdata.from.disk || 0,
            leftram = jdata.from.ram || 0,
            rightcpu = jdata.to.vcpus || 0,
            rightdisk = jdata.to.disk || 0,
            rightram = jdata.to.ram || 0;

        var publicdisk = document.getElementById("publicdisk"),
            publiccpu = document.getElementById("publiccpu"),
            publicram = document.getElementById("publicram"),
            privatedisk = document.getElementById("privatedisk"),
            privatecpu = document.getElementById("privatecpu"),
            privateram = document.getElementById("privateram");

        var maxl = Math.max(String(leftdisk).length,
                            String(leftcpu).length,
                            String(leftram).length);


        var diskdiff = leftdisk !== rightdisk;
        var ramdiff = leftram !== rightram;
        var cpudiff = leftcpu !== rightcpu;
        var diskgreater = leftdisk > rightdisk;
        var ramgreater = leftram > rightram;
        var cpugreater = leftcpu > rightcpu;

        publicdisk.innerHTML = '<div class="' + ((diskgreater) ? "green" : "") + '" style="float: right;">' + leftdisk + '</div>';
        publicdisk.style.width = maxl + 'em';
        publiccpu.innerHTML = '<div class="' + ((cpugreater) ? "green" : "") + '" style="float: right;">' + leftcpu + '</div>';
        publiccpu.style.width = maxl + 'em';
        publicram.innerHTML = '<div class="' + ((ramgreater) ? "green" : "") + '" style="float: right;">' + leftram + '</div>';
        publicram.style.width = maxl + 'em';

        privatedisk.innerHTML = '<div class="' + ((diskdiff && !diskgreater) ? "green" : "") + '" style="float: left;">' + rightdisk + '</div>';
        privatecpu.innerHTML = '<div class="' + ((cpudiff && !cpugreater) ? "green" : "") + '"  style="float: left;">' + rightcpu + '</div>';
        privateram.innerHTML = '<div class="' + ((ramdiff && !ramgreater) ? "green" : "") + '" style="float: left;">' + rightram + '</div>';

        // var diskdiff = leftdisk !== rightdisk;
        // var ramdiff = leftram !== rightram;
        // var cpudiff = leftcpu !== rightcpu;

        // publicdisk.innerHTML = '<div class="' + ((diskdiff) ? "red" : "") + '" style="float: right;">' + leftdisk + '</div>';
        // publicdisk.style.width = maxl + 'em';
        // publiccpu.innerHTML = '<div class="' + ((cpudiff) ? "red" : "") + '" style="float: right;">' + leftcpu + '</div>';
        // publiccpu.style.width = maxl + 'em';
        // publicram.innerHTML = '<div class="' + ((ramdiff) ? "red" : "") + '" style="float: right;">' + leftram + '</div>';
        // publicram.style.width = maxl + 'em';

        // privatedisk.innerHTML = '<div class="' + ((diskdiff) ? "green" : "") + '" style="float: left;">' + rightdisk + '</div>';
        // privatecpu.innerHTML = '<div class="' + ((cpudiff) ? "green" : "") + '"  style="float: left;">' + rightcpu + '</div>';
        // privateram.innerHTML = '<div class="' + ((ramdiff) ? "green" : "") + '" style="float: left;">' + rightram + '</div>';
    });
};
