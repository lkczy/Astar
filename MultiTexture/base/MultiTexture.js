// TexturedQuad.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n'+
    '}\n';

//ƬԪ��ɫ������
    var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'vec4 color0 = texture2D(u_Sampler0,v_TexCoord);\n' +
    'vec4 color1 = texture2D(u_Sampler1,v_TexCoord);\n' +
    'gl_FragColor = color0 * color1;\n' +
    '}\n';


function main() {
    // ��ȡ<canvas>Ԫ��
    var canvas = document.getElementById('webgl');

    // ��ȡWebGL������
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //��ʼ����ɫ��
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }


    //���ö�����Ϣ
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //����������ʼ������
    if(!initTextures(gl,n)){
        console.log('Failed to set the position of the texture');
        return;
    }
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        //�������꣬��������
        -0.5,  0.5,   0.0,1.0,
        -0.5, -0.5,   0.0,0.0,
         0.5,  0.5,   1.0,1.0,
         0.5, -0.5,   1.0,0.0
    ]);
    var n = 4;//������Ŀ

    //��������������
    var verticesTexCoordBuffer = gl.createBuffer();
    if (!verticesTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }

    //������������󶨵�Ŀ��
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexCoordBuffer);
    //�򻺳���������д������
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //��ȡattribute�����Ĵ���λ��

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //����������������a_Position����
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
    //����a_Position�������������Ļ���������
    gl.enableVertexAttribArray(a_Position);

    //��������������a_TexCoord������
    var a_TexCoord=gl.getAttribLocation(gl.program,'a_TexCoord');
    if(a_TexCoord<0){
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl,n){
    var texture0 =gl.createTexture();//�����������
    var texture1 =gl.createTexture();
    if(!texture0){
        console.log('Failed to create the texture object');
        return;
    }
    if(!texture1){
        console.log('Failed to create the texture object');
        return;
    }

    //��ȡu_Sampler
    var u_Sampler0=gl.getUniformLocation(gl.program,'u_Sampler0');
    var u_Sampler1=gl.getUniformLocation(gl.program,'u_Sampler1');
    if(!u_Sampler0){
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }
    if(!u_Sampler1){
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    //����һ��image����
    var image0 = new Image();
    var image1 = new Image();
    if (!image0) {
        console.log('Failed to create the image object');
        return false;
    }
    if (!image1) {
        console.log('Failed to create the image object');
        return false;
    }
    //ע��ͼ������¼�����Ӧ����
    image0.onload=function(){loadTexture(gl,n,texture0,u_Sampler0,image0,0);};
    image1.onload=function(){loadTexture(gl,n,texture1,u_Sampler1,image1,1);};
    //�������ʼ����ͼ��
    image0.src='../resources/sky.jpg';
    image1.src='../resources/circle.gif';

    return true;
}
//�������Ԫ�Ƿ��Ѿ�����
var g_texUnit0=false,g_texUnit1=false;
function loadTexture(gl,n,texture,u_Sampler,image,texUnit){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//������ͼ�����y�ᷴת
    if(texUnit==0){
        //����0������Ԫ
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0=true;
    }else{
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1=true;
    }
    
    //��target���������
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //�����������
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //��������ͼ��
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //��0�������ݸ���ɫ��
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);   //��� <canvas>
    if(g_texUnit0&&g_texUnit1){
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // ���Ƴ�����
    }
}


