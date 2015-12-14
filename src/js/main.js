/*globals MashupPlatform*/
window.onload = function () {
    "use strict";

    function highlightHigher(element1, element2, value1, value2) {

        var comparison = value1 > value2 ? 1 : (value2 > value1 ? -1 : 0);

        switch (comparison) {
            case 1:
                element1.addClass("highlight");
                break;
            case -1:
                element2.addClass("highlight");
                break;
            default:
        }
    }

    function clearHighlights() {
        $("td").removeClass("highlight");
    }

    function drawData(data) {

        $(".placeholder").hide();

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

        var publicDisk  = $("#f1-disk"),
            publicVCPU  = $("#f1-vcpu"),
            publicRAM   = $("#f1-ram"),
            publicName  = $("#f1-name"),
            privateDisk = $("#f2-disk"),
            privateVCPU = $("#f2-vcpu"),
            privateRAM  = $("#f2-ram"),
            privateName = $("#f2-name");

        var leftVCPU  = jdata.from.vcpus || 0,
            leftDisk  = jdata.from.disk || 0,
            leftRAM   = jdata.from.ram || 0,
            leftName  = jdata.from.name,
            rightVCPU = jdata.to.vcpus || 0,
            rightDisk = jdata.to.disk || 0,
            rightRAM  = jdata.to.ram || 0,
            rightName = jdata.to.name;


        publicDisk.text(leftDisk + " GiB");
        publicRAM.text(leftRAM + " MiB");
        publicVCPU.text(leftVCPU + " VCPUs");
        publicName.text(leftName);

        privateDisk.text(rightDisk + " GiB");
        privateRAM.text(rightRAM + " MiB");
        privateVCPU.text(rightVCPU + " VCPUs");
        privateName.text(rightName);

        clearHighlights();
        highlightHigher(publicVCPU, privateVCPU, leftVCPU, rightVCPU);
        highlightHigher(publicRAM, privateRAM, leftRAM, rightRAM);
        highlightHigher(publicDisk, privateDisk, leftDisk, rightDisk);

    }

    MashupPlatform.wiring.registerCallback("compare", drawData);
};
