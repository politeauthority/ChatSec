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

function spawn_notification(msg_obj) {
    if(window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
            if(Cookies.get('terminal')=='unlocked'){
                title = 'ChatSec - ' + msg_obj.user_name;
                msg = Aes.Ctr.decrypt(msg_obj.msg, Cookies.get('password'), 256);
            } else {
                title ='Chatsec';
                msg = 'New message recieved.';
            }
            var n = new Notification('Title', { 
                body: msg,
                icon: 'static/imgs/avatars/black/' + msg_obj.avatar
            });
            setTimeout(n.close.bind(n), 5000);               
        });
    }
}

function store_message(data){
    data_string = (JSON.stringify(data));
    storage_key = 'room_' + data.room_key;
    chat_room_data = JSON.parse(localStorage.getItem(storage_key));
    if(chat_room_data==null){
        chat_room_data = [];
    }
    chat_room_data.push(data_string);
    localStorage.setItem(storage_key, JSON.stringify(chat_room_data));
}

function build_local_data(room_key){
    storage_key = 'room_' + room_key;
    chat_room_data = JSON.parse(localStorage.getItem(storage_key));
    if(chat_room_data == null){
        empty_array = [];
        localStorage.setItem(storage_key, JSON.stringify(empty_array));
        return;
    }
    for(chat of chat_room_data){
        c = JSON.parse(chat);
        draw_msg(c);
    }
}

function draw_msg(msg_obj){
    unencrypted_msg = Aes.Ctr.decrypt(msg_obj.msg, Cookies.get('password'), 256);    
    filtered_msg = filter_msg( unencrypted_msg );
    $(msg_obj.tpl).insertBefore('#chat li:last');
    new_msg_li = $('#chat li:nth-last-child(2)');
    new_msg_li.find('.msg_content').html(filtered_msg);
    new_msg_user = new_msg_li.attr('data-user');

    
    msg_pretty_time = pretty_time_now(msg_obj.sent)
    new_msg_li.find('.msg_date').text(msg_pretty_time);
    if(Cookies.get('user_name')==new_msg_user){
        new_msg_li.addClass('msg_me');
    }
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
    if($('#chat li').length <= 1){
        return
    }

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

    if( previous_message_type == 'msg'){
        if(append_to_last == true){
            new_msg_li.find('h3').hide();
            new_msg_li.find('.msg_date').hide();
            new_msg_li.addClass('no_break_above');
            previous_message_li.addClass('no_break_below');
        }
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
    }else if(diff <= 5400){
        minutes = Math.round(diff / 60);
        if(minutes == 1){
            msg_pretty_time = '1 minute ago';
        } else {
            msg_pretty_time = minutes + ' mintues ago';
        }
    }else if(diff > 5401){
        hours = Math.round(diff / 3600)
        msg_pretty_time = 'about '+hours+' hours ago';
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
    $('#repassword_container').fadeIn(1500);
    $("#repassword").focus();
    $( "#chat li" ).each(function(index) {
        if(! $(this).hasClass('typing')){
            $(this).remove();
        }
    });    
    Cookies.set('password', '');
    Cookies.set('terminal', 'locked');
}

function unlock_console(password){
    Cookies.set('password', password);
    Cookies.set('terminal', 'open');
    build_local_data(Cookies.get('room_key'));
    $('#lock_status').removeClass('fa-lock').addClass('fa-unlock-alt');    
    $('#repassword_container').fadeOut(1500);
    $('#settings_btn').fadeIn();
    $('#chat_window').fadeIn();
    $("#textbox").focus();
    $('#chat').scrollTop($('#chat')[0].scrollHeight);    
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime >= 2) { // 120 seconds
        lock_console();
    }
}

var socket;
var idleTime = 0;

var CHATSEC = CHATSEC || (function(){

    return {
        init : function(Args) {
            _args = Args;

            $('#room_name').html(':: ' + Cookies.set('room_name'));
            $('title').html('Chatsec::  ' + Cookies.set('room_name'));
            
            window.Notification.requestPermission().then(function(result) {
                Cookies.set('notifications', true);
                console.log(result);
            });

        },
        launch : function(){
            if(Cookies.get('password')==''){
                window.location = '/';
            }

            $(document).ready(function(){
                build_local_data(Cookies.get('room_key'));                
                $('.typing').hide();                
                $("#textbox").focus();

                // Manual/Idle Lockout 
                $('#lock_btn').click(function(){
                    lock_console();
                });
                var idleInterval = setInterval(timerIncrement, 60000); // 60 seconds
                //Zero the idle timer on mouse movement.
                $(this).mousemove(function (e) {
                    idleTime = 0;
                });
                $(this).keypress(function (e) {
                    idleTime = 0;
                });
                $('.cs_login').keypress(function(e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) {
                        unlock_console($(this).val());
                        $(this).val('');
                        timeoutTime = 0;
                        // set_login_creds($(this));
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
                    draw_msg(data);

                    if(Cookies.get('user_name') != data.user_name ){
                        var audio = new Audio('/static/audio/new_msg.mp3');
                        audio.play();
                        spawn_notification(data);
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
                }, 1000);
            });
        }
    };
}());