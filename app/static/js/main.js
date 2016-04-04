/*
var password = 'L0ck it up saf3';
var plaintext = 'pssst ... đon’t tell anyøne!';
var ciphertext = Aes.Ctr.encrypt(plaintext, password, 256);
var origtext = Aes.Ctr.decrypt(ciphertext, password, 256);
*/

var password = 'L0ck it up saf3';

var socket;

$(document).ready(function(){
    $('.typing').hide();
    $("#text").focus();
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    
    socket.on('connect', function() {
        socket.emit('joined', {});
    });
    
    socket.on('status', function(data) {
        $('#chat').append(data.tpl);
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });

    socket.on('message', function(data) {
        if (data.msg == 'chatsec-user-typing'){
            $('.typing').show().delay(750).fadeOut();;
        } else {
            unencrypted_msg = Aes.Ctr.decrypt(data.msg, password, 256);
            filtered_msg = filter_msg( unencrypted_msg );
            $(data.tpl).insertBefore('#chat li:last');
            // console.log($('#chat li:nth-last-child(2)').find('.msg_content').html('hey'));
            $('#chat li:nth-last-child(2)').find('.msg_content').html(filtered_msg);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
            var audio = new Audio('/static/audio/new_msg.mp3');
            audio.play();
        }
    });

    $('#text').keypress(function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            send_msg($('#text').val());
        } else {
            socket.emit('text', {'msg': 'chatsec-user-typing'});
        }
    });

    $('#send').click(function(e) {
        send_msg($('#text').val());
    });

    // Timer Scripts
    window.setInterval(function(){
        // Update msg time
        $("#chat li").each(function( index ) {
            var now = new Date();
            var msg_time = new Date( $(this).attr('data-date') );
            diff = Math.round(Math.abs( now - msg_time) / 1000);
            msg_pretty_time = false;
            if(diff < 60){
                msg_pretty_time = 'seconds ago';
            } else if(diff < 3600 ){
                minutes = Math.round(diff / 60);
                if(minutes == 1){
                    msg_pretty_time = '1 minutes ago';
                } else {
                    msg_pretty_time = minutes + ' mintues ago';
                }
            }
            if(msg_pretty_time){
                $(this).find('.msg_date').text(msg_pretty_time);
            }

            // console.log( index + ": " + $( this ).text() );
        });

        // Highlight code blocks
        $('pre').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }, 10000);


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

function filter_msg(msg){
    msg = filter_code(msg);
    console.log(msg);
    return msg;
}

function filter_code(msg){
    if(msg.substring(0,5)=='/code'){
        msg = '<pre>' + msg.substring(5) + '</pre>';
    }
    return msg;
}

function filter_code(msg){
    if(msg.substring(0,5)=='/code'){
        msg = '<pre>' + msg.substring(5) + '</pre>';
    }
    return msg;
}