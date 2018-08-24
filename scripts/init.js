var APP = {};

(function(APP) {

	function initEditor(socket, editorTextArea, roomId, value) {
		function onEditorChange(editor) {
        	socket.emit("edit", editor.getValue(), roomId);
    	}

		var editor = CodeMirror.fromTextArea(editorTextArea, {
            lineNumbers: true,
            lineWrapping: true,
            mode: value,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        editor.setSize("100%", "100%");

        editor.on("change", onEditorChange);

        socket.on("updateEditor", function(content) {
            editor.off("change", onEditorChange);
            editor.setValue(content);
            editor.on("change", onEditorChange);
        });

        return editor;
	};

	function initLenguageSelect(lenguageSelect, editor) {
		lenguageSelect.on("change", function() {
            editor.setOption("mode", lenguageSelect.val());
        });
	};

	function initCopyRoomLinkButton(copyRoomLinkButton, copyLocationInput, roomLocation) {
		copyRoomLinkButton.on("click", function() {
            copyLocationInput.val(roomLocation);

            copyLocationInput[0].select();

            document.execCommand("copy");
        });
	};

	function initUsersList(users, socket) {
		socket.on("newUserJoined", function(userName) {

        });
	};

	APP.init = function(options) {
		var socket = options.socket,
			roomId = options.roomId,
			roomLocation = options.roomLocation,
			name = options.name,
			editorTextArea = options.editorTextArea,
			lenguageSelect = options.lenguageSelect,
			copyRoomLinkButton = options.copyRoomLinkButton,
			copyLocationInput = options.copyLocationInput;

		socket.emit('room', roomId, name);

		socket.on('userInit', function(users) {
			var editor = initEditor(socket, editorTextArea, roomId, lenguageSelect.val());

			initLenguageSelect(lenguageSelect, editor);
			initCopyRoomLinkButton(copyRoomLinkButton, copyLocationInput, roomLocation);
			initUsersList(users, socket);
		});
	}
})(APP);