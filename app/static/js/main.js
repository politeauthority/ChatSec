var socket;

function leave_room(){
    socket.emit('left', {}, function() {
        socket.disconnect();
        // go back to the login page
        window.location.href = "/";
    });
}

function send_msg(msg){
    msg = msg.trim();
    if(msg != ''){
        $('#text').val('');
        msg = Aes.Ctr.encrypt(msg, Cookies.get('password'), 256)
        socket.emit('text', {'msg': msg});
    }    
}

function filter_msg(msg){
    msg = msg.trim();
    msg = filter_code(msg);
    msg = filter_href(msg);
    return msg;
}

function filter_code(msg){
    if(msg.substring(0,5)=='/code'){
        msg = '<pre>' + msg.substring(5) + '</pre>';
    }
    return msg;
}

function filter_href(msg){
    geturl = new RegExp(
        "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))",
        "g");
    if(msg.match(geturl) && msg.match(geturl).length){
        msg.match(geturl).forEach(function(_url){
            msg = msg.replace(_url, '<a href="'+_url+'" target="_new">'+_url+'</a>')
            ext = _url.slice(-4)
            if(ext=='jpeg' || ext=='.jpg' || ext=='.gif' || ext=='.png'){
                msg = msg + '<br/><img class="chat-img img-responsive" src="'+_url+'">';
                // console.log(msg);                
            }
        });
    }
    return msg;
}

function spawnNotification(theBody,theIcon,theTitle) {
    if( ! window.onfocus ){
        var options = {
          body: theBody,
          icon: theIcon
        }
        var n = new Notification(theTitle,options);
        setTimeout(n.close.bind(n), 5000);         
    }
}


var CHATSEC = CHATSEC || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            console.log( 'starting' );
            Cookies.set('name', _args[0]);
            Cookies.set('password', _args[1]);
            Cookies.set('avatar', _args[2]);

            Notification.requestPermission().then(function(result) {
              console.log(result);
            });

        },
        launch : function(){

            $(document).ready(function(){
                $('.typing').hide();
                $("#text").focus();
                // $('#chat_window').hide();
                socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
                
                socket.on('connect', function() {
                    socket.emit('joined', {});
                });
                
                socket.on('status', function(data) {
                    // console.log( data );
                    $(data.tpl).insertBefore('#chat li:last');
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                });

                // Typing a message
                socket.on('typing', function(data) {
                    if(Cookies.get('username') != data.username ){
                        $('.typing').find('.typing_avatar').attr(
                            'src',
                            '/static/imgs/avatars/' + data.avatar
                        );
                        $('.typing').find('h3').text(data.username)
                        $('.typing').show().delay(750).fadeOut();
                        $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    }
                });

                // Recieving a message
                socket.on('message', function(data) {
                    unencrypted_msg = Aes.Ctr.decrypt(data.msg, Cookies.get('password'), 256);
                    filtered_msg = filter_msg( unencrypted_msg );
                    $(data.tpl).insertBefore('#chat li:last');
                    $('#chat li:nth-last-child(2)').find('.msg_content').html(filtered_msg);
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    if(Cookies.get('name') != data.username ){
                        var audio = new Audio('/static/audio/new_msg.mp3');
                        audio.play();
                        spawnNotification(
                            filtered_msg, 
                            'http://www.google.com/', 
                            'ChatSec - ' + data.username );
                    }
                });

                // Sending a message
                $('#text').keypress(function(e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) {
                        message = $('#text').val();
                        send_msg(message);
                    } else {
                        // console.log('typing!');
                        socket.emit('typing', {'msg': 'chatsec-user-typing'});
                    }
                });

                $('#send').click(function(e){
                    send_msg($('#text').val());
                });

                // @todo: make this work across the socket and hit all clients
                $('#clear_msgs').click(function(e){
                    $('#chat li').each(function(){
                        if(!$(this).hasClass('typing')){
                            $(this).remove();
                        }
                    });
                });

                $(window).on('beforeunload', function(){
                    socket.emit('left', {}, function() {
                        socket.disconnect();
                    });                
                });

                // Timer Scripts
                window.setInterval(function(){
                    // Update msg time
                    $("#chat li").each(function( index ) {
                        var now = new Date();
                        var msg_time = new Date( $(this).attr('data-date') );
                        diff = Math.round(Math.abs( now - msg_time) / 1000);
                        msg_pretty_time = false;
                        if(diff < 20){
                            msg_pretty_time = 'seconds ago';
                        }else if(diff < 60){
                            msg_pretty_time = 'less then a minute ago'
                        } else if(diff < 3600){
                            minutes = Math.round(diff / 60);
                            if(minutes == 1){
                                msg_pretty_time = '1 minute ago';
                            } else {
                                msg_pretty_time = minutes + ' mintues ago';
                            }
                        } else {
                            msg_pretty_time = false;
                        }
                        if(msg_pretty_time){
                            $(this).find('.msg_date').text(msg_pretty_time);
                        }
                    });

                    // Highlight code blocks
                    $('pre').each(function(i, block) {
                        // hljs.highlightBlock(block);
                    });
                }, 10000);
            });
        }
    };
}());