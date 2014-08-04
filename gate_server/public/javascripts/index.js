/**
 * Created by imrlab on 2014. 7. 29..
 * Written by rehomik
 */

function keyPadController() {

  var _typedKeyPadArray = '';

  this.inputKey = function (key_pad_num, input_complete_callback) {

    _typedKeyPadArray += key_pad_num;

    if (4 === _typedKeyPadArray.length) {

      input_complete_callback(true);

      return;
    }

    input_complete_callback(false);

  }

  this.refreshTypedKeyColor = function (key_element) {

    key_element.removeClass('btn-danger').addClass('btn-success').text('O');
  }

  this.clearTypedKeyColor = function () {

    _typedKeyPadArray = '';

    for (var i = 1; i < 5; ++i) {

      var typed_pad_id = "#typedPad" + i;

      $(typed_pad_id).removeClass('btn-success').addClass('btn-danger').text('X');
    }
  }

  this.keyPadLength = function () {

    return _typedKeyPadArray.length;
  }

  this.getTypedKeypadNumbers = function () {

    return { keys: _typedKeyPadArray };
  }
}

var _keyPadCtr = new keyPadController();

$('#pad1, #pad2, #pad3, #pad4, #pad5, #pad6, #pad7, #pad8, #pad9, #pad0').each(function addClick() {

  $(this).click(function onClick() {

    var key_pad_num = $(this).text();

    _keyPadCtr.inputKey(key_pad_num, function inputComplete(result) {

      var data_length = _keyPadCtr.keyPadLength();
      var typed_pad_id = "#typedPad" + data_length;

      _keyPadCtr.refreshTypedKeyColor($(typed_pad_id));

      if (result) {

        // Send keypad data to server
        $.ajax({
          type: 'POST',
          url: '/',
          data: _keyPadCtr.getTypedKeypadNumbers(),
          success: function (data) {

            _keyPadCtr.clearTypedKeyColor();
          }
        });

        return;
      }
    });
  });
});

$('#padClear').click(function onClick() {

  _keyPadCtr.clearTypedKeyColor();
});