"use strict";




export class Graphic {

    // -------------------------------------------------------
    // Функция | осветляет или затемняет цвет в парамеетре color,
    //           переданный в формате #rrggbb
    //           на велдечину percent, переданную в процентах
    static shadeColor (color = "#000000", percent = 0) {
        var num = parseInt (color.slice(1), 16);
        var amt = Math.round(2.55 * percent);
        var R = (num >> 16) + amt;
        var G = (num >> 8 & 0x00FF) + amt;
        var B = (num & 0x0000FF) + amt;
        var new_color = ("#" + (0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString (16).slice (1)
        );
        return new_color;
    }
}
        

