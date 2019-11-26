// ClickedPoints.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'gl_PointSize=10.0;\n' +
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(0.0,0.0,1.0,1.0);\n' +
    '}\n';


function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');

    // 获取WebGL上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //获取attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    //注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
    var g_points = [];//鼠标点击位置数组
    function click(ev, gl, canvas, a_Position) {
        var x = ev.clientX;//鼠标点击处的X坐标
        var y = ev.clientY;//鼠标点击处的Y坐标
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
        y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
        //将坐标储存到g_points数组中
        g_points.push(x);
        g_points.push(y);

        // 清除 <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        var len = g_points.length;
        for (var i = 0; i < len; i+=2) {
            //将点的位置传递到变量a_Position中
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
            //绘制一个点
            gl.drawArrays(gl.POINTS, 0, 1);
        }    
    }


