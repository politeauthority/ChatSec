/*
var password = 'L0ck it up saf3';
var plaintext = 'pssst ... đon’t tell anyøne!';
var ciphertext = Aes.Ctr.encrypt(plaintext, password, 256);
var origtext = Aes.Ctr.decrypt(ciphertext, password, 256);
*/

var password = 'L0ck it up saf3';

var socket;

$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function() {
        socket.emit('joined', {});
    });
    socket.on('status', function(data) {
        console.log(data);
        $('#chat').append(data.tpl);
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    socket.on('message', function(data) {
        unencrypted_msg = Aes.Ctr.decrypt(data.msg, password, 256);
        $('#chat').append(data.tpl);
        $('#chat li:last-child .msg_content').text(unencrypted_msg);
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
        var audio = new Audio('/static/audio/new_msg.mp3');
        // audio.play();
    });
    socket.on('typing', function(data) {
        console.log('some ones fucking typing');
    });

    $('#text').keypress(function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            send_msg($('#text').val());
        } else {
            // socket.emit('typing', {'msg': 'typing'});            
            // console.log('typing');
        }
    });
    $('#send').click(function(e) {
        send_msg($('#text'));
    });

    // Timer Scripts
    window.setInterval(function(){
        // Update msg time
        $("#chat li").each(function( index ) {
            msg_time = $(this).attr('data-date');
            // console.log($(this).attr('data-date') );
            // console.log( index + ": " + $( this ).text() );
        });

        // Highlight code blocks
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }, 5000);


});
function leave_room(){
    socket.emit('left', {}, function() {
        socket.disconnect();
        // go back to the login page
        window.location.href = "/";
    });
}

function send_msg(msg){
    if(msg != ''){
        $('#text').val('');
        msg = Aes.Ctr.encrypt(msg, password, 256)
        console.log(msg);
        socket.emit('text', {msg: msg});
    }    
}