var settings;

// вырианты отображения элемента

// варианты положения элемента внутри контейнера
position = [

    // 0 - положение, соответствующее хранению размеров в БД
    {
        x: 'x',
        y: 'y',
        z: 'z',
        wx: 'wx',
        wy: 'wy',
        wz: 'wz'
    },

    // 1 - поворот 90º относительно оси X
    {
        x: 'x',
        y: 'z',
        z: 'y',
        wx: 'wx',
        wy: 'wz',
        wz: 'wy'
    },

    // 2 - поворот 90º относительно оси Y
    {
        x: 'z',
        y: 'y',
        z: 'x',
        wx: 'wz',
        wy: 'wy',
        wz: 'wx'
    },

    // 3 - поворот 90º относительно оси Z
    {
        x: 'y',
        y: 'x',
        z: 'z',
        wx: 'wy',
        wy: 'wx',
        wz: 'wz'
    },

    // 4 - поворот 90º относительно оси X, 90º относительно оси Y
    {
        x: 'z',
        y: 'x',
        z: 'y',
        wx: 'wy',   // wx wy     34      34      77
        wy: 'wz',   // wz wz     77      202     202
        wz: 'wx'    // wy wx     202     77      34
    },

    // 5 - поворот 90º относительно оси Y, 90º относительно оси X
    {
        x: 'y',
        y: 'z',
        z: 'x',
        wx: 'wz',
        wy: 'wx',
        wz: 'wy'
    },
];



// настройки элементов и внутренних элементов
const normalView = {

    // для корневого элемента - контейнера
    canvasWx: 500,
    canvasWy: 865,
    depth: 3,
    disposition: {
        x: 'x',
        y: 'y',
        wx: 'wx',
        wy: 'wy',
        wz: 'wz'
    },
    active: false,
    padding: 0,
    border: 0,
    borderColor: '#000000',
    autoFit: 'contain',
    item: {

        // для внутренних элементов
        depth: 2,
        disposition: {
            x: 'x',
            y: 'y',
            wx: 'wx',
            wy: 'wy',
            wz: 'wz'
        },
        active: false,
        padding: 0,
        border: 0,
        borderColor: '#000000',
        // showText: true,
        autoFit: 'none',
        item: {

            // для внутренних элементов
            depth: 1,
            disposition: {
                x: 'x',
                y: 'y',
                wx: 'wx',
                wy: 'wy',
                wz: 'wz'
            },
            active: false,
            padding: 0,
            border: 0,
            borderColor: '#000000',
            showText: false,
            autoFit: 'none',
        },
    },
};



// если элемент повернут, меняем wy <> wz
const turnedView = {

    // для корневого элемента - контейнера
    canvasWx: 500,
    canvasWy: 800,
    depth: 3,
    disposition: {
        x: 'x',
        y: 'y',
        wx: 'wx',
        wy: 'wz',
        wz: 'wy'
    },
    active: false,
    padding: 0,
    border: 0,
    borderColor: '#000000',
    autoFit: 'contain',
    item: {

        // для внутренних элементов
        depth: 2,
        disposition: {
            x: 'x',
            y: 'y',
            wx: 'wx',
            wy: 'wz',
            wz: 'wy'
        },
        active: false,
        padding: 0,
        border: 0,
        borderColor: '#000000',
        // showText: true,
        autoFit: 'none',
        item: {

            // для внутренних элементов
            depth: 1,
            disposition: {
                x: 'x',
                y: 'y',
                wx: 'wx',
                wy: 'wy',
                wz: 'wz'
            },
            active: false,
            padding: 0,
            border: 0,
            borderColor: '#000000',
            showText: false,
            autoFit: 'none',
        },
    }
};

