$( document ).ready(function() {
	jQuery(function($){

		var socket = io.connect();
		var $nickForm = $('#send-nick');
		var $nickError = $('#login-error');
		var $nickBox = $('#nickname');
		var $users = $('#users');
		var $messageForm = $('#send-message');
		var $messageBox = $('#message');
		var $chat = $('#chat');

		$nickForm.submit(function(e){
			e.preventDefault();
			socket.emit('new_user', $nickBox.val(), function(data){
				if(data){
					$('#nickWrap').hide();
					$('#contentWrap').show();
				} else{
					$nickError.show();
				}
			});
			$nickBox.val('');
		});

		socket.on('usernames', function(data){
			var html = '';
			for(var i=0; i < data.length; i++){
				html += data[i] + '<br/>'
			}
			$users.html(html);
		});

		$messageForm.submit(function(e){
			e.preventDefault();
			socket.emit('send_message', $messageBox.val(), function(data){
				// add stuff later
				$chat.append('<span class="error">' + data + "</span><br/>");
			});
			$messageBox.val('');
		});

		socket.on('load_old_msgs', function(docs){
			for (var i = docs.length - 1 ; i >= 0; i--) {
				displayMsg(docs[i]);
			};
		});

		socket.on('new_message', function(data){
			displayMsg(data);
		});

		socket.on('whisper', function(data){
			displayPrivateMsg(data);
		});

		function displayMsg(data){
			$chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
		}

		function displayPrivateMsg(data){
			$chat.append('<span class="whisper"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
		}
	});

});