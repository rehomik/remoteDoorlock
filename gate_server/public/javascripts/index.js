/**
 * Created by imrlab on 2014. 7. 29..
 * Written by rehomik
 */

var _typedKeyPadArray = [];

var typeKeypad = function (key_pad_num, input_complete_callback) {

  _typedKeyPadArray.push(key_pad_num);

  if (4 === _typedKeyPadArray.length) {

    input_complete_callback(true);

    return;
  }

  input_complete_callback(false);

}

var refreshKeypadColor = function (data_array) {

  var data_length = data_array.length;

  var typed_pad_id = "#typedPad" + data_length;

  $(typed_pad_id).removeClass("btn-danger").addClass("btn-success").text('O');
}

$('#pad1, #pad2, #pad3, #pad4, #pad5, #pad6, #pad7, #pad8, #pad9').each(function addClick() {

  $(this).click(function onClick() {

    var key_pad_num = $(this).text();

    typeKeypad(key_pad_num, function inputComplete(result) {

      refreshKeypadColor(_typedKeyPadArray);

      if (result) {

        console.log("confirm");

        return;
      }
    });
  });

});