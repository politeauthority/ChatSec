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

function store_message(data){
    data_string = (JSON.stringify(data));
    room_key = 'room_' + data.room_key;
    chat_room_data = JSON.parse(localStorage.getItem(room_key));
    if(chat_room_data==null){
        chat_room_data = [];
    }
    chat_room_data.push(data_string);
    localStorage.setItem(room_key, JSON.stringify(chat_room_data));
}

function build_local_data(room_name){
    room_key = 'room_' + room_name;
    chat_room_data = JSON.parse(localStorage.getItem(room_key));
    if(chat_room_data == null){
        empty_array = [];
        localStorage.setItem(room_key, JSON.stringify(empty_array));
        return;
    }
    for(chat of chat_room_data){
        c = JSON.parse(chat);
        write_msg(c);
    }
}

function write_msg(msg_obj){
    unencrypted_msg = Aes.Ctr.decrypt(msg_obj.msg, Cookies.get('password'), 256);    
    filtered_msg = filter_msg( unencrypted_msg );
    $(msg_obj.tpl).insertBefore('#chat li:last');
    new_msg_li = $('#chat li:nth-last-child(2)');
    new_msg_li.find('.msg_content').html(filtered_msg);
    new_msg_user = new_msg_li.attr('data-user');

    // check if the last message was the same person and recent
    previous_message_li = $('#chat li:nth-last-child(3)');
    previous_message_type = previous_message_li.attr('data-type');
    append_to_last = false;
    if( 
         previous_message_li.attr('data-user') == new_msg_user
        &&
        previous_message_type == 'msg')
        {
        new_msg_li.find('.user_image_container').find('img').hide();
        previous_message_time = new Date(previous_message_li.attr('data-date'));
        diff = Math.round(Math.abs((new Date() - previous_message_time) / 1000));
        if(diff < 120){
            append_to_last = true;
        }
    }

    $('#chat').scrollTop($('#chat')[0].scrollHeight);
    if( previous_message_type == 'msg'){
    if(append_to_last == true){
            new_msg_li.find('h3').hide();
            new_msg_li.find('.msg_date').hide();
            new_msg_li.addClass('no_break_above');
            previous_message_li.addClass('no_break_below');
        }
    }
    msg_pretty_time = pretty_time_now(msg_obj.sent)
    new_msg_li.find('.msg_date').text(msg_pretty_time);
    if(Cookies.get('user_name')==new_msg_user){
        new_msg_li.addClass('msg_me');
    }
}

function pretty_time_now(msg_time){
    var now = new Date();
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
        msg_pretty_time = 'just now';
    }
    return msg_pretty_time;
}

function settings_update(){
    $('.setting-update').click(function(){
        setting_name = $(this).attr('name');
        if(setting_name=='clear_local'){
            localStorage.clear();
        }
    });
}

function lock_console(){
    $('#settings_btn').fadeOut();
    $('#chat_window').fadeOut();
    $('#lock_status').removeClass('fa-unlock-alt').addClass('fa-lock');
    $('#repassword_container').focus();
    $('#repassword_container').fadeIn(1500);
    Cookies.set('password', '');
    Cookies.set('terminal', 'locked');
}

function unlock_console(password){
    console.log('lets open this bitch');
    Cookies.set('password', password);
    build_local_data(Cookies.get('room_name'));
    $('#repassword_container').fadeOut(1500);
    $('#settings_btn').fadeIn();
    $('#chat_window').fadeIn();
    Cookies.set('terminal', 'open');
}

var socket;
var CHATSEC = CHATSEC || (function(){

    return {
        init : function(Args) {
            _args = Args;
            build_local_data(Cookies.get('room_name'));
            $('#room_name').html(':: ' + Cookies.set('room_name'));
            if(Cookies.get('password')==''){
                window.location = '/';
            }            
            Notification.requestPermission().then(function(result) {
                console.log(result);
            });

        },
        launch : function(){
            $('.typing').hide();
            $("#textbox").focus();


            // lockout
            var timeoutTime = 300000;
            var timeoutTimer = setTimeout(lock_console, timeoutTime);
            $('body').bind('mousedown mousemove keydown', function(event) {
                timeoutTimer = setTimeout(lock_console, timeoutTime);
            });
            $('.cs_login').keypress(function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    unlock_console($(this).val());
                    $(this).val('');
                }
            });                 

            // Sockets
            socket = io.connect(window.location.protocol + '//' + document.domain + ':' + location.port + '/chat');
            
            socket.on('connect', function() {
                socket.emit('joined', {});
            });
            
            socket.on('status', function(data) {
                $(data.tpl).insertBefore('#chat li:last');
                $('#chat').scrollTop($('#chat')[0].scrollHeight);
            });

            // Reciving user currently typing 
            socket.on('typing', function(data) {
                if(Cookies.get('user_name') != data.user_name ){
                    $('.typing').find('.typing_avatar').attr(
                        'src',
                        '/static/imgs/avatars/black/' + data.avatar
                    );
                    $('.typing').find('h3').text(data.user_name);
                    $('.typing').show().delay(750).fadeOut();
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                }
            });

            // Recieving a message
            socket.on('message', function(data) {
                write_msg(data);

                if(Cookies.get('user_name') != data.user_name ){
                    var audio = new Audio('/static/audio/new_msg.mp3');
                    audio.play();
                    spawnNotification(
                        filtered_msg, 
                        'http://www.google.com/', 
                        'ChatSec - ' + data.user_name );
                }
                store_message(data);
            });

            // Sending a message
            $('#textbox').keypress(function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    message = $('#textbox').val();
                    send_msg(message);
                    $('#textbox').val('');
                } else {
                    socket.emit('typing', {'msg': 'chatsec-user-typing'});
                }
            });

            $('#send').click(function(e){
                send_msg($('#textbox').val());
            });

            // @todo: make t his actually work or kill it
            $(window).on('beforeunload', function(){
                socket.emit('left', {}, function() {
                    socket.disconnect();
                });                
            });

            // Timer Scripts
            window.setInterval(function(){
                // Update msg time
                $("#chat li").each(function( index ) {
                    var sent_time = new Date( $(this).attr('data-date') );
                    msg_pretty_time = pretty_time_now(sent_time)
                    if(msg_pretty_time){
                        $(this).find('.msg_date').text(msg_pretty_time);
                    }
                });
                // Highlight code blocks
                $('pre').each(function(i, block) {
                    // hljs.highlightBlock(block);
                });
            }, 10000);
        }
    };
}());